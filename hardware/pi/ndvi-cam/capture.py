import os
import shutil
import datetime
import picamera
import requests
import matplotlib
import numpy              as numpy
import matplotlib.pyplot  as plt
from PIL                  import Image, ImageFont, ImageDraw
from matplotlib.colors    import LinearSegmentedColormap
from colors               import colors
from pydrive.auth         import GoogleAuth
from pydrive.drive        import GoogleDrive

# https://stackoverflow.com/questions/24419188/automating-pydrive-verification-process
gauth = GoogleAuth()
gauth.LoadCredentialsFile("mycreds.txt")
if gauth.credentials is None:
    gauth.GetFlow()
    gauth.flow.params.update({'access_type': 'offline'})
    gauth.flow.params.update({'approval_prompt': 'force'})
    gauth.LocalWebserverAuth()
elif gauth.access_token_expired:
    gauth.Refresh()
else:
    gauth.Authorize()

gauth.SaveCredentialsFile("mycreds.txt")  
drive = GoogleDrive(gauth)

matplotlib.use('Agg')
# PATH = "/Users/cass/Code/Projects/Sites/hydroponics/hardware/pi/ndvi-cam"
PATH = "/home/pi/hydroponics/hardware/pi/ndvi-cam"

def get_filename_wout_extension(filename):
  return os.path.splitext(os.path.basename(filename))[0]

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
  print(f'Captured image {ts}')
  shutil.copy2(filename, PATH+'/latest.jpg')
  return filename


def image_preprocess(filename):
  print(f'Pre-processing {filename}')
  img = Image.open(PATH+'/'+filename)
  img = img.resize((719, 540))
  img.save(PATH+'/'+filename)
  return filename


def ndvi(filename):
    print(f'Performing NDVI on {filename}')
    img = Image.open(PATH+'/'+filename)
    filename = get_filename_wout_extension(filename)

    imgR, imgG, imgB = img.split()

    arrR = numpy.asarray(imgR).astype('float')
    arrB = numpy.asarray(imgB).astype('float')
    
    redBlueDiff = (arrR - arrB)
    redBlueSum = (arrR + arrB)
    redBlueSum[redBlueSum == 0] = 0.01

    arrNDVI = redBlueDiff/redBlueSum
    
    # plt.imsave(PATH+"/"+filename+"-processed.jpg", arrNDVI, vmin=-1.0,vmax=1.0)
    fastiecm = LinearSegmentedColormap.from_list('mylist', colors) 
    plt.imsave(PATH+"/"+filename+"-NDVI.jpg", arrNDVI, cmap=fastiecm, vmin=-1.0, vmax=1.0)
    return filename+"-NDVI.jpg"


def overlay_timestamp(t, filename):
  ts_read = t.strftime('%H:%M, %a. %d %b %Y')
  img = Image.open(PATH+'/'+filename)
  draw = ImageDraw.Draw(img)
  font = ImageFont.truetype(PATH+'/Roboto-Regular.ttf', 36)  
  draw.text((10, 10), ts_read, (255, 255, 255), font=font)
  draw.text((10, 490), "hydroponics-cam.lan", (255, 255, 255), font=font)
  filename = get_filename_wout_extension(filename)+"-ts.jpg"
  img.save(PATH+'/'+filename)
  return filename


def upload(filename, parent_id):
  print(f'Uploading {filename} to {parent_id}')
  with open(filename, "r") as file:
    file_drive = drive.CreateFile({
      'title':os.path.basename(file.name),
      "parents": [{"kind": "drive#fileLink", "id": parent_id}]
    })  
    file_drive.SetContentFile(PATH+"/"+filename) 
    file_drive.Upload()

# def ListFolder(parent):
#   filelist=[]
#   file_list = drive.ListFile({'q': "'%s' in parents and trashed=false" % parent}).GetList()
#   for f in file_list:
#     if f['mimeType']=='application/vnd.google-apps.folder': # if folder
#         filelist.append({"id":f['id'],"title":f['title'],"list":ListFolder(f['id'])})
#     else:
#         filelist.append({"title":f['title'],"title1":f['alternateLink']})
#   return filelist
# print(ListFolder('root'))

t = datetime.datetime.now()
# filename = capture_image(timestamp)
filename = "test.jpg"
filename = image_preprocess(filename)
upload(filename, os.environ.get("G_DRIVE_RAW_FOLDER_ID"))
filename = ndvi(filename)
filename = overlay_timestamp(t, filename)
upload(filename, os.environ.get("G_DRIVE_NDVI_FOLDER_ID"))
