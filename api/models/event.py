import time
import json

from bson.objectid  import ObjectId
from bson.json_util import dumps

from common.db      import db

class Event(object):
	def __init__(self):
		self._id = ObjectId()
		self.timestamp = int(time.time())
		self.event = ""

	def addEvent(self, value):
		self.event = value

	def json(self):
		return db.bson_to_json(self.__dict__)