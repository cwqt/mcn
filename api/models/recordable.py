import time
import json

from bson.objectid  import ObjectId
from bson.json_util import dumps

from common.measurements  import ACCEPTED_MEASUREMENTS
from common.db            import db
from models.data          import Data


def generateUniqueId(_id=ObjectId()):
  _id = json.loads(dumps(_id))["$oid"]
  collections = db.get_all_collections()
  if _id in collections:
    generateUniqueId()
  else:
    return _id

# gardens and plants are essentially the same
# except gardens contain an array with ObjectIds
# referring to their child plants
class Recordable(object):
  def __init__(self, *args, **kwargs):
    self._id = ObjectId(kwargs.get("_id")) or generateUniqueId()
    self.name = kwargs.get("name") or "No name provided"
    self.image = kwargs.get("image") or "placeholder.png"
    self.created_at = int(time.time())

    self.type = kwargs.get("type") or "plant"
    if self.type == "garden":
      self.plants = []

  def delete(self):
    # delete all child plants
    extra_hack_string = ""
    if self.type == "garden":
      # grab ourselves from the database
      garden_plants = db.get_all_gardens_plants(db.get_oid_as_str(self._id))
      for k in range(len(garden_plants)):
        plant = Recordable(_id=garden_plants[k])
        plant.delete()
      extra_hack_string = " and " + str(len(garden_plants)) + " plant(s)"

    # remove root collection from db
    success, reason = db.delete_collection(db.get_oid_as_str(self._id))
    if not success:
      return {"messsage": reason}, 400      

    # remove self from (type)s list
    success, reason = db.delete_one(f"{self.type}s", self._id)
    if not success:
      return {"messsage": reason}, 400

    return {"message": f"{self.type.capitalize() + extra_hack_string} deleted!", "data":True}, 200

  def insert(self):
    # create root collection in db
    success, reason = db.create_collection(db.get_oid_as_str(self._id))
    if not success:
      return {"message": reason}, 400

    # insert self into (type)s list
    success, reason = db.insert_one(f"{self.type}s", self.json())
    if not success:
      return {"message": reason}, 400

    return {"message": f"{self.type.capitalize()} added", "data": db.get_oid_as_str(self._id)}, 201

  def setId(self, uuid):
    setattr(self, "_id", uuid)

  def addMeasurements(self, *args, **kwargs):
    measurements = Data()
    count = 0
    args = args[0]
    for measurement in args.keys():
      measurements.addMeasurement(measurement, args[measurement])
      count = count + 1

    if count == 0:
      return False, count

    return db.insert_one(db.get_oid_as_str(self._id), measurements.json()), count

  def json(self):
    return db.bson_to_json(self.__dict__)





