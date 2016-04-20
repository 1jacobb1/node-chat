var express       = require('express');
var app           = express();
var mysql         = require('mysql');
var http          = require('http').Server(app);
var io            = require('socket.io')(http);
var router        = express.Router();
var bodyParser    = require('body-parser');
var port          = "8081";
var fs            = require('fs');
var seq           = require('sequelize');
var ejs           = require('ejs');

// establish connection
var conn = new seq('node_chat', 'root', '');

var modelUser     = require('./app/Model/Users');

app.set('views', __dirname + '\\app\\View\\');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/app/public'));

/*fs.readdirSync('./app/Controller').forEach(function(file) {
  if(file.substr(-3) == "ejs") {
    route = require('./app/Controller/'+file);
    route.controller(app);
    console.log(app);
  }
})*/

app.get('/', function(req,res) {
  var userTable = [];
  modelUser.findAll({where: {status : 1}}).then(function(users) {
    res.render('Crud/index', {users:users});
  })
});

app.post('/add', function(req,res) {
  if (req.body.username && req.body.password) {
    modelUser.create(req.body).then(function(user) {
      res.send(user);
    })
  }
})

io.on('connection', function(socket) {
  socket.on('add_user', function(data) {
    io.emit('display_new_user', data);
  })

  // saves new user
  socket.on('send_message', function(data) {
    // insert new user in table
    modelUser.create(data).then(function(results) {  
      // broadcast the newly saved user
      io.emit('showUser', results);
      console.log(results);
    });
  })

  // update user status
  socket.on("delete_user", function(data) {
    // removes the user in ui
    io.emit("remove_user", data);
    // update the user from the table
    modelUser.update({status: 0}, {where: {id: data.id}})
  });

  // update user info
  socket.on('update_user', function(data) {
    // updates the user info from the table
    modelUser.update(data, {where: {id:data.id}})
    // broadcast the newly update user
    io.emit('show_updated_user', data);
  })

  socket.on('show_all_user', function(data) {
    modelUser.findAll({where: {status:1}}).then(function(results) {
      io.emit('return_all_users', results);
    }).catch(function(err) {
    })
  })

});

http.listen(port, function() {
  console.log("Listening spotify: "+port);
})