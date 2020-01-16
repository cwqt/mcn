import json
import time

from flask_pymongo  import PyMongo
from bson.json_util import dumps
from bson.objectid  import ObjectId

mongo = PyMongo()

# feeling a bit like it was a bad idea to fight pymongos dumps
# ObjectId -> str conversion (_id:ObjectId --> _id: { $oid })

class db(object):
  def create_collection(uuid):
    mongo.db.create_collection(uuid)
    if not mongo.db[uuid]:
      return False, "Error occured whilst creating collection"
    return True, "Collection created"

  def get_all_collections():
    return mongo.db.list_collection_names()

  def get_collection(collection):
    return mongo.db[collection]

  def insert_one(collection, data):
    bson = db.json_to_bson(data)
    res = mongo.db[collection].insert_one(bson)
    if not res.acknowledged:
      return False, "Did not insert data"
    return True, "Inserted data"

  def get_doc_count(collection):
    return mongo.db[collection].count()

  def get_measurements(collection, limit=20): # this lib sucks
    results = mongo.db[collection].find({}).sort([("timestamp",-1)]).limit(limit)
    results = json.loads(dumps(results))

    if not results:
      return False, "No such document matches query"

    for result in results: 
      result["_id"] = result["_id"]["$oid"]

    return results, ""

  def find_one(collection, query):
    result = mongo.db[collection].find_one(query)
    result = json.loads(dumps(result))

    if not result:
      return False, "No such document matches query"

    result["_id"] = result["_id"]["$oid"]
    if result["type"] == "garden":
      for plant in result["plants"]:
        plant["_id"] = plant["$oid"]
        plant.pop("$oid")

    return result, "Found document"

  def get_all_docs(collection):
    results = json.loads(dumps(mongo.db[collection].find({})))

    for result in results:
      result["_id"] = result["_id"]["$oid"]
      if result["type"] == "garden":
        for plant in result["plants"]:
          plant["_id"] = plant["$oid"]
          plant.pop("$oid")

    return results

  def delete_collection(collection):
    if not collection in mongo.db.list_collection_names():
      return False, "Collection does not exist"

    res = mongo.db.drop_collection(collection)
    if not res["ok"] == 1.0:
      return False, "Error occured while dropping collection"
    return True, "Deleted collection"

  def delete_one(collection, uuid):
    collection = mongo.db[collection]
    res = collection.delete_one({"_id": ObjectId(uuid)})
    if not res.deleted_count > 0:
      return False, "Document not deleted"
    return True, "Document deleted"

  def json_to_bson(json_f):
    json_f = json.loads(json_f)
    json_f["_id"] = ObjectId(json_f["_id"])
    return json_f
 
  def bson_to_json(bson_f):
    this = json.loads(dumps(bson_f))
    this["_id"] = this["_id"]["$oid"]
    return json.dumps(this)

  def get_oid_as_str(oid):
    return json.loads(dumps(oid))["$oid"]

  def add_plant_to_garden(plant_uuid, garden_uuid):
    resp = mongo.db["gardens"].update(
      {"_id": ObjectId(garden_uuid)},
      {"$push": {"plants": ObjectId(plant_uuid)}}
    )
    # print(resp)
    if not resp["nModified"] > 0:
      return False, "Plant not added to garden"
    return True, "Plant added to garden"

  def get_all_gardens_plants(garden_uuid):
    garden, _ = db.find_one("gardens", ObjectId(garden_uuid))
    plants = []
    for k in range(len(garden["plants"])):
      plants.append(garden["plants"][k]["$oid"])
    return plants
