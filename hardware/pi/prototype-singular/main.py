#!/usr/bin/env python3
import os
import time
import json
import busio
import requests
import neopixel
import board
import RPi.GPIO as GPIO
from adafruit_seesaw.seesaw import Seesaw

API_KEY = os.getenv("API_KEY")
API_URL = os.getenv("API_URL")
PLANT_UUID = os.getenv("PLANT_UUID")

UPDATE_PERIOD = 3600
STEMMA_ADDRESS = 0x36
LDR_ADDRESS = 0x00
BUTTON_ADDRESS = board.D13

HEADERS = {
  "x-api-key": API_KEY,
  'Content-Type': 'application/json'
}
URL = API_URL+"/plants/"+PLANT_UUID

i2c_bus = busio.I2C(board.SCL, board.SDA)
stemma = Seesaw(i2c_bus, addr=STEMMA_ADDRESS)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(BUTTON_ADDRESS, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.add_event_detect(BUTTON_ADDRESS, GPIO.RISING, callback=button_callback)

pixels = neopixel.NeoPixel(board.D12, 1)
pixels[0] = (255, 0, 0)
pixels.show()
time.sleep(2)

def button_callback():
  print("Posting via button...")
  post_w_led()

def get_light():
  return 1

def post():
  print("Posting...")
  moisture    = stemma.moisture_read()
  temperature = stemma.get_temp()
  light       = get_light() 

  payload = {
    "moisture":    moisture,
    "temperature": temperature,
    "light":       light
  }

  print(json.dumps(payload))
  r = requests.put(URL, data=json.dumps(payload), headers=HEADERS)
  return r.status_code

def post_w_led():
  pixels[0] = (0, 0, 255)
  pixels.show()
  status = post()

  if not status == requests.codes.ok:
    pixels[0] = (255,0,0)   
  pixels[0] = (0,255,0)
  pixels.show()

  time.sleep(15)
  pixels[0] = (0,0,0)
  pixels.show()

while True:
  post_w_led()
  time.sleep(UPDATE_PERIOD)
