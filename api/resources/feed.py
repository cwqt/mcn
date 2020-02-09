from flask_restful      import Resource, reqparse
from bson.objectid      import ObjectId
# from pydrive            import pydrive

from common.db          import db

class Feed(Resource):
  def get(self, obj_type, uuid):
    if not obj_type in ["plants", "gardens"]:
      return {"message":"Invalid object type"}, 404

    success, reason = db.find_one(obj_type, {"_id":ObjectId(uuid)})
    if not success:
      return {"message":reason}, 404
    return {}

