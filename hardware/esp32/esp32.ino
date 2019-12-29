#include "uptime_formatter.h"

#include <GxFont_GFX.h>
#include <GxEPD.h>
#include <GxIO/GxIO_SPI/GxIO_SPI.h>
#include <GxIO/GxIO.h>
#include <Fonts/Roboto_Medium8pt7b.h>
#include <Fonts/Roboto_Bold8pt7b.h>
#include "board_def.h"

GxIO_Class io(SPI, ELINK_SS, ELINK_DC, ELINK_RESET);
GxEPD_Class display(io, ELINK_RESET, ELINK_BUSY);

#include <WiFi.h>

#define GARDEN_UUID "3f19e49e-ab7b-42be-b997-7013376bfd88"
#define SHORT_UUID "3f19e49e"
#define WIFI_SSID "VM3990952"
#define WIFI_PASSWORD "t7hyDqgPtn6t"

typedef enum {
  RIGHT_ALIGNMENT = 0,
  LEFT_ALIGNMENT,
} Text_alignment;

void setup() {
  Serial.begin(9600);
  while (!Serial) {}
  delay(100);
  
  display.init();
  display.setFont(&Roboto_Medium8pt7b);
  display.setTextColor(GxEPD_BLACK);
  display.setTextSize(0);
  display.setRotation(1);

  Serial.println("Start");

  drawHeader();
  drawFooter();
  display.update();
  
  attemptWiFiConnect(3000);

  delay(1000);
  display.eraseDisplay();
  delay(1000);

  drawHeader();
  display.update();
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
    display.drawPixel(x0,y0,GxEPD_BLACK);
    if (x0==x1 && y0==y1) break;
    e2 = err;
    if (e2 >-dx) { err -= dy; x0 += sx; }
    if (e2 < dy) { err += dx; y0 += sy; }
  }
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
    //Serial.println("up " + uptime_formatter::getUptime());
    //delay(1000);
}
