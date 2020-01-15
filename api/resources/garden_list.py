from flask_restful      import Resource

from common.auth        import token_required
from common.db          import db

from models.recordable  import Recordable as Garden

class Gardens(Resource):
  def get(self):
    gardens = db.get_all_docs("gardens")
    for garden in gardens:
      if len(garden["plants"]) > 0:
        for k in range(len(garden["plants"])):
          garden["plants"][k] = garden["plants"][k]["$oid"]

    return {"data": gardens}, 200    

  @token_required
  def post(self):
    garden = Garden(type="garden")
    data, status = garden.insert()
    return data, status
