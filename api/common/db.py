from flask_pymongo  import PyMongo
from bson.json_util import dumps
from bson.objectid  import ObjectId
import json
import time

mongo = PyMongo()

class db(object):
  def create_collection(uuid):
    mongo.db.create_collection(uuid)

  def get_all_collections():
    return mongo.db.list_collection_names()

  def get_collection(collection):
    return mongo.db[collection]

  def insert(collection, data):
    mongo.db[collection].insert_one(data)

  def add_moisture_level(collection, uuid, data):
    date = str(int(time.time())) #time returns float, dot notation
    resp = mongo.db[collection].update_one(
      {"_id": ObjectId(uuid)},
      {"$set": {"moisture_levels."+date: data}}
    )
    return resp.acknowledged

  def add_plant_to_garden(collection, uuid):
    resp = mongo.db[collection].update_one(
      {"_id": "root"},
      {"$push": {"plants": uuid}}
    )
    return resp.acknowledged

  def get_plant(collection, uuid):
    return mongo.db[collection].find_one({"_id": ObjectId(uuid)})

  def delete_collection(collection):
    mongo.db.drop_collection(collection)
    if not collection in mongo.db.collection_names():
      return True
    return False

  def delete_plant(collection, uuid):
    collection = mongo.db[collection]
    resp = collection.update(
      {"_id": "root"},
      {"$pull": {"plants": ObjectId(uuid)}}
    )
    if resp["nModified"] == 1:
      resp = collection.remove({"_id": ObjectId(uuid)})
      print(resp)
      return True if resp["n"] == 1 else False 
    return False

  def find_one(collection, query):
    result = mongo.db[collection].find_one(query)
    result = json.loads(dumps(result))
    print(result)
    if type(result["_id"]) == dict:
      result["_id"] = result["_id"]["$oid"]
    if result["created_at"]:
      result["created_at"] = result["created_at"]["$date"]
    return result
