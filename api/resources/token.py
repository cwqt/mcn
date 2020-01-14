import markdown

from flask_restful  import Resource
from flask          import Response

from common.auth    import token_required

class Token(Resource):
  @token_required
  def get(self):
    return {"data":True}, 200