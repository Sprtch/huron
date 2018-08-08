#!/usr/bin/python3.6
import logging
import asyncio
from aioconsole import ainput
# import aiohttp
from jinja2 import Environment, PackageLoader
from evdev import InputDevice, categorize, ecodes
import subprocess as sp
import signal
import os
from quart import Quart, render_template, redirect, request, url_for

logging.basicConfig(filename='/var/log/zebra.log',level=logging.DEBUG)

# Flask Init
app = Quart(__name__)

# Jinja2 Init
env = Environment(
    loader=PackageLoader(__name__, 'templates')
)

BARCODE_QUEUE = asyncio.Queue(loop=asyncio.get_event_loop())

# Make the keyboard mapping between the scandata received from evdev and the
# actual value on the keyboard (should be qwerty).
KEYBOARD_MAPPING = {
    # Keyboard code: actual number
    11: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
    28: 'ENTER',
}

@app.route('/')
def main():
    return render_template('html/index.html')

@app.route('/print', methods=['POST'])
async def create():
    form = await request.form
    barcode = form["barcode"]
    number = form["number"]

    if number.isdigit():
        number = int(number)
    else:
        number = 1

    for _ in range(number):
        await BARCODE_QUEUE.put(barcode)
    return redirect(url_for('main'))

@app.route('/update', methods=['POST'])
async def update():
    try:
        sp.check_output(['git', 'pull', 'origin', 'master'])
    except:
        logger.error("No repository settled up")
    return redirect(url_for('main'))

def usb_scanner_checker():
    USB_SCANNER_PATH = "/dev/input/by-id/usb-SCANNER_SCANNER_08FF20150112-event-kbd"
    dev = None
    while True:
        if os.path.exists(USB_SCANNER_PATH):
            logging.info("Plugged barcode scanner")
            dev = InputDevice(USB_SCANNER_PATH)
        else:
            logging.warning("Still no barcode scanner plugged")
            dev = None

        yield dev

async def process_barcode():
    while True:
        barcode = await BARCODE_QUEUE.get()
        template = env.get_template('productbarcode40x100.zpl')

        filename = '/tmp/%s.zpl' % (barcode)
        file = open(filename, 'w')
        file.write(str(template.render(name='Barcode', number=barcode))) # Get part name from database.
        file.close()

        logging.info("Launching the print of the barcode: %s" % (barcode))

        sp.check_output(['lpr', '-P', 'zebra', '-o', 'raw', filename])

async def input_listener():
    while True:
        barcode = await ainput(">>>")
        await BARCODE_QUEUE.put(barcode)

async def barcode_scanner_listener():
    barcode = ''
    g = usb_scanner_checker()
    for dev in g:
        if dev is None:
            await asyncio.sleep(5)
            continue
        try:
            dev.grab()
            async for ev in dev.async_read_loop():
                if ev.type == ecodes.EV_KEY:
                    data = categorize(ev)
                    key = KEYBOARD_MAPPING.get(data.scancode, None)
                    if  key == None or key == 'ENTER':
                        await BARCODE_QUEUE.put(barcode)
                        barcode = ''
                        break
                    if data.keystate == 1:
                        barcode += str(key)
            dev.ungrab()
        except OSError:
            logging.warning("Barcode scanner just disconnected")


def main():
    loop = asyncio.get_event_loop()

    loop.create_task(barcode_scanner_listener())
    # loop.create_task(input_listener())
    loop.create_task(process_barcode())

    app.run(debug=True, loop=loop)
    loop.close()

def cleaning(signumb, frame):
    loop = asyncio.get_event_loop()
    loop.close()

if __name__ == "__main__":
    signal.signal(signal.SIGINT, cleaning)
    signal.signal(signal.SIGTERM, cleaning)
    main()
