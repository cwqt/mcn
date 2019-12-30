#include <ArduinoJson.h>
#include <DHT.h>
#include <DHT_U.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <uptime_formatter.h>
#include <GxFont_GFX.h>
#include <GxEPD.h>
#include <GxIO/GxIO_SPI/GxIO_SPI.h>
#include <GxIO/GxIO.h>
#include <Fonts/Roboto_Medium8pt7b.h>
#include <Fonts/Roboto_Bold8pt7b.h>
#include "board_def.h"

#define API_URL "http://esp32_garden.herokuapp.com"
#define API_USERNAME "cass"
#define API_PASSWORD "pass"
#define GARDEN_UUID "3f19e49e-ab7b-42be-b997-7013376bfd88"
#define SHORT_UUID "3f19e49e"

#define WIFI_SSID "VM3990952"
#define WIFI_PASSWORD "t7hyDqgPtn6t"

#define DHT22_INPUT 32
#define ANALOG_INPUT 36
#define VALVE_SWITCH 0
#define LIGHT_SWITCH 12

int MUX_PINS[4] = {25, 26, 27, 33};
int PLANT_POSITIONS[8] = {0,1,2,3,4,5,6,7};
#define LIGHT_SENSOR 8
#define WATER_SENSOR 9

GxIO_Class io(SPI, ELINK_SS, ELINK_DC, ELINK_RESET);
GxEPD_Class display(io, ELINK_RESET, ELINK_BUSY);
HTTPClient http;
DHT dht(DHT22_INPUT, DHT22);

typedef enum {
  RIGHT_ALIGNMENT = 0,
  LEFT_ALIGNMENT,
} Text_alignment;

void setup() {
  Serial.begin(9600);
  while (!Serial) {}
  delay(100);

  initialiseDisplay();
  attemptWiFiConnect(3000);
  drawFooter();
  drawHeader();  
  display.update();
}

void initialiseDisplay() {
  display.init();
  display.setTextColor(GxEPD_BLACK);
  display.setTextSize(0);
  display.setRotation(1);
}

void drawHeader() {
  drawText("IP  ", parseWiFiStatus(), 0, 11, LEFT_ALIGNMENT);
  drawText("WTR  ", "12%", 0, 11, RIGHT_ALIGNMENT);
  drawLine(0,16,250,16);
}

void attemptWiFiConnect(int timeout) {
  uint64_t start = millis();
  WiFi.setAutoReconnect(false);
  WiFi.setAutoConnect(false);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
    
    if (millis() - start > timeout) {
      WiFi.disconnect();
      Serial.println("WiFi connect timed out");
      return;
    }
  }

  Serial.println("Connected: " + WiFi.localIP());
}

String parseWiFiStatus() {
  switch(WiFi.status()) {
    case WL_IDLE_STATUS: return "idle";
    case WL_CONNECTED: return WiFi.localIP().toString();
    case WL_CONNECT_FAILED: return "conn failed";
    case WL_CONNECTION_LOST: return "conn lost";
    case WL_DISCONNECTED: return "disconnected";
    default: return "connecting...";
  }
}

void drawFooter() {
  drawText("ID  ", SHORT_UUID, 0, 120, LEFT_ALIGNMENT);
  drawText("UP  ", uptime_formatter::getUptime(), 0, 120, RIGHT_ALIGNMENT);
  drawLine(0,103,250,103);
}

void drawLine(int x0, int y0, int x1, int y1) {
  int dx = abs(x1-x0), sx = x0<x1 ? 1 : -1;
  int dy = abs(y1-y0), sy = y0<y1 ? 1 : -1; 
  int err = (dx>dy ? dx : -dy)/2, e2;
 
  for(;;){
    display.drawPixel(x0, y0, GxEPD_BLACK);
    if (x0==x1 && y0==y1) break;
    e2 = err;
    if (e2 >-dx) { err -= dy; x0 += sx; }
    if (e2 < dy) { err += dx; y0 += sy; }
  }
}

float readValueFromMux(int pos) {
  for(int i=0; i<sizeof(MUX_PINS); i++) {
    digitalWrite(MUX_PINS[i], bitRead(pos, i)); 
  }
}

int *getPlantMoistureLevels() {
  float r[8];
  for(int i=0; i<sizeof(PLANT_POSITIONS); i++) {
    r[i] = readValueFromMux(i);
  }  
}

int *getTempAndHumidity() {
  dht.begin();
  float hum  = dht.readHumidity();
  float temp = dht.readTemperature();
  dht.end();
  float r[] = {temp, hum};
  return r;
}

void sendDataToApi(float moisture_levels[], float light_level, float temperature, float humidity, bool lightIsOn) {
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST("POSTING from ESP32");

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);   //Print return code
    Serial.println(response);   
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}

void drawText(const String &label, const String &content, int16_t x, int16_t y, uint8_t alignment) {
    //whole string position
    int16_t x1, y1;
    uint16_t w1, h1;
    display.getTextBounds(label + content, x, y, &x1, &y1, &w1, &h1);

    //just the label
    int16_t x2, y2;
    uint16_t w2, h2;
    display.setCursor(x, y);
    display.getTextBounds(label, x, y, &x2, &y2, &w2, &h2);
    
    switch (alignment) {
    case RIGHT_ALIGNMENT:
        display.setCursor(display.width() - w1 - x1, y);
        display.setFont(&Roboto_Bold8pt7b);
        display.println(label);
        
        display.setCursor(display.width() - (w1-w2), y);        
        display.setFont(&Roboto_Medium8pt7b);
        display.println(content);
        break;
        
    case LEFT_ALIGNMENT:
        display.setCursor(0, y);
        display.setFont(&Roboto_Bold8pt7b);
        display.println(label);

        display.setCursor(w2, y);
        display.setFont(&Roboto_Medium8pt7b);
        display.println(content);
        break;
    default:
        break;
    }
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    attemptWiFiConnect(3000);
  }

  //collect all plant data
  float moisture_levels[] = &getPlantMoistureLevels();

  //collect temp and humidity from DHT22
  float DHT22_Result[] = &getTempAndHumidity();
  float temperature = DHT22_Result[0];
  float humidity = DHT22_Result[1];

  //collect light level
  float light_level = readValueFromMux(LIGHT_SENSOR);

  //if connected, send data
  if (WiFi.status() == WL_CONNECTED) {
    sendDataToApi(moisture_levels,
                  temperature,
                  humidity,
                  light_level,
                  digitalRead(VALVE_SWITCH);
  }

  //check water level
  if (readValueFromMux(WATER_SENSOR) < 100) {
    
    digitalWrite(VALVE_SWITCH, HIGH);
    do {
      //nothing
    } while(readValueFromMux(WATER_SENSOR) < 1000);
    digitalWrite(VALVE_SWITCH, LOW);
    
  } else { digitalWrite(VALVE_SWITCH, LOW); }
  
  //check light level
  if (readValueFromMux(LIGHT_SENSOR) < 1000) {
    digitalWrite(LIGHT_SWITCH, HIGH);
  } else { digitalWrite(LIGHT_SWITCH, LOW); }


  display.update();
  delay(300);//5 minutes
}
