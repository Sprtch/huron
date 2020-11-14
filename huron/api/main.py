from huron.core.executor import executor
from despinassy.ipc import redis_subscribers_num, ipc_create_print_message
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, current_app
import os
import csv
import redis
import json

from despinassy import Part, db

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

    in_db = Part.query.filter(Part.barcode == barcode).first()
    if type(number) == str:
        if number.isdigit():
            number = int(number)
        else:
            number = 1

    for _ in range(number):
        if in_db:
            in_db.printed()
    db.session.commit()

    chan = 'victoria'
    ipc_msg = ipc_create_print_message({}, name=name, barcode=barcode, number=number,origin='huron')._asdict()
    if redis_subscribers_num(r, chan):
       r.publish(
             chan,
             json.dumps(ipc_msg)
       )
    else:
       current_app.logger.warning("No recipient for the msg: '%s'" % (str(ipc_msg)))

    return jsonify({'response': 'ok'})

def is_csv(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() == 'csv'

def save_csv(filename):
    with open(filename, mode="r", encoding="ISO-8859-1", errors='ignore') as csv_file:
        current_app.logger.info("Start importing the csv: %s" % filename)
        csv_reader = csv.DictReader(csv_file, delimiter=",")
        line_count = 0
        Part.query.delete()
        for row in csv_reader:
           if line_count > 0 and row["barcode"] and row["default_code"]:
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
        current_app.logger.info("Done importing the csv: %s" % filename)

@api.route('/api/parts', methods=['GET', 'POST'])
def api_parts():
    if request.method == 'POST':
        form = request.form
        files = request.files
        if form.get("name", None) and form.get("barcode", None):
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
                filename = (file.filename)
                current_app.logger.info("Saving " + os.path.join(SAVE_PATH, filename))
                file.save(os.path.join(SAVE_PATH, filename))
                executor.submit(save_csv, os.path.join(SAVE_PATH, filename))

        return jsonify({"response": "ok"})
    else:
        return jsonify([x.to_dict() for x in Part.query.all()])
