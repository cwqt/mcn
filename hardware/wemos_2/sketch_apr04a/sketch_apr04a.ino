#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <EEPROM.h>
#include <ArduinoJson.h>
#include <base64.h>
#include <ArduinoJWT.h>
#include "TinyUPnP.h"

const char* AP_NamePrefix = "mcn-";
const char* WiFiAPPSK = "iloveplants";
const char* DomainName = "mcn-wd1m";  // set domain name domain.local
bool httpServerUp = false;
bool ApMode = false;

#define LISTEN_PORT 17997
#define LEASE_DURATION 0
#define FRIENDLY_NAME "mcn-wd1m"

//setters 1 byte, 1 or 0
//key can be up to 304 bytes
#define WIFI_SET 0
#define API_SET 1

//32 byte ssid with null terminator
//32 byte pass with null terminator
#define SSID_ADDR 2
#define PASS_ADDR 34

//32 byte API URL with null terminator
#define API_ADDR 67 
#define KEY_ADDR 100

TinyUPnP *tinyUPnP = new TinyUPnP(20000);  // -1 for blocking (preferably, use a timeout value in [ms])
ESP8266WebServer server(LISTEN_PORT);
ArduinoJWT jwt;

const char* UID;
const char* TYPE;
const char* API_URL;
const char* TOKEN;

bool WiFiSet;
bool ApiSet;

void setup() {
  Serial.begin(9600);
  Serial.println();

  EEPROM.begin(512);//Starting and setting size of the EEPROM
  delay(100);

  setFlagsFromEEPROM();
  printEEPROMData();

  if (ApMode) initAccessPoint();
  if (!ApMode) {
    if(ApiSet) decodeApiKey();
    if(WiFiSet) {
      initWiFiConnect();
//      initUPnP();
      PingApi();
    }
  }
}

void loop() {
  if (ApMode) {
    while (WiFi.softAPgetStationNum() == 0) {
      Serial.printf("Stations connected: %d\n", WiFi.softAPgetStationNum());
      delay(3000);
      if (httpServerUp == true) closeHttpServer();
    }

    if (httpServerUp == false) startHttpServer();
    if (httpServerUp == true) {
      MDNS.update();
      server.handleClient();
    }
  } else {
    if(WiFiSet) {
      MDNS.update();
      server.handleClient();
    } else {
      // Show some kind of LED flash Error
    }
  }
}

void initWiFiConnect() {
  char* SSID = readStringFromEEPROM(SSID_ADDR);
  char* PASS = readStringFromEEPROM(PASS_ADDR);
  Serial.printf("[INFO] Attempting WiFi connect to: ");
  Serial.printf(SSID);
  Serial.printf(" ");
  Serial.println(PASS);
  
  WiFi.begin(SSID, PASS);
  free(SSID);
  free(PASS);
  
  while (WiFi.status() != WL_CONNECTED)  {
    delay(500);
    Serial.print("*");
  }
  Serial.printf("\nIP: ");
  Serial.println(WiFi.localIP().toString().c_str());
  startMDNS(WiFi.localIP());
  startHttpServer();
}

void initAccessPoint() {
  Serial.println("\n[INFO] Configuring access point");
  WiFi.mode(WIFI_AP);

  WiFi.softAP(getAPName().c_str(), WiFiAPPSK);

  startMDNS(WiFi.softAPIP());
  startHttpServer();
}

void startMDNS(const IPAddress &addr) {
  if (!MDNS.begin(DomainName, addr)) {
    Serial.println("[ERROR] MDNS responder did not setup");
    while (1) {
      delay(1000);
    }
  } else {
    MDNS.addService("http", "tcp", 80);
    Serial.println("[INFO] MDNS setup is successful!");
  }
}

String getAPName() {
  uint8_t mac[WL_MAC_ADDR_LENGTH];
  WiFi.softAPmacAddress(mac);
  String macID = String(mac[WL_MAC_ADDR_LENGTH - 2], HEX) +
                 String(mac[WL_MAC_ADDR_LENGTH - 1], HEX);
  macID.toUpperCase();
  return AP_NamePrefix + macID;
}

void startHttpServer() {
  httpServerUp = true;
  if (ApMode) {
    server.on("/", HTTP_GET, handleRootAp);
    server.on("/WIFI", HTTP_POST, handleWiFiAp);
    server.on("/CLEAR", HTTP_POST, handleClearEEPROMAp);
  } else {
    server.on("/", HTTP_GET, handleRootStation);
    server.on("/REGISTER", HTTP_POST, handleRegisterStation);
  }
  server.begin();
  Serial.println("[INFO] Http " + String(ApMode ? "Ap" : "Station") + " server started");
}

void closeHttpServer() {
  httpServerUp = false;
  server.close();
  Serial.println("[INFO] Http " + String(ApMode ? "Ap" : "Station") + " server closed");
}

void handleRootStation() {
  server.send(200, "text/html", "<h1>Register device</h1><form action='/REGISTER' method='POST'><input type='text' placeholder='API URL...' name='API_URL'/><br/><textarea name='API_KEY' placeholder='Paste API key here' rows='4' cols='50'></textarea><br/><br/> <input type='submit' value='Save'></form><p>my.corrhizal.net -- wemos d1 mini (station mode)</p>");
}

