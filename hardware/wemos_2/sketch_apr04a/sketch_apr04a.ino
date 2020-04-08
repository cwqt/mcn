#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <EEPROM.h>
#include <ArduinoJson.h>
#include <base64.h>
#include <ArduinoJWT.h>
#include <TinyUPnP.h>
#include <AES.h>
#include "address.h"

#define LISTEN_PORT 80
#define LEASE_DURATION 0

ESP8266WebServer server(LISTEN_PORT);

const char* UID;
const char* TYPE;
const char* API_URL;
char*       TOKEN;

const char* AP_NamePrefix = "mcn-";
const char* WiFiAPPSK = "iloveplants";

bool httpServerUp = false;
bool ApMode = false;
bool WiFiSet;
bool ApiSet;

void setup() {
  Serial.begin(9600);
  Serial.println();

  EEPROM.begin(512);//Starting and setting size of the EEPROM
  delay(100);

  setFlagsFromEEPROM();
  printEEPROMData();

  if (ApMode) ApMain();
  if (!ApMode) StationMain();
}

void loop() {
  if (ApMode) ApLoop();
  if(!ApMode) StationLoop();
}

void startMDNS(const IPAddress &addr) {
  if (!MDNS.begin(getAPName(), addr)) {
    Serial.println("[ERROR] MDNS responder did not setup");
    while (1) {
      delay(1000);
    }
  } else {
    MDNS.addService("http", "tcp", 80);
    Serial.println("[INFO] MDNS setup is successful!");
  }
}

void startHttpServer() {
  httpServerUp = true;
  if (ApMode) addApHttpRoutes();
  if(!ApMode) addStationHttpRoutes();
  server.begin();
  Serial.println("[INFO] Http " + String(ApMode ? "Ap" : "Station") + " server started");
}

void closeHttpServer() {
  httpServerUp = false;
  server.close();
  Serial.println("[INFO] Http " + String(ApMode ? "Ap" : "Station") + " server closed");
}






void PingApi() {
//  Serial.print("[HTTP] Pinging API");
//  http.begin("http://"+API_URL+"/");
//  int httpResponseCode = http.GET();
//  String response;
//  if (httpResponseCode > 0) {
//    response = http.getString();
//    Serial.println(httpResponseCode);
//  } else {
//    Serial.print("Error on sending POST: ");
//    Serial.println(httpResponseCode);
//  }
//
//  http.end();
//  return response;
}

//String getTime() {
//  Serial.print("Getting time... ");
//  http.begin("http://"API_URL"/time");
//  int httpResponseCode = http.GET();
//  String response;
//  if (httpResponseCode > 0) {
//    response = http.getString();
//    Serial.println(httpResponseCode);
//  } else {
//    Serial.print("Error on sending POST: ");
//    Serial.println(httpResponseCode);
//  }
//
//  http.end();
//  return response;
//}

//void encryptBody() {
//  byte *key = (unsigned char*)TOKEN;
//  aes.set_key(key, sizeof(key));  // Get the globally defined key
////  aes.do_aes_encrypt((byte *)b64data, b64len , cipher, key, 128, my_iv);
//
//}
