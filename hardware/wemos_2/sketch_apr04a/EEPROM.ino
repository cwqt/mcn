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
