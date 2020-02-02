import time
from flask_restful import Resource
from flask import make_response

class Time(Resource):
	def get(self):
		return make_response(str(int(round(time.time()*1000))), {'Content-Type': 'text/html'})