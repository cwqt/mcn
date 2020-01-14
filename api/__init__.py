#!/usr/bin/python3
import os
from flask          import Flask
from flask_restful  import Api

from settings               import app_config
from common.db              import mongo
from common.auth            import Auth

from resources.token        import Token
from resources.index        import Index
from resources.gardens      import Gardens
from resources.garden       import Garden

# from resources.plant        import Plant

def create_app(config_name):
  app = Flask(__name__)
  app.config.from_object(app_config[config_name])
  mongo.init_app(app)

  api = Api(app)
  api.add_resource(Index, "/")
  api.add_resource(Auth, "/auth/")
  api.add_resource(Token, "/auth/token/")
  api.add_resource(Gardens, "/gardens/")
  api.add_resource(Garden, "/garden/<string:uuid>")

  # api.add_resource(Plant, "/gardens/<string:garden_uuid>/<string:uuid>")
  return app