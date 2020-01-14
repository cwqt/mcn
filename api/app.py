import os
from __init__ import create_app

config_name = os.environ.get('APP_SETTINGS')
app = create_app(config_name)

if __name__ == '__main__':
  app.run(debug=True)