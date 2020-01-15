from flask_restful      import Resource, reqparse
from bson.objectid      import ObjectId

from common.db          import db

DEFAULT_PAGE_SIZE = 168

class Measurements(Resource):
  def get(self, obj_type, uuid):
    if not obj_type in ["plants", "gardens"]:
      return {"message":"Invalid object type"}, 404

    success, reason = db.find_one(obj_type, {"_id":ObjectId(uuid)})
    if not success:
      return {"message":reason}, 404

    parser = reqparse.RequestParser()
    parser.add_argument("limit", int)
    parser.add_argument("page", int)
    parser.add_argument("last", int)
    args = parser.parse_args()

    args["page"] = args["page"] or 0
    args["limit"] = args["limit"] or DEFAULT_PAGE_SIZE

    if args["last"]:
      data, reason = db.get_measurements(uuid, int(args["last"]))
      if not data:
        return {"message":reason}, 400
      return {"data": data}, 200

    return "hello"

  def delete(self, uuid):
    pass
