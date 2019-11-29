import unittest
import os
import sys
import json

from mockupdb   import * 

from settings   import app_config
from __init__   import create_app

def generate_token(app, client):
  resp = client.get("/auth/",
    headers={"Auth-Password": app.config["AUTH_SECRET_KEY"]})
  return json.loads(resp.get_data())["data"]

class AppTestCase(unittest.TestCase):
  def setUp(self):
    self.server = MockupDB(port=58000)
    self.port = self.server.run()
    self.app = create_app("testing")
    self.client = self.app.test_client()
    self.token = generate_token(self.app, self.client)

  def test_make_access_token(self):
    resp = self.client.get("/auth/",
      headers={"Auth-Password": self.app.config["AUTH_SECRET_KEY"]})
    self.assertEqual(resp._status_code, 200)
    token = json.loads(resp.get_data())["data"]

  def test_invalid_password(self):
    resp = self.client.get("/auth/",
      headers={"Auth-Password": "totallyfalse"})
    self.assertEqual(resp._status_code, 401)

  def test_get_gardens(self):
    resp = self.client.get("/gardens")
    self.assertEqual(resp._status_code, 200)

  # def test_create_garden(self):
  #   resp = self.client.post("/gardens/",
  #     headers={"x-access-token": self.token})
  #   self.assertEqual(resp._status_code, 200)

  def tearDown(self):
    self.server.stop()

if __name__ == "__main__":
  unittest.main()