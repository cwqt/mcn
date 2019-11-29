from flask_restful 			import Resource

from common.auth  			import token_required
from common.db 					import db
from models.garden 			import Garden

class GardenList(Resource):
  def get(self):
    return {"data": db.get_all_collections()}, 200

  @token_required
  def post(self):
  	garden = Garden()
  	uuid, resp = garden.insert()
  	return {"message": resp['message'], "data": uuid}, resp['code']
