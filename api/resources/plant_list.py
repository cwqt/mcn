from flask_restful      import Resource

from common.auth        import token_required
from common.db          import db

from models.recordable 	import Recordable as Plant

class Plants(Resource):
  def get(self):
    return {"data": db.get_all_docs("plants")}, 200  	

  @token_required
  def post(self):
    plant = Plant()
    data, status = plant.insert()
    return data, status
