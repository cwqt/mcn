#include <Time.h>
#include <TimeLib.h>
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
//WIFI_SSID, WIFI_PASSWORD, API_KEY
#include "secrets.h"

#define API_URL "api.hydroponics.cass.si"
#define GARDEN_UUID "5e21c99fa7b8674fb3c0bd02"
char PLANT_UUIDS[2][25] = { "5e21c9a7a7b8674fb3c0bd04", "5e21c9a5a7b8674fb3c0bd03" };
#define SHORT_UUID "b3c0bd02"

//update once an hr
#define UPDATE_PERIOD 3600
#define DHT22_INPUT 32
#define ANALOG_INPUT 36
#define LIGHT_SENSOR 8
#define WATER_SENSOR 9

//water sensor reading when fully immersed in water
#define EMPIRCAL_WATER_MAX 2215

#define VALVE_SWITCH 0
#define LIGHT_SWITCH 12
#define HAS_RESERVOIR 0

int MUX_PINS[4] = {25,26,27,33};
int PLANT_POSITIONS[8] = {0,1};

GxIO_Class io(SPI, ELINK_SS, ELINK_DC, ELINK_RESET);
GxEPD_Class display(io, ELINK_RESET, ELINK_BUSY);
HTTPClient http;
DHT dht(DHT22_INPUT, DHT22);

void setup() {
  Serial.begin(9600);
  while (!Serial) { delay(50); }


//  while (WiFi.status() != WL_CONNECTED) {
//    attemptWiFiConnect(10000);
//  }
//  Serial.println("hello");
//  time_t t = getTime().toInt();
//  String currentTime = String(hour(t)) + ":" + String(minute(t))  + ":" + String(second(t));
//  Serial.println(currentTime);
//  for(;;){}
  
  initialiseDisplay();
  dht.begin();

  pinMode(DHT22_INPUT, INPUT);
  pinMode(ANALOG_INPUT, INPUT);
  pinMode(VALVE_SWITCH, OUTPUT);
  pinMode(LIGHT_SWITCH, OUTPUT);
  pinMode(MUX_PINS[0], OUTPUT);
  pinMode(MUX_PINS[1], OUTPUT);
  pinMode(MUX_PINS[2], OUTPUT);
  pinMode(MUX_PINS[3], OUTPUT);

  drawBoot();
  drawSkeleton();
  updateInfo();
  display.update();
  delay(2000);
}

void updateInfo() {
  updateWiFiEpaperValue();
  updateUptimeEpaperValue();
  updateWaterEpaperValue();
}

void initialiseDisplay() {
  display.init();
  display.setTextColor(GxEPD_BLACK);
  display.setTextSize(0);
  display.setRotation(3);
  Serial.println("Display initialised!");
}

void drawBoot() {
  Serial.println("Boot screen");
  display.fillScreen(GxEPD_BLACK);
  display.setFont(&FreeMonoBold12pt7b);
  display.setCursor(70, 45);
  display.setTextSize(1);
  display.setTextColor(GxEPD_WHITE);
  display.println("daughter.");
  display.setCursor(80, 65);
  display.println("systems");
  display.drawBitmap(dsbit, 10, 2, 61, 115, GxEPD_WHITE);
  display.update();
  delay(2000);
  display.fillScreen(GxEPD_WHITE);
  display.update();
  display.setTextColor(GxEPD_BLACK);
}

void attemptWiFiConnect(int timeout) {
  Serial.println("Attempting WiFi connect...");
  Serial.print(WIFI_SSID);Serial.print(" : ");Serial.println(WIFI_PASSWORD);
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
      Serial.println("\nWiFi connect timed out");
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

String getTime() { 
  Serial.println("Getting time...");
  http.begin("https://currentmillis.com/time/seconds-since-unix-epoch.php");
  int httpResponseCode = http.GET();
  String response;
  if (httpResponseCode > 0) {
    response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);   
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
  return response;
}


float readValueFromMux(int pos) {
  float value;
  //set all pins to zero
  for(int i=0; i<sizeof(MUX_PINS); i++) { digitalWrite(MUX_PINS[i], LOW); }
  //in order of least to most signficant bit
  digitalWrite(MUX_PINS[0], bitRead(pos, 0)); //s0
  digitalWrite(MUX_PINS[1], bitRead(pos, 1)); //s1
  digitalWrite(MUX_PINS[2], bitRead(pos, 2)); //s2
  digitalWrite(MUX_PINS[3], bitRead(pos, 3)); //s3
  
  delay(2000);
  value = analogRead(ANALOG_INPUT); 

//  Serial.print(pos);
//  Serial.print(" ");
//  Serial.print(bitRead(pos, 3));
//  Serial.print(bitRead(pos, 2));
//  Serial.print(bitRead(pos, 1));
//  Serial.print(bitRead(pos, 0));
//  Serial.print(" ");
//  Serial.print(value);
//  Serial.print("\n");
  return value;
}

void getPlantMoistureLevels(float moisture_levels[]) {
  Serial.println("moisture_levels: ");
  for(int i=0; i<sizeof(PLANT_POSITIONS)/sizeof(int); i++) {
    moisture_levels[i] = readValueFromMux(PLANT_POSITIONS[i]);
    Serial.print(" ");Serial.print(i);Serial.print(": ");Serial.println(moisture_levels[i]);
  }  
  return;
}

void getTempAndHumidity(float *temperature, float *humidity) {  
  *humidity = dht.readHumidity();
  delay(2000);
  *temperature = dht.readTemperature();
  return;
}

int sendDataToApi(float moisture_levels[], float *temperature, float *humidity, float *light_level, float *water_level, int *light_status) {
  Serial.println("Attempting to sent to API...");
  StaticJsonDocument<200> doc;
  doc["temperature"] = *temperature; 
  doc["humidity"] = *humidity; 
  doc["light"] = *light_level; 
  doc["water_level"] = *water_level; 
  doc["light_on"] = *light_status; 
  serializeJsonPretty(doc, Serial);
  Serial.println("");

  char json_body[200];
  serializeJson(doc, json_body);
  
  http.begin("http://"API_URL"/gardens/"GARDEN_UUID);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", API_KEY);  
  int httpResponseCode = http.PUT(json_body);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);   //Print return code
    Serial.println(response);   
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
  return httpResponseCode;
}

