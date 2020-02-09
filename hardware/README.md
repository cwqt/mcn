# hardware

## garden (esp32)

Garden operates via a ESP32 (LilyGo TTGO V5), 8 moisture inputs, light level, water tank level, temperature & humidity. Garden has two high-power outputs to control a valve and hydroponics light.  
**Bill of Materials** in directory `README.md`

* `secrets.h`
	- `#define WIFI_SSID "wifi_ssid"`
	- `#define WIFI_PASSWORD "wifi_password"`
	- `#define API_KEY "api_key"`

## plant (wesmos_d1_mini)

Plant operates via a WEMOS D1 mini with a custom PCB hat, moisture, light level, temperature & humidity.  
**Bill of Materials** in directory `README.md`

## pi

### ndvi-cam

Pi NoIR camera to see active photosynthesis via Normalized Difference Vegetation Index (NDVI). Data sent to Google Drive image store via PyDrive. Images then used in dashboard through `/feed` api endpoint.

* `mycreds.txt`: Google Drive token to access/upload files, never expires
* `client_secrets.json`: <https://pythonhosted.org/PyDrive/quickstart.html>
* `.env`: Files stored in GDrive in the form `/hydroponics/<UUID>/raw` & `/hydroponics/<UUID>/ndvi`, PyDrive access subfolders via id's which can be listed by running `ListFolder` in `capture.py`
	- `G_DRIVE_RAW_FOLDER_ID`: Id of folder where raw files are
	- `G_DRIVE_NDVI_FOLDER_ID`: Id of folder where NDVI timestamped files are

#### Info

* <https://publiclab.org/notes/petter_mansson1/04-09-2019/low-cost-ndvi-analysis-using-raspberrypi-and-pinoir>  
* <https://www.richardmudhar.com/blog/2015/07/using-near-ir-to-look-for-photosynthesis-and-plant-health-with-ndvi/>

### prototype-singular

Prototype board for testing API & site. Temperature, light level & moisture. 2.2" adafruit TFT display for debugging. Uses Arduino as I²2 ADC slave, just because.

* `.env`
	- `API_KEY=my_api_key`
	- `API_URL=https://api.hydroponics.cass.si/`
	- `PLANT_UUID=plant_uuid`

```shell
sudo apt-get install python3-pip ttf-dejavu python3-pil
git clone https://gitlab.com/cxss/moisture.track.git
pipenv install
pipenv run python3 main.py
```

