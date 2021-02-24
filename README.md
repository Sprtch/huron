# Huron

## Description

Huron is a webapp designed to improve the supply chain workflow of company working
with Odoo.
It gives company the key to manage their fleet of barcode printer and barcode
scanner to perform quick inventory of their assets or print barcode parts.

## Usage

During development run the following commands to setup a development
environment.

```bash
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -e .
export FLASK_APP=huron
python manage.py createdb
npm install
npm start
```

The command `npm start` will start both the _Flask_ dev server and the
_react-app_ dev server.
Developper access the UI through the create-react-app dev server and
all the request will get proxyfied to the flask dev server.

## Deployment

Build the deploy version of the application with the following command

```bash
npm run build
```

This command will make sure to move the builded webapp to the folder
`huron/view` to be served statically with Flask.

## Good things to know

* You can check the cups configured printers at the following address `http://localhost:631/printers/`.
* Use [labelary.com/viewer.html](http://labelary.com/viewer.html) to preview ZPL code.
* CUPS article on Arch [wiki](https://wiki.archlinux.org/index.php/CUPS#Usage)
* [Zebra and CUPS](https://www.zebra.com/us/en/support-downloads/knowledge-articles/mac-linux-or-unix-driver-suggestions-for-zebra-printers.html)
* [Zebra ZD420](https://www.zebra.com/gb/en/products/printers/desktop/zd420-series-desktop-printers.html)
