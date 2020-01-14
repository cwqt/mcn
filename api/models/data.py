import time
import json

from bson.objectid  import ObjectId
from bson.json_util import dumps

ACCEPTED_MEASUREMENTS = [
	"temperature",
	"moisture",
	"humidity",
	"light",
	"water_level"
]

class Data(object):
	def __init__(self):
		self._id = ObjectId()
		self.timestamp = int(time.time())
		self.measurements = []

	def addMeasurement(self, key, value):
		if not key in ACCEPTED_MEASUREMENTS:
			return False

		self.measurements.append({key: value})
		return True

	def json():
		return json.dumps(self.__dict__)