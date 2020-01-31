# hydroponics

IoT Garden & plant management with dashboard.

* Event based system notifies when an action needs completing e.g. watering, re-seeding
* Gardens and Plants, manage entire gardens constituted of subplants
* Remotely trigger events on micro-controllers, e.g. turn on light, open watering valve
* Monitor all metrics on front-end dashboard with graphs
* Live camera feed (No IR) to view active photosynthesis
* Code support for ESP-32, Wemos D1 Mini & Raspberry Pi

![Preview](https://ftp.cass.si/6i5p7qmy3.png)

## api

<http://api.hydroponics.cass.si/>

Flask-RESTful API with MongoDB - JWT authentication.  
Served on [Heroku](https://www.heroku.com/).

## frontend

<http://hydroponics.cass.si>

React, Redux with Pi NoIR camera stream.  
Served on [Now](https://zeit.co/home).

## hardware

* __ESP32__: for testing gardens, supports 8 plants. 
* __Wemos D1 Mini__: for single plants
* __Pi Zero W__: NoIR camera to monitor active photosynthesis and stream to frontend.
