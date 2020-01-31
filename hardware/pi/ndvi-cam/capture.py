import os
import shutil
import datetime
import picamera
import requests
import matplotlib
import numpy 							as numpy
import matplotlib.pyplot 	as plt
from PIL 									import Image, ImageFont, ImageDraw
from matplotlib.colors 		import LinearSegmentedColormap
from colors 							import colors

matplotlib.use('Agg')
PATH = "/home/pi/hydroponics/hardware/pi/ndvi-cam"

def capture_image(t):
  ts = t.strftime('%Y-%m-%d-%H-%M')
  cam = picamera.PiCamera()
  cam.resolution = (3280, 2464)
  cam.hflip = True
  cam.vflip = True

  #white balancing
  redAWB=2.26
  blueAWB=0.74
  can.awb_mode = "off"
  can.awb_gains = (redAWB, blueAWB)

  filename = PATH+'/image-' + t.strftime('%Y-%m-%d-%H-%M') + '.jpg'
  cam.capture(filename, quality=100)
  shutil.copy2(filename, PATH+'/latest.jpg')
  return filename


def image_preprocess(filename):
  img = Image.open(PATH+'/latest.jpg', Image.LANCZOS)
  img = img.resize((1438, 1080))


def ndvi(filename):
    img = Image.open(image)

    imgR, imgG, imgB, imgA = img.split()

    arrR = numpy.asarray(imgR).astype('float')
    arrB = numpy.asarray(imgB).astype('float')
    
    redBlueDiff = (arrR - arrB)
    redBlueSum = (arrR + arrB)
    redBlueSum[redBlueSum ==0] = 0.01

    arrNDVI = redBlueDiff/redBlueSum
    
    plt.imsave(PATH+"/processed.jpg",arrNDVI, vmin=-1.0,vmax=1.0)

    fastiecm=LinearSegmentedColormap.from_list('mylist', colors) 
    plt.imsave(PATH+"/out.jpg",arrNDVI,cmap=fastiecm, vmin=-1.0, vmax=1.0)


def overlay_timestamp(t, filename):
  ts_read = t.strftime('%H:%M, %a. %d %b %Y')
  img = Image.open(PATH+'/latest.jpg')
  draw = ImageDraw.Draw(img)
  font = ImageFont.truetype(PATH+'/Roboto-Regular.ttf', 36)  
  draw.text((10, 10), ts_read, (255, 255, 255), font=font)
  filename = PATH+'/latest_ts.jpg'
  img.save(filename)
  return filename


def upload(filename):
	pass

timestamp = datetime.datetime.now()
filename = capture_image(timestamp)
filename = image_preprocess(filename)
filename = ndvi(filename)
filename = overlay_timestamp(t, filename)
upload(filename)