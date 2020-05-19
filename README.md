# my.corrhizal.net

A social network and management system for gardeners, plant growers and hobbyists alike.

* Event based system notifies when an action needs completing e.g. watering, re-seeding
* Gardens and Plants, manage entire gardens constituted of sub-plants
* Create custom event queues for carrying out tasks at certain intervals
* Manage IoT devices & add your own hardware
* Compile timelines of posts of plants growing over time
* Remotely trigger events on micro-controllers, e.g. turn on light, open watering valve
* Monitor all metrics on a front-end dashboard
* Code support for ESP-32, Wemos D1 Mini & Raspberry Pi

Previously written in Python & React, now moving over to TypeScript & Angular.

## backend

Express.js TypeScript REST API with polyglot persistence.

* __Neo4j__: Social networking data, highly relational data
* __MongoDB__: IoT data, low relation - high read/write throughput
* __Redis__: Session store, very high r/w

May possibly move IoT over to InfluxDB at some point.

## frontend

Angular w/ material-angular.

## hardware

* __ESP32__: for testing gardens, supports 8 plants. 
* __Wemos D1 Mini__: for single plants
* __Pi Zero W__: NoIR camera to monitor active photosynthesis and stream to frontend.
* 