from flask_restful      import Resource

from common.auth        import token_required
from common.db          import db

from models.recordable 	import Recordable as Garden

class Gardens(Resource):
  def get(self):
    return {"data": db.get_all_docs("gardens")}, 200  	

  @token_required
  def post(self):
    garden = Garden(type="garden")
    data, status = garden.insert()
    return data, status
