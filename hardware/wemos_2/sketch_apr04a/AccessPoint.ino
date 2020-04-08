void ApMain() {
  initAccessPoint();
}

void ApLoop() {
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
}

void initAccessPoint() {
  Serial.println("\n[INFO] Configuring access point");
  WiFi.mode(WIFI_AP);

  WiFi.softAP(getAPName().c_str(), WiFiAPPSK);

  startMDNS(WiFi.softAPIP());
  startHttpServer();
  Serial.println(WiFi.softAPIP());
}

String getAPName() {
  uint8_t mac[WL_MAC_ADDR_LENGTH];
  WiFi.softAPmacAddress(mac);
  String macID = String(mac[WL_MAC_ADDR_LENGTH - 2], HEX) +
                 String(mac[WL_MAC_ADDR_LENGTH - 1], HEX);
  macID.toUpperCase();
  return AP_NamePrefix + macID;
}

// HTTP SERVER ========================================================================
void addApHttpRoutes() {
  server.on("/",          HTTP_GET, handleRootAp);
  server.on("/WIFI",      HTTP_POST, handleWiFiAp);
  server.on("/CLEAR",     HTTP_POST, handleClearEEPROMAp);
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
