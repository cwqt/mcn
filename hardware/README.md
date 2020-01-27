# hardware

## garden (esp32)

Garden operates via a ESP32 (LilyGo TTGO V5), 8 moisture inputs, light level, water tank level, temperature & humidity. Garden has two high-power outputs to control a valve and hydroponics light.

## plant (wesmos_d1_mini)

Plant operates via a WEMOS D1 mini with a custom PCB hat, moisture, light level, temperature & humidity.

## pi

### ndvi-cam

Pi NoIR camera to see active photosynthesis via Normalized Difference Vegetation Index (NDVI).

<https://www.richardmudhar.com/blog/2015/07/using-near-ir-to-look-for-photosynthesis-and-plant-health-with-ndvi/>

### prototype-singular

Prototype board for testing API & site. Temperature, light level & moisture. 2.2" adafruit TFT display for debugging.

.env
`API_KEY=my_api_key`