from huron.core.executor import executor
from despinassy.ipc import redis_send_to_print, IpcPrintMessage, IpcOrigin
from despinassy import Inventory, Part, Printer, Scanner, Channel, db
from despinassy.Inventory import InventorySession
from despinassy.Scanner import ScannerTransaction, ScannerModeEnum
from flask import Blueprint, request, redirect, jsonify, current_app, send_file
import os
import redis

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
    """
    API endpoint to send print job to a remote printer.
    """
    form = request.get_json()
    if form is None:
        form = request.form
    barcode = form.get("barcode", "")
    name = form.get("name", "")
    number = form.get("number", "1")
    destination = form.get("destination") or "victoria"

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
    if redis_send_to_print(r, destination, msg) is None:
        current_app.logger.warning("No recipient for the msg: '%s'" %
                                   (str(msg)))

    return jsonify({'response': 'ok'})


@api.route('/api/parts/<int:part_id>/createinventory', methods=['GET', 'POST'])
def api_part_detail_create_inventory(part_id):
    """
    API endpoint to create and inventory table linked for a selected `part_id`.
    """
    in_db = Part.query.get(part_id)
    if in_db is None:
        return jsonify({"response": "error"})

    i = Inventory(part=in_db, quantity=0)
    db.session.add(i)
    db.session.commit()

    return jsonify(i.to_dict())


@api.route('/api/parts/<int:part_id>/print', methods=['GET', 'POST'])
def api_part_detail_print(part_id):
    """
    API endpoint to print a selected part with `part_id`.
    """
    number = 1
    destination = 'victoria'
    if request.method == 'POST':
        form = request.get_json()
        n = form.get("number")
        destination = form.get("destination") or "victoria"
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
    if redis_send_to_print(r, destination, msg) is None:
        current_app.logger.warning(
            "No recipient in channel '%s' for the msg: '%s'" %
            (destination, str(msg)))

    return jsonify({'response': 'ok'})


@api.route('/api/parts/', methods=['GET', 'POST'])
def api_parts():
    """
    API endpoint listing every parts present in the database.
    """
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
            column_name = form.get("csv_column_name", "Référence interne")
            column_barcode = form.get("csv_column_barcode", "Code Barre")
            csv_encoding = form.get("csv_encoding", "UTF-8")
            csv_file = files['file']
            if csv_file.filename == '':
                return redirect(request.url)
            if csv_file and is_csv(csv_file.filename):
                filename = os.path.join(SAVE_PATH, (csv_file.filename))
                current_app.logger.info("Saving " + filename)
                csv_file.save(filename)
                executor.submit(Part.import_csv, filename, {
                    "name": column_name,
                    "barcode": column_barcode,
                }, csv_encoding)

            return jsonify({"response": "ok"})
    else:
        return jsonify([x.to_dict() for x in Part.query.all()])

    return jsonify({"response": "error"})


@api.route('/api/inventory/delete', methods=['GET'])
def api_inventory_delete():
    """
    API endroint to delete every inventory entry.
    """
    if request.method == 'GET':
        Inventory.query.delete()
        InventorySession.query.delete()
        db.session.add(InventorySession())
        db.session.commit()
        return jsonify([x.to_dict() for x in Inventory.query.all()])


@api.route('/api/inventory/archive', methods=['GET'])
def api_inventory_archive():
    """
    API endroint to archive the current inventory session.
    """
    if request.method == 'GET':
        db.session.add(InventorySession())
        db.session.commit()
        return jsonify([x.to_dict() for x in InventorySession.query.all()])


@api.route('/api/inventory/export.csv', methods=['GET'])
def api_inventory_export():
    """
    API endroint to export the current inventory session as .csv.
    """
    if request.method == 'GET':
        path = os.path.join(SAVE_PATH, 'export.csv')
        Inventory.export_csv(path)
        return send_file(path, as_attachment=True)


