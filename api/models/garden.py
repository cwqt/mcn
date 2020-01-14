from models.recordable import Recordable

from common.db import db

class Garden(Recordable):
	def __init__(self, *args, **kwargs):
		super().__init__(self, *args, **kwargs)
		self.plants = []

	def delete(self):
		# remove root collection
		success = super(Garden, self).delete()
		if not success:
			return {"messsage": "Not deleted (recordable)"}, 400

		# remove self from gardens list
		success = db.delete_one("gardens", self._id)
		if not success:
			return {"messsage": "Not deleted (garden)"}, 400

		return {"message": "Garden deleted!", "data":True}, 200

	def insert(self):
		#create a root object in db
		success = super(Garden, self).insert()
		if not success:
			return {"message": "Not added (recordable)"}, 400

		# add self to the list of gardens
		success = db.insert("gardens", self.json())
		if not success:
			return {"message": "Not added (garden)"}, 400

		return {"message": f"{self._id} added", "data": self._id}, 201