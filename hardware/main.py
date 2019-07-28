import os
import time
import busio
import requests 
from board import SCL, SDA
from adafruit_seesaw.seesaw import Seesaw

PLANT_UUID = ""
URL = "http://something.com/"+PLANT_UUID

i2c_bus = busio.I2C(SCL, SDA)
ss = Seesaw(i2c_bus, addr=0x36)

while True:
  # read moisture level through capacitive touch pad
  touch = ss.moisture_read()
  # read temperature from the temperature sensor
  temp = ss.get_temp()
  print("temp: " + str(temp) + "  moisture: " + str(touch))

	#repeat once every 30 minutes
	timer.sleep(1800)
