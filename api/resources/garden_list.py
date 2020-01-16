from flask_restful      import Resource, reqparse
import validators

from common.auth        import token_required
from common.db          import db
from models.recordable  import Recordable as Garden

class Gardens(Resource):
  def get(self):
    gardens = db.get_all_docs("gardens")
    # for garden in gardens:
    #   if len(garden["plants"]) > 0:
    #     for k in range(len(garden["plants"])):
    #       garden["plants"][k] = garden["plants"][k]["$oid"]

    return {"data": gardens}, 200    

  @token_required
  def post(self):
    parser = reqparse.RequestParser()
    parser.add_argument("name", type=str)
    parser.add_argument("image", type=str)
    args = parser.parse_args()

    if args["image"]:
      if not validators.url(args["image"]):
        return {"message":"Invalid image URL format"}, 400

    garden = Garden(type="garden", name=args["name"], image=args["image"])
    data, status = garden.insert()
    return data, status
