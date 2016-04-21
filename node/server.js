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
var ss            = require('socket.io-stream');
var path          = require('path');
var passport      = require('passport');
var session       = require('client-sessions');

// load user defined modules
var modelUser     = require('./app/Model/Users');
var fileHandler   = require('./fileHandler');

var conn = new seq('node_chat', 'root', '');

// configure express
app.set('views', __dirname + '\\app\\View\\');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.static('public/uploads'));
app.use(express.static(__dirname + '/app/node_modules/bootstrap')); 
app.use(session({
  cookieName: 'session',
  secret: 'jacob',
  duration: 86400,
  activeDuration: 86400
}));

app.get('/home', function(req,res) {
  var userTable = [];
  modelUser.findAll({where: {status : 1}}).then(function(users) {
    res.render('Home/index', {users:users});
  })
});

function hasSession(req, res, next) {
  console.log(req.session);
  next();
}

app.get('/',  function(req, res) {
  res.render('Home/login');
})

app.post('/login', function(req, res) {
  console.log(req.body);
  modelUser.findOne(req.body, function(err, user) {
    if(!user) {
      res.send('Invalid username or password');
    } else {
      res.send('redirect to home page..');
    }
  })
  /*if (req.body.username && req.body.password) {
    req.session = req.body.user;
    console.log(req.session);
    res.redirect('/home');
  } else {
    res.redirect('/');
  }*/
})

app.get('/profile', function(req,res) {
  res.writeHead(200, {"Context-Type" : "text/html"});
  res.write("Here's some data dude!");
  res.write("<img src='black.jpg'/>");
  res.end();
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

  //uploading profile image
  ss(socket).on('profile_image', function(stream, data) {
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream('./public/uploads/'+filename));
    socket.emit('broadcastImage', {image: filename});
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
    })
  })

});

http.listen(port, function(req) {
  console.log("Listening spotify: "+port);
})