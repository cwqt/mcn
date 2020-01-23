# moisture.track

Hydroponics management and visualiser.

* Event based system notifies when an action needs completing e.g. watering, re-seeding
* Gardens and Plants, manage entire gardens constituted of subplants
* Remotely trigger events on micro-controllers, e.g. turn on light, open watering valve
* Monitor all metrics on front-end dashboard with graphs
* Live camera feed (No IR) to view active photosynthesis
* Code support for ESP-32, Wemos D1 Mini & Raspberry Pi

## api

Flask-RESTful API with MongoDB - JWT authentication.  
Served on [Heroku](https://www.heroku.com/).

## frontend

React, Redux with Pi NoIR camera stream.  
Served on [Now](https://zeit.co/home).

## hardware

ESP32 - measures temperature, humdity, light level & water-tank level. 

## 3d_models

3d to allow plants to fit inside IKEA VÄXER cultivation unit in a 4x2 arrangement.

![](https://ftp.cass.si/7~50glk3e.png)

## pi

Pi Zero W with NoIR camera to monitor active photosynthesis and stream to frontend.