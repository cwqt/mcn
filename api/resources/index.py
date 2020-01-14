import markdown

from flask_restful 	import Resource
from flask 					import Response

class Index(Resource):
  def get(self):
    with open("README.md", "r") as markdown_file:
      content = markdown_file.read()
      resp = Response(markdown.markdown(content) , mimetype='text/html')
      return resp