@api.route('/api/inventory/session/<int:session_id>', methods=['GET'])
def api_inventory_session_list(session_id):
    """
    API endpoint to list the inventory of a specific session identified by `session_id`.
    """
    if request.method == 'GET':
        sid = InventorySession.query.get(session_id)
        return jsonify([
            x.to_dict()
            for x in Inventory.query.filter(Inventory.session == sid).all()
        ])


@api.route('/api/inventory/<int:inventory_id>/transactions', methods=['GET'])
def api_inventory_detail_transaction(inventory_id):
    """
    API endpoint to list the inventory of a specific session identified by `session_id`.
    """
    x = Inventory.query.get(inventory_id)
    if x is None:
        return jsonify(None)

    ts = ScannerTransaction.query.filter(
        ScannerTransaction.value == x.part.barcode
    ).filter(ScannerTransaction.mode == ScannerModeEnum.INVENTORYMODE).filter(
        ScannerTransaction.created_at >= Inventory.created_at).order_by(
            ScannerTransaction.created_at.desc())

    return jsonify([x.to_dict(full=True) for x in ts])


@api.route('/api/inventory/<int:inventory_id>',
           methods=['GET', 'POST', 'DELETE'])
def api_inventory_detail(inventory_id):
    """
    API endpoint to retrieve the details of a inventory with `inventory_id`.
    """
    x = Inventory.query.get(inventory_id)
    if x is None:
        return jsonify(None)

    if request.method == 'POST':
        form = request.get_json()
        quantity = form.get('quantity', None)
        unit = form.get('unit', None)
        if quantity:
            dev = Scanner.query.filter(Scanner.name == "huron").first()
            db.session.add(
                dev.add_transaction(
                    mode=2,
                    quantity=(quantity - x.quantity),
                    value=x.part.barcode,
                ))
            db.session.commit()
            x.quantity = quantity
        elif unit:
            x.unit = unit

        db.session.commit()
    elif request.method == 'DELETE':
        db.session.delete(x)
        db.session.commit()

    return jsonify(x.to_dict())


@api.route('/api/inventory/', methods=['GET'])
def api_inventory():
    """
    API endpoint to list the inventory entry of the most recent inventory session.
    """
    if request.method == 'GET':
        last_session = InventorySession.query.order_by(
            InventorySession.created_at.desc()).first()
        return jsonify([
            x.to_dict() for x in Inventory.query.filter(
                Inventory.session == last_session).all()
        ])


@api.route('/api/printer/<int:printer_id>', methods=['GET'])
def api_printer_detail(printer_id):
    """
    API endpoint to retrieve the details of a printer identified by a `printer_id`.
    """
    x = Printer.query.get(printer_id)
    if x is None:
        return jsonify(None)

    return jsonify(x.to_dict(full=True))


@api.route('/api/printer/', methods=['GET'])
def api_printer():
    """
    API endpoint to list the non hidden printers.
    """
    if request.method == 'GET':
        return jsonify([
            x.to_dict() for x in Printer.query.filter(Printer.hidden == False)
        ])


@api.route('/api/scanner/<int:scanner_id>', methods=['GET'])
def api_scanner_detail(scanner_id):
    """
    API endpoint to retrieve the details of a scanner identified by a `printer_id`.
    """
    x = Scanner.query.get(scanner_id)
    if x is None:
        return jsonify(None)

    return jsonify(x.to_dict(full=True))


@api.route('/api/scanner/', methods=['GET'])
def api_scanner():
    """
    API endpoint to list the non hidden scanners.
    """
    if request.method == 'GET':
        return jsonify([
            x.to_dict() for x in Scanner.query.filter(Scanner.hidden == False)
        ])


@api.route('/api/channel/', methods=['GET'])
def api_channel():
    """
    API endpoint to list the communication channels.
    """
    if request.method == 'GET':
        return jsonify([x.to_dict() for x in Channel.query.all()])
