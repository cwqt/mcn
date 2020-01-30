#include <Wire.h>

#define ANALOG_PIN A0
int value = 0;

void setup() {
  Wire.begin(0x09);
  Wire.onRequest(requestEvent); // data request to slave
  Serial.begin(9600);           //  setup serial
  Serial.println("I2C Slave ready!");
}

void requestEvent() {
  value = analogRead(ANALOG_PIN);  // read the input pin
  Serial.println(value);
  String str = String(value, DEC);
  
  Wire.write(str.c_str());
  Serial.println("Request event");
}

void loop() {
  delay(50);
}
