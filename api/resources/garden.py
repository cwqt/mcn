import json

from bson.json_util   import dumps
from flask_restful    import Resource

from models.plant     import Plant
from common.db        import db
from common.auth      import token_required

class Garden(Resource):
  def get(self, uuid):
    garden = db.find_one(uuid, {"_id": "root"})
    for i in range(len(garden["plants"])):
      garden["plants"][i] = garden["plants"][i]["$oid"]

    if not garden:
      return {"message": "No such garden"}, 404
    return {"data": garden}, 200

  @token_required
  def post(self, uuid):
    plant = Plant()
    uuid, resp = plant.insert(uuid)
    return {"message": resp["message"], "data": uuid}, resp["code"]

  @token_required
  def delete(self, uuid):
    success = db.delete_collection(uuid)
    if success:
      return {"message": "Garden removed"}, 200
    return {"message": "Garden not removed"}, 400
