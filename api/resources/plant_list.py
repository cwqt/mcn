from flask_restful      import Resource, reqparse

from common.auth        import token_required
from common.db          import db

from models.recordable  import Recordable as Plant

class Plants(Resource):
  def get(self):
    return {"data": db.get_all_docs("plants")}, 200   

  @token_required
  def post(self):
    parser = reqparse.RequestParser()
    parser.add_argument('garden')
    args = parser.parse_args()

    plant = Plant()
    plant_id = db.get_oid_as_str(plant._id)
    
    # add plant to garden plants array
    if args["garden"]:
      gardenExists = False
      gardens = db.get_all_docs("gardens")
      for garden in gardens:
        if garden["_id"] == args["garden"]:
          gardenExists = True
          break

      if not gardenExists:
        return {"message": "Garden does not exist"}, 404

      success, reason = db.add_plant_to_garden(plant_id, args["garden"])
      if not success:
        return {"message": reason}, 400

    success, reason = plant.insert()
    if not success:
      return {"message": reason}, 400

    return {"data": plant_id}, 200