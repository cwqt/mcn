import json

from flask_restful      import Resource
from bson.json_util     import dumps
from bson.objectid      import ObjectId

from common.db          import db
from common.auth        import token_required
from models.recordable  import Recordable as GardenObj


class Garden(Resource):
  def get(self, uuid):
    data, reason = db.find_one("gardens", {"_id": ObjectId(uuid)})    
    if not data:
      return {"message": reason}, 404      
    return {"data": data}, 200

  @token_required
  def put(self, uuid):
    garden = GardenObj(_id=uuid, type="garden")
    garden.addMeasurements(moisture=300, x="hello")

  @token_required
  def delete(self, uuid):
    # use the model to delete object
    garden = GardenObj(_id=uuid, type="garden")
    data, status = garden.delete()
    return data, status
