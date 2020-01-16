import markdown

from flask_restful  import Resource
from flask          import Response

from common.db      import db
from bson.objectid  import ObjectId
from common.auth    import password_required


class Index(Resource):
  def get(self):
    # get all plants and gardens
    # do not include plants that are children of gardens
    plants_list = db.get_all_docs("plants")
    gardens_list = db.get_all_docs("gardens")

    # search through all gardens
    # see if any plant in gardens plants matches
    # one that exists in plants_list,
    # if so, it's a child of the garden, and we shouldn't display it
    for garden in gardens_list:
      for plant_item in garden["plants"]:
        for plant in plants_list:
          if plant_item["_id"] == plant["_id"]:
            plants_list.remove(plant)

    return {"data": gardens_list+plants_list}, 200

  # def get(self):
  #   with open("README.md", "r") as markdown_file:
  #     content = markdown_file.read()
  #     resp = Response(markdown.markdown(content) , mimetype='text/html')
  #     return resp

  @password_required
  def delete(self):
    collections = db.get_all_collections()
    for collection in collections:
      db.delete_collection(collection)

  @password_required
  def post(self):
    db.create_collection("gardens")
    db.create_collection("plants")
