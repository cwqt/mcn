import json
import time

from flask_pymongo  import PyMongo
from bson.json_util import dumps
from bson.objectid  import ObjectId

mongo = PyMongo()


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
    data = json.loads(data)
    data["_id"] = ObjectId(data["_id"])
    res = mongo.db[collection].insert_one(data)
    return res.acknowledged, "Inserted data"

  def find_one(collection, query):
    result = mongo.db[collection].find_one(query)
    result = json.loads(dumps(result))

    if not result:
      return False, "No such document matches query"

    if type(result["_id"]) == dict:
      result["_id"] = result["_id"]["$oid"]
    return json.loads(dumps(result)), "Found document"

  def get_all_docs(collection):
    result = []
    for doc in json.loads(dumps(mongo.db[collection].find({}))):
      doc["_id"] = doc["_id"]["$oid"]
      result.append(doc)
    return result

  def delete_collection(collection):
    if not collection in mongo.db.list_collection_names():
      return False, "Collection does not exist"

    res = mongo.db.drop_collection(collection)
    if res["ok"] == 0.0:
      return False, "Error occured while dropping collection"
    return True, "Deleted collection"

  def delete_one(collection, uuid):
    collection = mongo.db[collection]
    res = collection.delete_one({"_id": ObjectId(uuid)})
    if not res.deleted_count > 0:
      return False, "Document not deleted"
    return True, "Doucment deleted"

    # resp = collection.update(
    #   {"_id": "root"},
    #   {"$pull": {"plants": ObjectId(uuid)}}
    # )
    # if resp["nModified"] == 1:
    #   resp = collection.remove({"_id": ObjectId(uuid)})
    #   print(resp)
    #   return True if resp["n"] == 1 else False 
    # return False
