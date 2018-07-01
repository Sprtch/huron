#!/usr/bin/python3.6

import asyncio
from aioconsole import ainput
# import aiohttp
from jinja2 import Environment, PackageLoader
from evdev import InputDevice, categorize, ecodes
import subprocess as sp
import signal

env = Environment(
    loader=PackageLoader(__name__, 'templates')
)

try:
    scanner_device = InputDevice('/dev/input/by-id/usb-SCANNER_SCANNER_08FF20150112-event-kbd')
except FileNotFoundError:
    scanner_device = None

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

async def process_barcode(queue):
    while True:
        barcode = await queue.get()
        template = env.get_template('productbarcode40x100.zpl')

        filename = '/tmp/%s.zpl' % (barcode)
        file = open(filename, 'w')
        file.write(str(template.render(name='This is a test', number=barcode)))
        file.close()

        print("Launching the print of the barcode: %s" % (barcode))

        sp.check_output(['lpr', '-P', 'zebra', '-o', 'raw', filename])

async def input_listener(queue):
    while True:
        barcode = await ainput(">>>")
        await queue.put(barcode)

async def barcode_scanner_listener(queue, dev):
    dev.grab()
    barcode = ''
    async for ev in dev.async_read_loop():
        if ev.type == ecodes.EV_KEY:
            data = categorize(ev)
            key = KEYBOARD_MAPPING.get(data.scancode, None)
            if  key == None or key == 'ENTER':
                await queue.put(barcode)
                barcode = ''
                break
            if data.keystate == 1:
                barcode += str(key)
    dev.ungrab()

def main():
    loop = asyncio.get_event_loop()
    q = asyncio.Queue(loop=loop)

    if scanner_device:
        loop.run_until_complete(asyncio.gather(barcode_scanner_listener(q, scanner_device), process_barcode(q)))
    else:
        loop.run_until_complete(asyncio.gather(input_listener(q), process_barcode(q)))
    loop.close()

def cleaning(signumb, frame):
    if scanner_device:
        scanner_device.ungrab()

if __name__ == "__main__":
    signal.signal(signal.SIGINT, cleaning)
    signal.signal(signal.SIGTERM, cleaning)
    main()
