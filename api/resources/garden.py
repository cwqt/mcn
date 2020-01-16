import json

from flask_restful      import Resource, reqparse
from bson.json_util     import dumps
from bson.objectid      import ObjectId

from common.db            import db
from common.auth          import token_required
from common.measurements  import ACCEPTED_MEASUREMENTS
from models.recordable    import Recordable as GardenObj


class Garden(Resource):
  def get(self, uuid):
    data, reason = db.find_one("gardens", {"_id": ObjectId(uuid)})    
    if not data:
      return {"message": reason}, 404      
    return {"data": data}, 200

  @token_required
  def put(self, uuid):
    parser = reqparse.RequestParser()
    for typedef in ACCEPTED_MEASUREMENTS:
      parser.add_argument(typedef[0], type=typedef[1])
    args = parser.parse_args()

    garden = GardenObj(_id=uuid, type="garden")
    success, amount_added = garden.addMeasurements(args)
    if not success:
      return {"message":"Measurements not added"}, 400
    return {"message": f"{amount_added} measurement(s) added", "data": True}, 200

  @token_required
  def delete(self, uuid):
    # use the model to delete object
    garden = GardenObj(_id=uuid, type="garden")
    data, status = garden.delete()
    return data, status
