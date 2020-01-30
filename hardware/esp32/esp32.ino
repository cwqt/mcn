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
#include <Fonts/FreeMonoBold12pt7b.h>

#include "dsbit.h"
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

void drawBoot() {
  display.fillScreen(GxEPD_BLACK);
  display.setFont(&FreeMonoBold12pt7b);
  display.setCursor(70, 45);
  display.setTextSize(1);
  display.setTextColor(GxEPD_WHITE);
  display.println("daughter.");
  display.setCursor(80, 65);
  display.println("systems");
  display.drawBitmap(dsbit, 10, 3, 61, 115, GxEPD_WHITE);
  display.update();
  delay(2000);
  display.fillScreen(GxEPD_WHITE);
}

void setup() {
  Serial.begin(9600);
  while (!Serial) {}

  initialiseDisplay();
  drawBoot();

  
  
  drawSkeleton();
  updateWiFiEpaperValue();
  updateUptimeEpaperValue();
  drawPlants();
  display.update();

  delay(1000);
  attemptWiFiConnect(5000);

  display.update();
  showRequiresWatering();
  display.update();
}

void initialiseDisplay() {
  display.init();
  display.setTextColor(GxEPD_BLACK);
  display.setTextSize(0);
  display.setRotation(1);
  delay(1000);
  Serial.println("Display initialised");
}

void attemptWiFiConnect(int timeout) {
  uint64_t start = millis();
  WiFi.setAutoReconnect(false);
  WiFi.setAutoConnect(false);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  updateWiFiEpaperValue();
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
    updateWiFiEpaperValue();
    
    if (millis() - start > timeout) {
      WiFi.disconnect();
      Serial.println("WiFi connect timed out");
      updateWiFiEpaperValue();
      return;
    }
  }

  updateWiFiEpaperValue();
  Serial.println("Connected: " + WiFi.localIP());
}

String parseWiFiStatus() {
  switch(WiFi.status()) {
    case WL_IDLE_STATUS: return "connecting...";
    case WL_CONNECTED: return WiFi.localIP().toString();
    case WL_CONNECT_FAILED: return "conn failed";
    case WL_CONNECTION_LOST: return "conn lost";
    case WL_DISCONNECTED: return "disconnected";
    case WL_NO_SSID_AVAIL: return "no ssid found";
    default: return "uninitialised";
  }
}

float readValueFromMux(int pos) {
  float value;
  for(int i=0; i<sizeof(MUX_PINS); i++) {
    digitalWrite(MUX_PINS[i], bitRead(pos, i));
  }
  delay(100);
  value = digitalRead(ANALOG_INPUT); 
  return value;
}

void getPlantMoistureLevels(float moisture_levels[]) {
  for(int i=0; i<sizeof(PLANT_POSITIONS); i++) {
    moisture_levels[i] = readValueFromMux(PLANT_POSITIONS[i]);
  }  
  return;
}

void getTempAndHumidity(float dht22_result[]) {
  dht.begin();
  dht22_result[0] = dht.readHumidity();
  dht22_result[1] = dht.readTemperature();
  return;
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

void loop() {
  updateUptimeEpaperValue();
  delay(5000);
}

//void loop() {
//  if (WiFi.status() != WL_CONNECTED) {
//    attemptWiFiConnect(3000);
//  }
//
//  //collect all plant data
//  float moisture_levels[8];
//  getPlantMoistureLevels(moisture_levels);
//
//  //collect temp and humidity from DHT22
//  float dht22_result[2];
//  getTempAndHumidity(dht22_result);
//  float temperature = dht22_result[0];  
//  float humidity = dht22_result[1];
//
//  //collect light level
//  float light_level = readValueFromMux(LIGHT_SENSOR);
//
//  //if connected, send data
//  if (WiFi.status() == WL_CONNECTED) {
//    sendDataToApi(moisture_levels,
//                  temperature,
//                  humidity,
//                  light_level,
//                  digitalRead(VALVE_SWITCH));
//  }
//
//  //check water level
//  if (readValueFromMux(WATER_SENSOR) < 100) {
//    
//    digitalWrite(VALVE_SWITCH, HIGH);
//    do {
//      //nothing
//    } while(readValueFromMux(WATER_SENSOR) < 1000);
//    digitalWrite(VALVE_SWITCH, LOW);
//    
//  } else { digitalWrite(VALVE_SWITCH, LOW); }
//  
//  //check light level
//  if (readValueFromMux(LIGHT_SENSOR) < 1000) {
//    digitalWrite(LIGHT_SWITCH, HIGH);
//  } else { digitalWrite(LIGHT_SWITCH, LOW); }
//
//
//  display.update();
//  delay(300);//5 minutes
//}


// EPAPER ================================================================

void drawSkeleton() {
  display.setFont(&Roboto_Bold8pt7b);
  display.setCursor(0, 11);
  display.println("IP");

  display.setCursor(180, 11);
  display.println("WTR");

  display.setCursor(160, 120);
  display.println("ID");
  
  display.setCursor(0, 120);
  display.println("UP");

  drawLine(0,103,250,103);
  drawLine(0,16,250,16);

  display.setFont(&Roboto_Medium8pt7b);
  display.setCursor(180, 120);
  display.println(SHORT_UUID);
  
}

void updateWiFiEpaperValue() {
  display.setFont(&Roboto_Medium8pt7b);
  display.setCursor(20, 11);
  String currentStatus = parseWiFiStatus();
  partialClearRegion(20,0,100,16);
  display.println(currentStatus);
  display.updateWindow(20,0,100,16);
}

void updateWaterEpaperValue() {

}

void showRequiresWatering() {
  display.setFont(&FreeMonoBold12pt7b);
  display.fillRect(0, 20, 250, 80, GxEPD_BLACK);
  display.setCursor(10, 45);
  display.setTextSize(1);
  display.setTextColor(GxEPD_WHITE);
  display.println("Needs watering!");
  display.setTextColor(GxEPD_BLACK);
  display.setTextSize(0);
}

void updateUptimeEpaperValue() {
  display.setFont(&Roboto_Medium8pt7b);
  display.setCursor(25, 120);
  String currentStatus = uptime_formatter::getUptime();
  partialClearRegion(25,105,130,122);
  display.println(currentStatus);
  display.updateWindow(25,105,20,122);
}

void partialClearRegion(int x, int y, int w, int h) {
  display.fillRect(x,y,w,h,GxEPD_WHITE);
}

void drawPlant(int x, int y) {
  int w = 15;
  int h = 38;
  
  drawLine(x, y, x+w, y);
  drawLine(x, y, x, y+h);
  drawLine(x+w, y, x+w, y+h);
  drawLine(x, y+h, x+w, y+h);

  display.fillRect(x+2, y+2, w-3, h-3, GxEPD_BLACK);
}

void drawPlants(){ //float moisture_level[]) {
  int x = 0;
  int y = 20;
  for (int i=0; i<8; i++) {
    drawPlant(x, y);
    x = x + 18;
    if (i==3) { y = 61; x = 0; }
  }
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
