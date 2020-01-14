import json

from bson.json_util   import dumps
from flask_restful    import Resource

from models.plant     import Plant

from common.db        import db
from common.auth      import token_required

from models.garden    import Garden as Garden_Obj
from models.data      import Data

from bson.objectid  import ObjectId

class Garden(Resource):
  def get(self, uuid):
    garden = db.find_one("gardens", {"_id": ObjectId(uuid)})    
    if not garden:
      return {"message": "No such garden"}, 404      
    return {"data":garden}, 200

  @token_required
  def put(self, uuid):
    return "hello"

  @token_required
  def delete(self, uuid):
    # use the model to delete object
    garden = Garden_Obj()
    setattr(garden, "_id", uuid)
    data, status = garden.delete()
    return data, status