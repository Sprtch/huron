# Huron

## Description

Huron is a webapp designed to improve the supply chain workflow of company working
with Odoo.
This webapp helps companies managing their fleet of barcode printer and barcode
scanner with functionnality such as barcode printing assets and exporting an inventory
of the warehouse or simply use it as an interface for the company barcode
printer.

Huron work in conjunction of the
[sprtch/victoria](https://github.com/Sprtch/victoria) daemon that handle the
comunication with the different barcode scanner as well as the
[sprtch/erie](https://github.com/Sprtch/erie) daemon that receive the data from
the barcode scanner.

This program is made to run on the linux operating system running on a Raspberry
Pi 3 built with [buildroot](https://github.com/Sprtch/buildroot).

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

Running this program won't make the printer and the scanner work out of the
box.
The peripherals communicate together with the help of redis.
Check the [sprtch/victoria](https://github.com/Sprtch/victoria) and
[sprtch/erie](https://github.com/Sprtch/erie) project to make this
webapp interface the scanner and printer.

## Deployment

The production version and deployment is handled by 
[buildroot](https://github.com/Sprtch/buildroot).
Check the repository to see how Huron is deployed.

## Useful links

* Use [labelary.com/viewer.html](http://labelary.com/viewer.html) to preview ZPL code.