void handleRegisterStation() {
  if (!server.hasArg("API_KEY") || server.arg("API_KEY") == NULL || !server.hasArg("API_URL") || server.arg("API_URL") == NULL) {
    server.send(400, "text/plain", "400: Invalid Request");
  }

  Serial.println("New API_URL: " + server.arg("API_URL"));
  Serial.println("New API_KEY: " + server.arg("API_KEY"));
  writeStringToEEPROM(API_ADDR, server.arg("API_URL"));
  writeStringToEEPROM(KEY_ADDR, server.arg("API_KEY"));
  EEPROM.write(API_SET, 1); //set flag in eeprom that wifi is set
  EEPROM.commit();

  server.send(200, "text/html", "<h1>Key saved</h1><p>Please reboot your device for first-time registration.</p>");
}

void handleRootAp() {
  server.send(200, "text/html", "<h1>Enter WiFi credentials</h1><form action='/WIFI' method='POST'> <input type='text' name='SSID' placeholder='WiFi SSID' /><br/> <input type='text' name='PASS' placeholder='Passphrase' /><br/><br/> <input type='submit' value='Save'></form><p>my.corrhizal.net -- wemos d1 mini (ap mode)</p><form action='/CLEAR' method='post'><button type='submit'>Clear EEPROM</button></form>");
}

void handleWiFiAp() {
  if (!server.hasArg("SSID") || !server.hasArg("PASS") || server.arg("SSID") == NULL || server.arg("PASS") == NULL) {
    server.send(400, "text/plain", "400: Invalid Request");
  }

  Serial.println("New SSID: " + server.arg("SSID"));
  Serial.println("New PASS: " + server.arg("PASS"));

  writeStringToEEPROM(SSID_ADDR, server.arg("SSID"));
  writeStringToEEPROM(PASS_ADDR, server.arg("PASS"));
  EEPROM.write(WIFI_SET, 1); //set flag in eeprom that wifi is set
  EEPROM.commit();

  server.send(200, "text/html", "<h1>Credentials successfully set</h1><p>Please turn off AP mode & reboot device for it to connect to WiFi.</p>");
}

void handleClearEEPROMAp() {
  for (int i = 0 ; i < EEPROM.length() ; i++) {
    EEPROM.write(i, 0);
  }
  EEPROM.commit();
  server.send(200, "text/html", "<h1>EEPROM cleared</h1>");
}

void writeStringToEEPROM(int addrOffset, const String &strToWrite) {
  byte len = strToWrite.length();
  EEPROM.write(addrOffset, len);
  for (int i = 0; i < len; i++) {
    EEPROM.write(addrOffset + 1 + i, strToWrite[i]);
  }
}

char* readStringFromEEPROM(int addrOffset) {
  int newStrLen = EEPROM.read(addrOffset);
  // 5Hello -> Hello\0, same memory size
  char* buffer = (char*)malloc(newStrLen*sizeof(char));
  //skip the length of string character
  for (int i = 0; i<newStrLen; i++) {
    buffer[i] = EEPROM.read(addrOffset+i+1);
  }
  //add null terminator
  buffer[newStrLen] = '\0';
  return buffer;
}

void decodeApiKey() {  
  char* tokenBuffer = readStringFromEEPROM(KEY_ADDR);
  char payload[52];
  jwt.decodeJWT(tokenBuffer, payload, 52);
  free(tokenBuffer);

  // uid: 24 byte unique ObjectId
  // type: plant | garden, garden 6 bytes
  // https://arduinojson.org/v6/assistant/
  const size_t capacity = JSON_OBJECT_SIZE(2) + 73;
  StaticJsonDocument<capacity> doc;
  DeserializationError err = deserializeJson(doc, payload);
  if (err) {
    Serial.print(F("[ERROR] deserializeJson() failed with code "));
    Serial.println(err.c_str());
  }
  UID = doc["uid"];
  TYPE = doc["type"];
  Serial.printf("[INFO] Decoded: ");
  Serial.printf(UID);
  Serial.printf(", ");
  Serial.println(TYPE);
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

void initUPnP() {
  boolean portMappingAdded = false;
  tinyUPnP->addPortMappingConfig(WiFi.localIP(), LISTEN_PORT, RULE_PROTOCOL_TCP, LEASE_DURATION, FRIENDLY_NAME);
  tinyUPnP->commitPortMappings();
  while (!portMappingAdded) {
    Serial.println("");
  
    if (!portMappingAdded) {
      // for debugging, you can see this in your router too under forwarding or UPnP
      tinyUPnP->printAllPortMappings();
      Serial.println(F("This was printed because adding the required port mapping failed"));
      delay(30000);  // 30 seconds before trying again
    }
  }
}

void setFlagsFromEEPROM() {
  WiFiSet = EEPROM.read(WIFI_SET) == 1 ? true : false;
  ApiSet = EEPROM.read(API_SET) == 1 ? true : false;
}

void printEEPROMData() {
  char* tSSID = readStringFromEEPROM(SSID_ADDR);
  char* tPASS = readStringFromEEPROM(PASS_ADDR);
  char* tAPI  = readStringFromEEPROM(API_ADDR);
  char* tKEY  = readStringFromEEPROM(KEY_ADDR);
  
  Serial.printf("[EEPROM] SSID: ");Serial.println(tSSID);
  Serial.printf("[EEPROM] PASS: ");Serial.println(tPASS);
  Serial.printf("[EEPROM] URL : ");Serial.println(tAPI);
  Serial.printf("[EEPROM] KEY : ");Serial.println(tKEY);

  free(tSSID);
  free(tPASS);
  free(tAPI);
  free(tKEY);
  
  Serial.printf("WiFi set?: ");Serial.println(WiFiSet ? "true" : "false");
  Serial.printf("Key set?: ");Serial.println(ApiSet ? "true" : "false");
}
