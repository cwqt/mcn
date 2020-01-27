#!/usr/bin/python3
import os
from flask          import Flask
from flask_restful  import Api

from settings               import app_config
from common.db              import mongo
from common.auth            import Auth, ApiKey

from resources.token        import Token
from resources.index        import Index
from resources.garden_list  import Gardens
from resources.garden       import Garden
from resources.plant_list   import Plants
from resources.plant        import Plant
from resources.measurements import Measurements
from resources.events       import Events

def create_app(config_name):
  app = Flask(__name__)
  app.config.from_object(app_config[config_name])
  mongo.init_app(app)

  api = Api(app)
  api.add_resource(Index, "/")
  api.add_resource(Auth, "/auth")
  api.add_resource(Token, "/auth/token")
  api.add_resource(ApiKey, "/auth/key")
  
  api.add_resource(Gardens, "/gardens")
  api.add_resource(Garden, "/gardens/<string:uuid>")

  api.add_resource(Plants, "/plants")
  api.add_resource(Plant, "/plants/<string:uuid>")

  api.add_resource(Measurements, "/<path:obj_type>/<string:uuid>/measurements")
  api.add_resource(Events, "/<path:obj_type>/<string:uuid>/events")

  return app