# mcn

An IoT platform for vertical farming.

- Manage IoT devices to monitor your racks & add your own custom hardware
- Monitor entire racks of crops composed of frames of plants
- Create custom event queues for carrying out tasks at certain intervals
- Remotely trigger events on micro-controllers, e.g. turn on light, open watering valve
- Alert based system notifies when an action needs completing e.g. watering, re-seeding
- Compile timelines of growth & collate rotation plans
- Monitor all metrics on a front-end dashboard
- Code support for ESP-32, Wemos D1 Mini & Raspberry Pi with option to create & add your own

Previously written in Python & React, now moving over to TypeScript & Angular.

## backend

Express.js TypeScript REST API with polyglot persistence.

- **Neo4j**: Organisations, users, farms/racks/crops/devices, highly relational data
- **InfluxDB**: IoT data, low relation - high read/write throughput
- **MongoDB**: Agenda, mcnlang Task Routine queue
- **Redis**: Session store, very high r/w

## frontend

Angular w/ material-angular.

## hardware

- **ESP32**: for testing gardens, supports 8 plants.
- **Wemos D1 Mini**: for single plants
- **Pi Zero W**: NoIR camera to monitor active photosynthesis and stream to frontend.

See the [Device specification](https://gitlab.com/cxss/mcn/-/blob/master/backend/lib/common/types/devices/device-api-spec.md) for creating and using your own hardware on _mcn_.

## runner

TypeScript/Express & Agenda Task scheduler/runner for task routines.

![](https://ftp.cass.si/9952g6rSa.png)
![](https://ftp.cass.si/05k95y00d.png)

CC BY-NC-ND 4.0 — copyright daughter.systems (2020)
