import uuid
import datetime

from common.db import db
 
class Garden(object):
  def __init__(self, name=None, description=None):
    self.name = name or "Place-holder garden"
    self.description = description or "Place-holder description"
    self.created_at = datetime.datetime.utcnow()
    self.plants = []

  def insert(self):
    identifier = str(uuid.uuid1())
    gardens = db.get_all_collections()
    if not identifier in gardens:
      db.create_collection(identifier)
      db.insert(identifier, self.json())
      return identifier, {"message": "Garden created", "code": 200}

    return None, {"message": "Garden already exists", "code": 401}

  def json(self):
    return {
      '_id': "root",
      'name': self.name,
      'description': self.description,
      'created_at': self.created_at,
      'plants': self.plants
    }