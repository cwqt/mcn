import os
import jwt
import datetime
import json

from flask          import request, redirect
from flask_restful  import Resource
from functools      import wraps
from bson.objectid  import ObjectId

from flask          import current_app as app

from common.db      import db

def token_required(f):
  @wraps(f)
  def decorator(*args, **kwargs):    
    token = request.headers.get("x-access-token")
    api_key = request.headers.get("x-api-key")

    if token == None and api_key == None:
      return {"message": "No token or API key provided"}, 401      

    if api_key:
      result, reason = db.find_one("keys", {"key":api_key})
      if not result:
        return {"message": "API key not found"}, 404

    if token:
      try:
        data = jwt.decode(token, app.config["AUTH_SECRET_KEY"], algorithms=['HS512'])
      except:
        return {"message": "Invalid token"}, 401

    return f(*args, **kwargs)
  return decorator

def password_required(f):
  @wraps(f)
  def decorator(*args, **kwargs):
    password = request.headers.get("Auth-Password")
    if not password:
      return {"message":"No password provided"}, 401

    if not password == app.config["AUTH_SECRET_KEY"]:
      return {"message":"Invalid password"}, 401

    # password correct, let request continue
    return f(*args, **kwargs)
  return decorator


class Auth(Resource):
  def get(self):
    password = request.headers.get("Auth-Password")
    if not password:
      return {"message":"No password provided"}, 401

    if password == app.config["AUTH_SECRET_KEY"]:
      token = jwt.encode({
        "exp" : datetime.datetime.utcnow() + datetime.timedelta(minutes=120)
      }, app.config["AUTH_SECRET_KEY"], algorithm="HS512")
      return {"data": token.decode('UTF-8')}, 200

    return {"message": "Un-authorized"}, 401


class ApiKey(Resource):
  def get(self):
    password = request.headers.get("Auth-Password")
    if not password:
      return {"message":"No password provided"}, 401

    if password == app.config["AUTH_SECRET_KEY"]:
      token = jwt.encode({}, app.config["AUTH_SECRET_KEY"], algorithm="HS512")

      db.insert_one("keys", db.bson_to_json({
        "_id": ObjectId(),
        "key": token.decode('UTF-8')
      }))

      return {"data": token.decode('UTF-8')}, 200
    return {"message": "Un-authorized"}, 401

  # @token_required
  # def delete(self):





