import time
import json

from bson.objectid  import ObjectId
from bson.json_util import dumps

from common.db      import db
from models.data    import Data

def generateUniqueId(_id=ObjectId()):
  _id = json.loads(dumps(_id))["$oid"]
  collections = db.get_all_collections()
  if _id in collections:
    generateUniqueId()
  else:
    return _id

ACCEPTED_MEASUREMENTS = [
  "temperature",
  "moisture",
  "humidity",
  "light",
  "water_level"
]

# gardens and plants are essentially the same
# except gardens contain an array with ObjectIds
# referring to their child plants
class Recordable(object):
  def __init__(self, *args, **kwargs):
    self._id = kwargs.get("_id") or generateUniqueId()
    self.name = kwargs.get("name") or "No name provided"
    self.image = kwargs.get("image") or "placeholder.png"
    self.created_at = int(time.time())

    self.type = kwargs.get("type") or "plant"
    if self.type == "garden":
      self.plants = []

  def delete(self):
    # remove root collection from db
    success, reason = db.delete_collection(self._id)
    if not success:
      return {"messsage": reason}, 400

    # remove self from (type)s list
    success, reason = db.delete_one(f"{self.type}s", self._id)
    if not success:
      return {"messsage": reason}, 400

    return {"message": f"{self.type.capitalize()} deleted!", "data":True}, 200

  def insert(self):
    # create root collection in db
    success, reason = db.create_collection(self._id)
    if not success:
      return {"message": reason}, 400

    # insert self into (type)s list
    success, reason = db.insert(f"{self.type}s", self.json())
    if not success:
      return {"message": reason}, 400

    return {"message": f"{self.type.capitalize()} added", "data": self._id}, 201

  def setId(self, uuid):
    setattr(self, "_id", uuid)

  def addMeasurements(self, *args, **kwargs):
    measurements = Data()
    print(kwargs)
    for measurement in kwargs.items():
      print(measurement[0], measurement[1])
      if not measurement in ACCEPTED_MEASUREMENTS:
        continue
      print(measurement)

  def json(self):
    return json.dumps(self.__dict__)





