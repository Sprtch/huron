from huron.core.executor import executor
from despinassy.ipc import redis_subscribers_num, ipc_create_print_message
from despinassy import Inventory, Part, db
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, current_app, send_file
import os
import redis
import json

r = redis.Redis(host='localhost', port=6379, db=0)
p = r.pubsub()

LOGGING_PATH = "/var/log/zebra.log"
SAVE_PATH = "/tmp/"

api = Blueprint(
   'api', 
   __name__,
)

@api.route('/api/print', methods=['POST'])
def api_print():
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

@api.route('/api/parts/', methods=['GET', 'POST'])
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
            return jsonify(part.to_dict())
        elif 'file' in files:
            file = files['file']
            if file.filename == '':
                return redirect(request.url)
            if file and is_csv(file.filename):
                filename = os.path.join(SAVE_PATH, (file.filename))
                current_app.logger.info("Saving " + filename)
                file.save(filename)
                executor.submit(Part.import_csv, filename, {"default_code": "name", "barcode": "barcode"})

        return jsonify({"response": "ok"})
    else:
        return jsonify([x.to_dict() for x in Part.query.all()])

@api.route('/api/inventory/export.csv', methods=['GET'])
def api_inventory_export():
    if request.method == 'GET':
        path = os.path.join(SAVE_PATH, 'export.csv')
        Inventory.export_csv(path)
        return send_file(path, as_attachment=True)

@api.route('/api/inventory/<int:inventory_id>', methods=['GET', 'POST'])
def api_inventory_detail(inventory_id):
    x = Inventory.query.get(inventory_id)
    if x is None:
        return jsonify(None)

    if request.method == 'POST':
       form = request.get_json()
       quantity = form.get('quantity', x.quantity)
       if quantity:
          x.quantity = quantity

       db.session.commit()

    return jsonify(x.to_dict())

@api.route('/api/inventory/', methods=['GET'])
def api_inventory():
    if request.method == 'GET':
        return jsonify([x.to_dict() for x in Inventory.query.all()])
