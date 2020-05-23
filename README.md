# my.corrhizal.net

A social network and management system for gardeners, plant growers and hobbyists alike.

* Manage IoT devices to monitor your gardens/plants & add your own custom hardware
* Monitor entire gardens/farms constituted of sub-plants
* Create custom event queues for carrying out tasks at certain intervals
* Remotely trigger events on micro-controllers, e.g. turn on light, open watering valve
* Event based system notifies when an action needs completing e.g. watering, re-seeding
* Compile timelines of posts to show off plant growth from seedling to flower
* Monitor all metrics on a front-end dashboard
* Code support for ESP-32, Wemos D1 Mini & Raspberry Pi

Previously written in Python & React, now moving over to TypeScript & Angular.

## backend

Express.js TypeScript REST API with polyglot persistence.

* __Neo4j__: Social networking data, highly relational data
* __InfluxDB__: IoT data, low relation - high read/write throughput
* __MongoDB__: Agenda Task  queue
* __Redis__: Session store, very high r/w

## frontend

Angular w/ material-angular.

## hardware

* __ESP32__: for testing gardens, supports 8 plants. 
* __Wemos D1 Mini__: for single plants
* __Pi Zero W__: NoIR camera to monitor active photosynthesis and stream to frontend.


![](https://ftp.cass.si/9952g6rSa.png)

CC BY-NC-ND 4.0 — copyright daughter.systems (2020)
