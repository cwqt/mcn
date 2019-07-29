#!/usr/bin/python3
import time
import markdown
import os
import json

from flask          import Flask, request, jsonify
from flask_restful  import Resource, Api, reqparse
from flask_pymongo  import PyMongo
from bson           import Binary, Code
from bson.json_util import dumps
from bson.objectid  import ObjectId

def create_app(conf="src.settings"):
  app = Flask(__name__)
  app.config.from_object(conf)
  return app

app = create_app()
mongo = PyMongo(app)
api = Api(app)

@app.route('/')
def get_docs():
  with open(os.path.dirname(app.root_path) + "/README.md", "r") as markdown_file:
    content = markdown_file.read()
    return markdown.markdown(content)

class PlantList(Resource):
  def get(self):
    plants = mongo.db.plants
    plants_list = list(plants.find())
    v = json.loads(dumps(plants_list))
    return {"message": v}, 200

  def post(self):
    parser = reqparse.RequestParser()
    parser.add_argument('name', required=True)
    parser.add_argument('image_url')
    args = parser.parse_args()

    collection = mongo.db.plants
    if collection.find_one({"plant_name": args["name"]}):
      return {"message": "Plant already exists"}, 200

    #supply placeholder image if none supplied
    if not args["image_url"]:
      args["image_url"] = "http://placehold.it/300x400"

    plant = {
      "plant_name": args["name"],
      "date_added": int(time.time()),
      "image_url": args["image_url"],
      "updates": {}
    }
    plant_id = str(collection.insert(plant))
    return {"message": {"_id":plant_id}}, 201


class Plant(Resource):
  def get(self, uuid):
    collection = mongo.db.plants
    plant = collection.find_one({"_id": ObjectId(uuid)})
    plant = json.loads(dumps(plant))
    return {"message": plant}, 200

  def put(self, uuid):
    parser = reqparse.RequestParser()
    parser.add_argument('moisture_level', required=True)
    args = parser.parse_args()

    collection = mongo.db.plants
    print(request.json)
    plant = collection.find_one({"_id": ObjectId(uuid)})
    if plant:
      plant["updates"][str(int(time.time()))] = request.json["moisture_level"]
      collection.save(plant)
      return 201
    else:
      return {"message": "Plant not found"}, 404

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
