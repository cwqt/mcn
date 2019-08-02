#!/usr/bin/python3
import time
import os
import json
import markdown
import re

from flask          import Flask, request, jsonify, abort
from flask_restful  import Resource, Api, reqparse
from flask_pymongo  import PyMongo
from bson           import Binary, Code
from bson.json_util import dumps
from bson.objectid  import ObjectId
from functools      import wraps

def create_app(config_object="settings"):
  app = Flask(__name__)
  app.config.from_object(config_object)
  return app

app = create_app()
mongo = PyMongo(app)
api = Api(app)

def requires_auth(f):
  @wraps(f)
  def wrap(*args, **kwargs):
    print(request.headers)
    if not "AUTH_TOKEN" in request.headers:
      return {"message": "Requires AUTH_TOKEN header"}, 401

    token = re.sub(r'\W+', '', request.headers["AUTH_TOKEN"])
    if token == app.config["AUTH_TOKEN"]:
      return f(*args, **kwargs)
    else:
      return {"message": "Invalid AUTH_TOKEN"}, 401
  return wrap

@app.route('/')
def get_docs():
  with open("README.md", "r") as markdown_file:
    content = markdown_file.read()
    return markdown.markdown(content)

@app.route("/auth/")
@requires_auth
def return_auth_value():
  return json.dumps({"data": True}), 200

class PlantList(Resource):
  def get(self):
    plants = mongo.db.plants
    plants_list = list(plants.find())
    v = json.loads(dumps(plants_list))
    for plant in v: #ObjectId conversion
      plant["_id"] = plant["_id"]["$oid"]
    return {"data": v}, 200

  @requires_auth
  def post(self):
    parser = reqparse.RequestParser()
    parser.add_argument("plant_name", required=True)
    parser.add_argument('image_url')
    args = parser.parse_args()

    collection = mongo.db.plants
    if collection.find_one({"plant_name": args["plant_name"]}):
      return {"message": "Plant already exists"}, 409 #conflict

    #supply placeholder image if none supplied
    if not args["image_url"]:
      args["image_url"] = "http://placehold.it/300x400"

    plant = {
      "plant_name": args["plant_name"],
      "date_added": int(time.time()),
      "image_url": args["image_url"],
      "updates": {}
    }
    plant_id = str(collection.insert(plant))
    return {"data": {"_id":plant_id}}, 201

class Plant(Resource):
  def get(self, uuid):
    collection = mongo.db.plants
    plant = collection.find_one({"_id": ObjectId(uuid)})
    plant = json.loads(dumps(plant))
    #remove mongodb oddity with ObjectId conversion
    plant["_id"] = plant["_id"]["$oid"]
    return {"data": plant}, 200

  @requires_auth
  def put(self, uuid):
    parser = reqparse.RequestParser()
    parser.add_argument('moisture_level', required=True)
    parser.add_argument('temperature', required=True)
    args = parser.parse_args()

    collection = mongo.db.plants
    plant = collection.find_one({"_id": ObjectId(uuid)})
    if plant:
      plant["updates"][str(int(time.time()))] = [request.json["moisture_level"], request.json["temperature"]]
      collection.save(plant)
      return 201
    else:
      return {"message": "Plant not found"}, 404

  @requires_auth
  def delete(self, uuid):
    collection = mongo.db.plants
    plant = collection.find_one({"_id": ObjectId(uuid)})
    if plant:
      collection.remove(plant)
      return 200
    else:
      return {"message": "Plant not found"}, 404

api.add_resource(PlantList, "/plants/")
api.add_resource(Plant, "/plants/<string:uuid>")
