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
import csv
import uuid
from quart import Quart, render_template, redirect, request, url_for, jsonify
from zebra.models.part import Part
from zebra.models.database import db_session, init_db

LOGGING_PATH = "/var/log/zebra.log"
SAVE_PATH = "/tmp/"
# logging.basicConfig(filename='/var/log/zebra.log', level=logging.DEBUG)
init_db()

# Flask Init
app = Quart(
    __name__,
    static_folder="../build/static",
    template_folder="../build/",
)

BARCODE_QUEUE = asyncio.Queue(loop=asyncio.get_event_loop())

# Make the keyboard mapping between the scandata received from evdev and the
# actual value on the keyboard (should be qwerty).
KEYBOARD_TRANSLATE = {
    # Keyboard code: actual number
    'LEFTSHIFT': '',
    'SLASH': '/',
}

@app.route('/')
async def index():
    return await app.send_static_file('index.html')

@app.route('/print', methods=['POST'])
async def create():
    form = await request.get_json()
    if form is None:
        form = await request.form
    barcode = form["barcode"]
    name = form.get("name", "")
    number = form.get("number", "1")

    if type(number) == str:
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
                with open(SAVE_PATH + filename, mode="r", encoding="latin1") as csv_file:
                    csv_reader = csv.DictReader(csv_file, delimiter=",")
                    line_count = 0
                    for row in csv_reader:
                        if line_count > 0:
                            part = Part(
                                name=row["default_code"],
                                barcode=row["barcode"],
                            )

                            db_session.add(part)
                            try:
                                db_session.commit()
                            except:
                                db_session.rollback()
                        line_count += 1

        return redirect(url_for('index'))
    return jsonify([x.to_dict() for x in db_session.query(Part).all()])


def main():
    loop = asyncio.get_event_loop()
    app.run(debug=True, loop=loop)
    loop.close()


def cleaning(signumb, frame):
    loop = asyncio.get_event_loop()
    loop.close()


if __name__ == "__main__":
    signal.signal(signal.SIGINT, cleaning)
    signal.signal(signal.SIGTERM, cleaning)
    main()
