# Huron

## Description

A small server to interface a sticker label printer.

## Usage

During development run the following commands to setup a development
environment.

```
>virtualenv venv
>source venv/bin/activate
>pip install -r requirements.txt
>pip install -e .
>export FLASK_APP=huron
>python manage.py createdb
>npm install
>npm start
```

The command `npm start` will start both the _Flask_ dev server and the
_react-app_ dev server.
Developper access the UI through the create-react-app dev server and
all the request will get proxyfied to the flask dev server.

## Deployment

Build the deploy version of the application with the following command

```
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

### Sending printing jobs with raw ZPL

Using raw zpl is actually easier to do than trying to print pdf, you really have
the possibility to adjust the size to your need.

```
lpr -P zebra -o raw raw.zpl
```

### Adding a printer Queue

Most of these information are from the Arch Linux CUPS wiki.

```
sudo lpadmin -p zebra -E -v "usb://Zebra%20Technologies/ZTC%20ZD420-300dpi%20ZPL?serial=D2J193206605" -m drv:///sample.drv/zebra.ppd
```


