import os

class Config(object):
    DEBUG = False
    CSRF_ENABLED = True
    AUTH_SECRET_KEY = os.environ.get('AUTH_SECRET_KEY')
    MONGO_URI = os.environ.get('MONGO_URI')

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    AUTH_SECRET_KEY = "hello_world"
    MONGO_URI = "mongodb://localhost:58000/db"

class StagingConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

app_config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'staging': StagingConfig,
    'production': ProductionConfig,
}