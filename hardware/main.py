import os
import time
import busio
import requests 
from board import SCL, SDA
from adafruit_seesaw.seesaw import Seesaw

PLANT_UUID = ""
URL = "https://moisture-track.herokuapp.com/plants/"+PLANT_UUID

i2c_bus = busio.I2C(SCL, SDA)
ss = Seesaw(i2c_bus, addr=0x36)

while True:
  # read moisture level through capacitive touch pad
  touch = ss.moisture_read()

  # send moisture update to the api
  payload = {
    "moisture_level": str(touch)
  }
  requests.put(URL, data=payload)

  #repeat once every 30 minutes
  timer.sleep(1800)

#https://learn.adafruit.com/adafruit-stemma-soil-sensor-i2c-capacitive-moisture-sensor/python-circuitpython-test