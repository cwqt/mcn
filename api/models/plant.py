import uuid
import datetime

from bson.objectid  import ObjectId

from common.db      import db

class Plant(object):
  def __init__(self, name=None, description=None, url=None):
    self.name = name or "Place-holder"
    self.description = description or "Place-holder"
    self.image_url = url or "https://placehold.it/400x400"
    self.created_at = datetime.datetime.utcnow()
    self.moisture_levels = {}
    self._id = ObjectId()

  def insert(self, garden):
    gardens = db.get_all_collections()
    if garden in gardens:
      db.insert(garden, self.json())
      success = db.add_plant_to_garden(garden, self._id)
      if success:
        return str(self._id), {"message": "Plant added", "code": 200}
    return None, {"message": "Not added", "code": 400}

  def json(self):
    return {
      '_id': self._id,
      'name': self.name,
      'description': self.description,
      'image_url': self.image_url,
      'created_at': self.created_at,
      'moisture_levels': self.moisture_levels,
    }