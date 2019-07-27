# moisture.track

Plant moisture tracker and visualiser

## Hardware

https://thepihut.com/products/soil-moisture-sensor
https://thepihut.com/products/adafruit-mcp3008-8-channel-10-bit-adc-with-spi-interface

Moisture sensor into MCP3008 ADC into Pi Zero W via SPI.  
Possibly Pi Zero to 2.2" Adafruit TFT over SPI using fbtft framebuffer mirroring and LOVE.

## Software

### Moisture monitor

UUID for plant hard-coded.  
Read in ADC value over SPI once an hour, upload to a mongoDB collection via API.

### Front-end

React, Redux, styled-components  
Support for several plants.

Point graph style representation of moisture as a function of time.

* Plant graph view

## API

Python3.6 Flask CRUD

`cd api/ && flask run`

`mongodb+srv://admin:admin@cluster0-wctg2.mongodb.net/test?retryWrites=true&w=majority`

* Plant adding
* Plant removal
* Plant UUID generation

```json
{
	"_id": "d8163995-3b9f-4cc5-bbeb-d12522964f16",
	"name": "desk_plant",
	"date_added": 1364251214,
	"updates": {
		"1364251214": 313,
		"1364251216": 223,
		"1364251229": 196,
	}
}
```

dnspython
python3.6
flask

