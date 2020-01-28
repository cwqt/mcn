#!/usr/bin/env python3
import os
import time
import json
import busio
import requests
from board import SCL, SDA
from adafruit_seesaw.seesaw import Seesaw

with open("secrets.json", "r") as f:
  SECRETS = json.load(f)

HEADERS = {
  "AUTH_TOKEN": SECRETS["TOKEN"],
  'Content-Type': 'application/json'
}
URL = "https://moisture-track.herokuapp.com/plants/"+SECRETS["UUID"]

print(SECRETS)

i2c_bus = busio.I2C(SCL, SDA)
ss = Seesaw(i2c_bus, addr=0x36)

while True:
  # read moisture level through capacitive touch pad
  moist = ss.moisture_read()
  temp = ss.get_temp()

  # send moisture update to the api
  payload = {
    "moisture_level": str(moist),
    "temperature": str(round(temp, 1))
  }
  print(json.dumps(payload))
  r = requests.put(URL, data=json.dumps(payload), headers=HEADERS)
  print(r.content)
#print(payload)

  #repeat once every 30 minutes
  time.sleep(1800)

#https://learn.adafruit.com/adafruit-stemma-soil-sensor-i2c-capacitive-moisture-sensor/python-circuitpython-test
