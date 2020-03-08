import os
import jwt
import datetime
import time
import json
from flask          import request, redirect
from flask_restful  import Resource, reqparse
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
        return {"message": "Invalid API key"}, 404

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
      d = datetime.datetime.utcnow()
      token = jwt.encode({
        "exp" : d + datetime.timedelta(minutes=120)
      }, app.config["AUTH_SECRET_KEY"], algorithm="HS512")
      
      return {
        "data": token.decode('UTF-8'),
        "created_at": int(time.mktime(d.timetuple()))
      }, 200

    return {"message": "Un-authorized"}, 401


class ApiKeyList(Resource):
  @token_required
  def get(self):
    data = db.get_all_docs("keys")
    for key in data:
      del key["key"]
    return {"data":data}, 200

  @password_required
  def post(self):
    parser = reqparse.RequestParser()
    parser.add_argument("for", type=str, required=True)
    args = parser.parse_args()

    token = jwt.encode({}, app.config["AUTH_SECRET_KEY"], algorithm="HS512")
    document = db.bson_to_json({
      "_id": ObjectId(),
      "key": token.decode('UTF-8'),
      "for": args["for"],
      "created_at": int(time.mktime(datetime.datetime.utcnow().timetuple()))
    })

    db.insert_one("keys", document)
    return {"data": json.loads(document)}, 200

class ApiKey(Resource):
  @token_required
  def delete(self, uuid):
    success, reason = db.delete_one("keys", uuid)
    if not success:
      return {"message":reason}, 400

    return {"data":True}, 200




