# moisture.track

Plant moisture tracker and visualiser

## Hardware

https://thepihut.com/products/soil-moisture-sensor
https://thepihut.com/products/adafruit-mcp3008-8-channel-10-bit-adc-with-spi-interface

Moisture sensor into MCP3008 ADC into Pi Zero W via SPI. \\ 
Possibly Pi Zero to 2.2" Adafruit TFT over SPI using fbtft framebuffer mirroring and LOVE.

## Software

### Moisture monitor

UUID for plant hard-coded. \\
Read in ADC value over SPI once an hour, upload to a mongoDB collection. Simple.

### Front-end

React, Redux, styled-components \\
Support for several plants.

* Plant adding
* Plant removal
* Plant UUID
* Plant graph view

Point graph style representation of moisture as a function of time.
