# http://api.hydroponics.cass.si/.well-known/acme-challenge/Oa-mvfItbs3V9fXp9fXTyBsj5hGgqoB_05OzmZi215o
from flask_restful import Resource
from flask import make_response

class LetsEncrypt(Resource):
	def get(self):
		return make_response("Oa-mvfItbs3V9fXp9fXTyBsj5hGgqoB_05OzmZi215o.c55tRY8yZN3w9Wtmau7tDhTYGDg2sV2oaUz15Tji5tc", {'Content-Type': 'text/html'})