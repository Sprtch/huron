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
import pandas
from quart import Quart, render_template, redirect, request, url_for, jsonify
from models.part import Part
from models.database import db_session, init_db

LOGGING_PATH = "/var/log/zebra.log"
SAVE_PATH = "/tmp/"
# logging.basicConfig(filename='/var/log/zebra.log', level=logging.DEBUG)
init_db()

# Flask Init
app = Quart(
    __name__,
    static_folder="app/build/static",
    template_folder="app/build/",
)

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
def index():
    return render_template('index.html')

@app.route('/print', methods=['POST'])
async def create():
    form = await request.get_json()
    if form is None:
        form = await request.form
    barcode = form["barcode"]
    name = form.get("name", "")
    number = form.get("number", "1")

    if number.isdigit():
        number = int(number)
    else:
        number = 1

    for _ in range(number):
        await BARCODE_QUEUE.put({"barcode": barcode, "name": name})
    return redirect(url_for('index'))

def is_csv(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() == 'csv'

@app.route('/api/parts', methods=['GET', 'POST'])
async def api_parts():
    if request.method == 'POST':
        form = await request.form
        files = await request.files
        if form["name"] and form["barcode"]:
            name = form["name"]
            barcode = form["barcode"]
            part = Part(name=name, barcode=barcode)
            db_session.add(part)
            db_session.commit()
        elif 'file' in files:
            file = files['file']
            if file.filename == '':
                return redirect(request.url)
            if file and is_csv(file.filename):
                pass
                # TODO Parse csv
                # filename = secure_filename(file.filename)
                filename = (file.filename)
                logging.info("Saving " + os.path.join(SAVE_PATH, filename))
                file.save(os.path.join(SAVE_PATH, filename))
                df = pandas.read_csv(SAVE_PATH + filename, encoding="latin1")
                for (name, barcode) in zip(df['default_code'], df['barcode']):
                    part = Part(name=name, barcode=barcode)
                    db_session.add(part)
                    try:
                        db_session.commit()
                    except:
                        db_session.rollback()
        return redirect(url_for('index'))
    return jsonify([x.to_dict() for x in db_session.query(Part).all()])

@app.route('/update', methods=['POST'])
async def update():
    try:
        sp.check_output(['git', 'pull', 'origin', 'master'])
    except:
        logger.error("No repository settled up")
    return redirect(url_for('index'))

def usb_scanner_checker():
    USB_SCANNER_PATH = "/dev/input/by-id/usb-Belon.cn_2.4G_Wireless_Device_Belon_Smart-event-kbd"
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
        info = await BARCODE_QUEUE.get()
        template = env.get_template('productbarcode40x100.zpl')

        filename = '/tmp/%s.zpl' % (info['barcode'])
        file = open(filename, 'w')
        # Get part name from database.
        file.write(str(template.render(name=info.get('name', ''), number=info['barcode'])))
        file.close()

        logging.info("Launching the print of the barcode: %s" % (info['barcode']))

        sp.check_output(['lpr', '-P', 'zebra', '-o', 'raw', filename])


async def input_listener():
    while True:
        barcode = await ainput(">>>")
        await BARCODE_QUEUE.put({"barcode": barcode})


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
                    if key == None or key == 'ENTER':
                        await BARCODE_QUEUE.put({"barcode": barcode})
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
