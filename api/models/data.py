import time
import json

from bson.objectid  import ObjectId
from bson.json_util import dumps

class Data(object):
	def __init__(self):
		self._id = ObjectId()
		self.timestamp = int(time.time())
		self.measurements = {}

	def addMeasurement(self, key, value):
		self.measurements[key] = value

	def json(self):
		this = json.loads(dumps(self.__dict__))
		this["_id"] = this["_id"]["$oid"]
		return json.dumps(this)