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
    api_key = request.headers["x-api-key"]
    token = request.headers["x-access-token"]
    
    if not token and not api_key:
      return {"message": "No token or API key provided"}, 401
      
    if api_key:
      pass

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
    password = request.headers["Auth-Password"]
    if not password:
      return {"message":"No password provided"}, 401

    if not password == app.config["AUTH_SECRET_KEY"]:
      return {"message":"Invalid password"}, 401

    # password correct, let request continue
    return f(*args, **kwargs)
  return decorator


class Auth(Resource):
  def get(self):
    if not "Auth-Password" in request.headers:
      return {"message": "No password provided"}, 401

    password = request.headers["Auth-Password"]

    if password == app.config["AUTH_SECRET_KEY"]:
      token = jwt.encode({
        "exp" : datetime.datetime.utcnow() + datetime.timedelta(minutes=120)
      }, app.config["AUTH_SECRET_KEY"], algorithm="HS512")
      return {"data": token.decode('UTF-8')}, 200

    return {"message": "Un-authorized"}, 401


class ApiKey(Resource):
  def get(self):
    if not "Auth-Password" in request.headers:
      return {"message": "No password provided"}, 401

    password = request.headers["Auth-Password"]

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





