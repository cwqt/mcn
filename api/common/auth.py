import os
import jwt
import datetime

from flask          import request, jsonify
from flask_restful  import Resource
from functools      import wraps

from flask          import current_app as app

def token_required(f):
  @wraps(f)
  def decorator(*args, **kwargs):
    token = request.headers["x-access-token"]
    if not token:
      return {"message": "No token provided"}, 401

    try:
      data = jwt.decode(token, app.config["AUTH_SECRET_KEY"], algorithms=['HS512'])
    except:
      return {"message": "Invalid token"}, 401

    return f(*args, **kwargs)
  return decorator

class Auth(Resource):
  def get(self):
    if not "Auth-Password" in request.headers:
      return {"message": "No password provided"}, 401

    password = request.headers["Auth-Password"]

    if password == app.config["AUTH_SECRET_KEY"]:
      token = jwt.encode({
        "exp" : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
      }, app.config["AUTH_SECRET_KEY"], algorithm="HS512")
      return {"data": token.decode('UTF-8')}, 200

    return {"message": "Un-authorized"}, 401
