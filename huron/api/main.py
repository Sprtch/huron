import logging
import os
import csv
from flask import Blueprint, render_template, request, redirect, url_for, jsonify
import redis

from huron.models import Part, db

r = redis.Redis(host='localhost', port=6379, db=0)
p = r.pubsub()

LOGGING_PATH = "/var/log/zebra.log"
SAVE_PATH = "/tmp/"

api = Blueprint(
   'api', 
   __name__,
)

@api.route('/api/print', methods=['POST'])
def create():
    form = request.get_json()
    if form is None:
        form = request.form
    barcode = form["barcode"]
    name = form.get("name", "")
    number = form.get("number", "1")

    in_db = Part.query.get(barcode)
    print(in_db)
    if type(number) == str:
        if number.isdigit():
            number = int(number)
        else:
            number = 1

    for _ in range(number):
        r.publish('printer', '{"name": "%s", "barcode": "%s"}' % (name, barcode))
        if in_db:
            in_db.printed()

    db.session.commit()

    return jsonify({'response': 'ok'})

def is_csv(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() == 'csv'

@api.route('/api/parts', methods=['GET', 'POST'])
def api_parts():
    if request.method == 'POST':
        form = request.form
        files = request.files
        if form["name"] and form["barcode"]:
            name = form["name"]
            barcode = form["barcode"]
            part = Part(name=name, barcode=barcode)
            db.session.add(part)
            db.session.commit()
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

                            db.session.add(part)
                            try:
                                db.session.commit()
                            except:
                                db.session.rollback()
                        line_count += 1

        return jsonify({"response": "ok"})
    else:
        return jsonify([x.to_dict() for x in Part.query.all()])

