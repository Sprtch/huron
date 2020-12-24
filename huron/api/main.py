from huron.core.executor import executor
from despinassy.ipc import redis_send_to_print, IpcPrintMessage, IpcOrigin
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


def is_csv(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() == 'csv'


@api.route('/api/print', methods=['POST'])
def api_print():
    form = request.get_json()
    if form is None:
        form = request.form
    barcode = form.get("barcode", "")
    name = form.get("name", "")
    number = form.get("number", "1")

    in_db = Part.query.filter(Part.barcode == barcode).first()
    if type(number) == str:
        if number.isdigit():
            number = int(number)
        else:
            number = 1

    if in_db:
        in_db.printed(number)
    db.session.commit()

    msg = IpcPrintMessage(name=name,
                          barcode=barcode,
                          number=number,
                          origin=IpcOrigin.HURON)
    if redis_send_to_print(r, 'victoria', msg) is None:
        current_app.logger.warning("No recipient for the msg: '%s'" %
                                   (str(msg)))

    return jsonify({'response': 'ok'})


@api.route('/api/parts/<int:part_id>/createinventory', methods=['GET', 'POST'])
def api_part_detail_create_inventory(part_id):
    in_db = Part.query.get(part_id)
    if in_db is None:
        return jsonify({"response": "error"})

    i = Inventory(part=in_db, quantity=0)
    db.session.add(i)
    db.session.commit()

    return jsonify(i.to_dict())


@api.route('/api/parts/<int:part_id>/print', methods=['GET', 'POST'])
def api_part_detail_print(part_id):
    number = 1
    if request.method == 'POST':
        form = request.get_json()
        n = form.get("number")
        if isinstance(n, str) and n.isnumeric():
            number = int(n)
        elif isinstance(n, int):
            number = n

    in_db = Part.query.get(part_id)
    if in_db is None:
        return jsonify({"response": "error"})

    in_db.printed(number)
    db.session.commit()

    msg = IpcPrintMessage(name=in_db.name,
                          barcode=in_db.barcode,
                          number=number,
                          origin=IpcOrigin.HURON)
    if redis_send_to_print(r, 'victoria', msg) is None:
        current_app.logger.warning("No recipient for the msg: '%s'" %
                                   (str(msg)))

    return jsonify({'response': 'ok'})


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
                executor.submit(Part.import_csv, filename, {
                    "default_code": "name",
                    "barcode": "barcode"
                })

            return jsonify({"response": "ok"})
    else:
        return jsonify([x.to_dict() for x in Part.query.all()])

    return jsonify({"response": "error"})


@api.route('/api/inventory/delete', methods=['GET'])
def api_inventory_delete():
    if request.method == 'GET':
        Inventory.query.delete()
        db.session.commit()
        return jsonify([x.to_dict() for x in Inventory.query.all()])


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
