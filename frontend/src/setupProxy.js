const proxy = require('http-proxy-middleware')

var options = {
  target: 'http://localhost:5000/',
  pathRewrite: {
    '^/api': '/', // rewrite path
  }
};

module.exports = function(app) {
  app.use('/api', proxy(options))
}
