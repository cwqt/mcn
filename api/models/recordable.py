import time
import json

from bson.objectid  import ObjectId
from bson.json_util import dumps

from common.db      import db

def generateUniqueId(_id=ObjectId()):
  _id = json.loads(dumps(_id))["$oid"]
  collections = db.get_all_collections()
  if _id in collections:
    generateUniqueId()
  else:
    return _id

class Recordable(object):
  def __init__(self, *args, **kwargs):
    self._id = generateUniqueId()
    self.name = kwargs.get("name") or "No name provided"
    self.image = kwargs.get("image") or "placeholder.png"
    self.created_at = int(time.time())

  def delete(self):
    success = db.delete_collection(self._id)
    return success

  def insert(self):
    success = db.create_collection(self._id)
    return success

  def json(self):
    return json.dumps(self.__dict__)

  #     db.insert(garden, self.json())
  #     success = db.add_plant_to_garden(garden, self._id)
  #     if success:
  #       return str(self._id), {"message": "Plant added", "code": 200}
  #   return None, {"message": "Not added", "code": 400}

  # def delete(self)

