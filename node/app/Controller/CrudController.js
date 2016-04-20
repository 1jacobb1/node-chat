var modelUser  = require('./Model/Users');

module.exports.controller = function(app) {
  app.get('/', function(req, res) {
    console.log(req);
    res.json({jacob:"jacob"});
  })

  app.post('/add', function(app) {
    console.log(app)
  })
}