// EPAPER ================================================================

void drawSkeleton() {
  display.setFont(&Roboto_Bold8pt7b);
  display.setCursor(0, 11);
  display.println("WIFI");

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
  String currentStatus = parseWiFiStatus();
  
  partialClearRegion(37,0,100,16);
  display.setFont(&Roboto_Medium8pt7b);
  display.setCursor(37, 11);
  display.println(currentStatus);
  display.updateWindow(37,0,100,16);
}

void updateWaterEpaperValue() {
  int res;
  float value = readValueFromMux(WATER_SENSOR);
  res = int((value / EMPIRCAL_WATER_MAX)*100);

  partialClearRegion(220,0,235,16);
  display.setFont(&Roboto_Medium8pt7b);
  display.setCursor(220, 11);
  display.println(res);

}

void clearContent() {
  display.fillRect(0, 20, 250, 80, GxEPD_WHITE);
}

void setLineString(int level, const String &bold, const String &str, int offset=100) {
  int sy = 35;
  int sx = 2;
  int lvl_height = 20;
  int y = sy + (lvl_height * level);


  display.setTextColor(GxEPD_BLACK);
  display.setCursor(sx, y);
  display.setFont(&Roboto_Bold8pt7b);
  display.println(bold+": ");
  display.setCursor(sx+offset, y);
  display.setFont(&Roboto_Medium8pt7b);
  display.println(str);
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
}

void partialClearRegion(int x, int y, int w, int h) {
  display.fillRect(x,y,w,h,GxEPD_WHITE);
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


// LOOP ====================================================
float moisture_levels[8];
float temperature, humidity;
float light_level;
float water_level;
int light_state = 0;
int valve_state = 0;

int post_count = 0;
int last_post_time;
int post_status;

void loop() {
  if (post_count == 0) {
    setLineString(0, "Performing first data capture...", "", 40);
    setLineString(1, "ID", SHORT_UUID, 40);
    setLineString(2, "API", "api.hydroponics.cass.si", 40); 
    display.update();
  }
  
  Serial.println("Capturing data...");
  getPlantMoistureLevels(moisture_levels);
  getTempAndHumidity(&temperature, &humidity);
  light_level = readValueFromMux(LIGHT_SENSOR);
  water_level = readValueFromMux(WATER_SENSOR);
  light_state = digitalRead(LIGHT_SWITCH);
  valve_state = digitalRead(VALVE_SWITCH);
  
  Serial.print("temperature: ");  Serial.println(temperature);
  Serial.print("humidity: ");     Serial.println(humidity);
  Serial.print("light_level: ");  Serial.println(light_level);
  Serial.print("water_level: ");  Serial.println(water_level);
  Serial.print("light_state: ");  Serial.println(light_state);
  Serial.print("valve_state: ");  Serial.println(valve_state);

  while (WiFi.status() != WL_CONNECTED) {
    attemptWiFiConnect(10000);
  }
  //if connected, send data
  if (WiFi.status() == WL_CONNECTED) {
    int responseCode = sendDataToApi(moisture_levels,
                        &temperature,
                        &humidity,
                        &light_level,
                        &water_level,
                        &light_state);
    
    last_post_time = millis();
    post_status = responseCode;
    post_count++;
  }

  Serial.print("Waiting for: ");Serial.print(UPDATE_PERIOD);
  Serial.println(" seconds\n");
  delay(1000);
  for (int i=0; i<4; i++) {
    int t_now = millis();
    time_t t = getTime().toInt();
    Serial.print(hour(t));
    Serial.print(minute(t));
    Serial.print(second(t));
    Serial.println("");

    Serial.println(t_now);
    Serial.println(last_post_time);
    Serial.println(((UPDATE_PERIOD*1000)-((t_now - last_post_time)))/60000);
    
    String currentTime = String(hour(t)) + ":" + String(minute(t))  + ":" + String(second(t));
    
    clearContent();
    setLineString(0, "Last post",   currentTime);
    setLineString(2, "Next post",   "in " + String(((UPDATE_PERIOD*1000)-((t_now - last_post_time)))/60000) + " minutes");
    setLineString(1, "Post status", String(post_status));
    setLineString(3, "Post count",  String(post_count) + " update(s)");
    updateInfo();
    display.update();
    delay((UPDATE_PERIOD/4)*1000);
  }
}
