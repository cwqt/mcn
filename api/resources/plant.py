import json

from flask_restful      import Resource
from bson.json_util     import dumps
from bson.objectid      import ObjectId

from common.db          import db
from common.auth        import token_required
from models.recordable  import Recordable as PlantObj


class Plant(Resource):
  def get(self, uuid):
    data, reason = db.find_one("plants", {"_id": ObjectId(uuid)})    
    if not data:
      return {"message": reason}, 404      
    return {"data": data}, 200

  @token_required
  def put(self, uuid):
    plant = PlantObj(_id=uuid)
    plant.addMeasurements(moisture=300, x="hello")

  @token_required
  def delete(self, uuid):
    # use the model to delete object
    plant = PlantObj(_id=uuid)
    data, status = plant.delete()
    return data, status
