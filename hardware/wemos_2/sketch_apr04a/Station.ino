TinyUPnP *tinyUPnP = new TinyUPnP(30000);  // -1 for blocking (preferably, use a timeout value in [ms])
ArduinoJWT jwt;
AES aes;

void StationMain() {
  if(ApiSet) decodeApiKey();
  if(WiFiSet) {
    initWiFiConnect();
//  encryptBody();      
    initUPnP();
//  PingApi();
  }
}

void StationLoop() {
  if(WiFiSet) {
    MDNS.update();
    server.handleClient();
  } else {
    // Show some kind of LED flash Error
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

void initUPnP() {
  boolean portMappingAdded = false;
  tinyUPnP->addPortMappingConfig(WiFi.localIP(), LISTEN_PORT, RULE_PROTOCOL_TCP, LEASE_DURATION, getAPName());
  tinyUPnP->commitPortMappings();
  tinyUPnP->printAllPortMappings();
}

// HTTP SERVER ====================================
void addStationHttpRoutes() {
  server.on("/",          HTTP_GET, handleRootStation);
  server.on("/REGISTER",  HTTP_POST, handleRegisterStation);
  server.on("/PING",      HTTP_GET, handlePingStation);
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

void handlePingStation() {
  server.send(200, "text/plain", "pong!");
  Serial.println("got pinged!");
}


// HTTP HELPERS ===============================================================

void decodeApiKey() {  
  char* tokenBuffer = readStringFromEEPROM(KEY_ADDR);
  //copy from EEPROM into global
  TOKEN = strdup(tokenBuffer);
 
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
