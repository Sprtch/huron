# Huron

## Description

A small server to interface a cheap chinese barcode scanner to a sticker label printer.

## Usage

```
>virtualenv venv
>source venv/bin/activate
>pip install -r requirements.txt
>venv/bin/python3 zebra
```

You should be in the group `input` to be able to run the script without root.
Also you should put the correct device name if yours is different.

## Sending printing jobs with raw ZPL

Using raw zpl is actually easier to do than trying to print pdf, you really have
the possibility to adjust the size to your need.

```
lpr -P zebra -o raw raw.zpl
```

## Good things to know

* You can check the cups configured printers at the following address `http://localhost:631/printers/`.
* Use [labelary.com/viewer.html](http://labelary.com/viewer.html) to preview ZPL code.
