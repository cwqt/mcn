from flask_restful    import Resource, reqparse

from common.db        import db
from common.auth      import token_required
from models.plant     import Plant

class Plant(Resource):
  def get(self, garden_uuid, uuid): 
    plant = db.get_plant(garden_uuid, uuid)
    return {"data": plant }, 200
    
  @token_required
  def put(self, garden_uuid, uuid):
    parser = reqparse.RequestParser()
    parser.add_argument('moisture_level', type=int, required=True)
    args = parser.parse_args()
    success = db.add_moisture_level(garden_uuid, uuid, args["moisture_level"])
    if success:
      return {"message": "Moisture level added"}, 200
    return {"message": "Not added"}, 400

  @token_required
  def delete(self, garden_uuid, uuid):
    success = db.delete_plant(garden_uuid, uuid)
    if success:
      return {"message": "Plant removed"}, 200
    return {"message": "Plant not removed"}, 400
