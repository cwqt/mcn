# moisture.track

Plant moisture tracker and visualiser.

## Hardware

* https://thepihut.com/products/adafruit-stemma-soil-sensor-i2c-capacitive-moisture-sensor-ada4026
* https://thepihut.com/products/adafruit-jst-ph-4-pin-to-female-socket-cable-i2c-stemma-cable-200mm-ada3950?variant=18634586259518
* RPi Zero W.

## Software

### Moisture monitor

UUID for plant hard-coded.  
Moisture sensor returns 200 (very dry) to 2000 (very wet) over i^2c.

### Front-end

React, Redux, styled-components, chartjs  
Support for several plants.

Point graph style representation of moisture as a function of time.

* Plant graph view

## API ✅

Python3.6 Flask CRUD

`cd api/ && flask run`

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

### Endpoints

`/plants/`

* __GET__: List all plants (200)
* __POST__: Create a new plant `{"name": "my_cool_plant"}` (201)
	- Returns `{"message":{"_id":"5d3cb7263dd6cd525239e21c"}}`

`/plants/<uuid>`

* __GET__: Get document info (200)
* __POST__: Add a moisture level `{"moisture_level":"314"}` (201)
* __DELETE__: Delete plant (200)

