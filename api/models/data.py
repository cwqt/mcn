import time
import json

from bson.objectid  import ObjectId
from bson.json_util import dumps

class Data(object):
	def __init__(self):
		self._id = ObjectId()
		self.timestamp = int(time.time())
		self.measurements = []

	def addMeasurement(self, key, value):
		self.measurements.append({key: value})

	def json():
		return json.dumps(self.__dict__)