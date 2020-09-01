# Huron

## Description

A small server to interface a sticker label printer.

## Usage

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

You should be in the group `input` to be able to run the script without root.
Also you should put the correct device name if yours is different.

## Deployment

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


