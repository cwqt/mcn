# my.corrhizal.net

A social network and management system for gardeners, plant growers and hobbyists alike.

* Event based system notifies when an action needs completing e.g. watering, re-seeding
* Gardens and Plants, manage entire gardens constituted of subplants
* Create custom event queues for carrying out tasks at certain intervals
* Compile timelines of posts of plants growing over time
* Remotely trigger events on micro-controllers, e.g. turn on light, open watering valve
* Monitor all metrics on a front-end dashboard
* Code support for ESP-32, Wemos D1 Mini & Raspberry Pi

Previously written in React & Python, now moving over to TypeScript & Angular.

## backend

Express.js TypeScript REST API with MongoDB & Neo4j for polyglot persistence, session management, symmetric api key exchange & JWT.

## frontend

Angular w/ material-angular.

## hardware

* __ESP32__: for testing gardens, supports 8 plants. 
* __Wemos D1 Mini__: for single plants
* __Pi Zero W__: NoIR camera to monitor active photosynthesis and stream to frontend.

---

## old code

## api

~~<http://api.hydroponics.cass.si/>~~

Flask-RESTful API with MongoDB - JWT authentication.  
Served on [Heroku](https://www.heroku.com/).

## frontend

~~<http://hydroponics.cass.si>~~

React, Redux with Pi NoIR camera stream.  
Served on [Now](https://zeit.co/home).
