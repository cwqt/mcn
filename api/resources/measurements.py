from flask_restful      import Resource, reqparse
from bson.objectid      import ObjectId

from common.db          import db

PAGE_SIZE = 168

class Measurements(Resource):
  def get(self, obj_type, uuid):
    if not obj_type in ["plants", "gardens"]:
      return {"message":"Invalid object type"}, 404

    success, reason = db.find_one(obj_type, {"_id":ObjectId(uuid)})
    if not success:
      return {"message":reason}, 404

    parser = reqparse.RequestParser()
    parser.add_argument("page", int)
    parser.add_argument("last", int)
    args = parser.parse_args()

    args["page"] = args["page"] or 0

    if args["last"]:
      data, reason = db.get_measurements(uuid, int(args["last"]))
      if not data:
        return {"message":reason}, 400
      return {"data": data}, 200

    if args["page"]:
      offset = PAGE_SIZE * int(args["page"])
      data, reason = db.get_measurements(uuid, PAGE_SIZE, offset)
      if not data:
        return {"reason":reason}, 400
      return {"data":data}, 200

    data, reason = db.get_measurements(uuid, PAGE_SIZE)

  def delete(self, uuid):
    pass


class MeasurementsCount(Resource):
  def get(self, obj_type, uuid):
    if not obj_type in ["plants", "gardens"]:
      return {"message":"Invalid object type"}, 404

    success, reason = db.find_one(obj_type, {"_id":ObjectId(uuid)})
    if not success:
      return {"message":reason}, 404

    return {"data": db.get_doc_count(uuid)}, 200