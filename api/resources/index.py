import markdown

from flask_restful  import Resource
from flask          import Response

from common.db      import db
from bson.objectid  import ObjectId
from common.auth    import password_required


class Index(Resource):
  def get(self):
    with open("README.md", "r") as markdown_file:
      content = markdown_file.read()
      resp = Response(markdown.markdown(content) , mimetype='text/html')
      return resp

  @password_required
  def delete(self):
    collections = db.get_all_collections()
    for collection in collections:
      db.delete_collection(collection)

  @password_required
  def post(self):
    db.create_collection("gardens")
    db.create_collection("plants")