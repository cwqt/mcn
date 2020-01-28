#!/usr/bin/env python3
import os
import time
import json
import busio
import requests
import neopixel
from board import SCL, SDA
from adafruit_seesaw.seesaw import Seesaw

API_KEY = os.getenv("API_KEY")
API_URL = os.getenv("API_URL")
PLANT_UUID = os.getenv("PLANT_UUID")

UPDATE_PERIOD = 3600
STEMMA_ADDRESS = 0x36
LDR_ADDRESS = 0x06

HEADERS = {
  "x-api-key": API_KEY,
  'Content-Type': 'application/json'
}
URL = API_URL+"/plants/"+PLANT_UUID

i2c_bus = busio.I2C(SCL, SDA)
stemma = Seesaw(i2c_bus, addr=STEMMA_ADDRESS)

pixels = neopixel.NeoPixel(board.D17, 1)
pixels[0] = (255, 0, 0)

def get_light():
	return 1

def post():
	moisture 		= stemma.moisture_read()
	temperature = stemma.get_temp()
	light 			= get_light() 

	payload = {
		"moisture": 	 moisture,
		"temperature": temperature,
		"light": 			 light
	}

	print(json.dumps(payload))
  r = requests.put(URL, data=json.dumps(payload), headers=HEADERS)
  return r.status_code

while True:
	pixels[0] = (0, 0, 255)
	status = post()

  if not status = requests.codes.ok:
	  pixels[0] = (255,0,0)  	
  pixels[0] = (0,255,0)

  time.sleep(15)
  pixels[0] = (0,0,0)
	time.sleep(UPDATE_PERIOD)
