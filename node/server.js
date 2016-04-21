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
// configure the directory
app.use(express.static('public'));
app.use(express.static('public/uploads'));
app.use(express.static(__dirname + '/app/node_modules/bootstrap')); 
// configure session in express
app.use(session({
  cookieName: 'session',
  secret: 'jacob',
  duration: 86400,
  activeDuration: 86400
}));

function hasLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

app.get('*', function(req,res,next) {
  console.log(req.url);
  next();
})

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
})

app.get('/', function(req, res) {
  if (req.session.user) {
    res.redirect('/home');
  }else {
    res.render('Home/login');
  }
})

app.post('/login', function(req, res) {
  modelUser.findOne({ where: {username: req.body.username, password: req.body.password}}).then(function(user,err) {
    if(user) {
      req.session.user = user.dataValues;
      res.redirect('/home');
    }else{
      res.redirect('/');
    }
  });
});

app.get('/home', hasLogin, function(req,res) {
  var userTable = [];
  modelUser.findAll({where: {status : 1}}).then(function(users) {
    res.render('Home/index', {users:users});
  });
});

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

  socket.on('send_message', function(data) {
    modelUser.create(data).then(function(results) {  
      io.emit('showUser', results);
    });
  })

  //uploading profile image
  ss(socket).on('profile_image', function(stream, data) {
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream('./public/uploads/'+filename));
    socket.emit('broadcastImage', {image: filename});
  })

  socket.on("delete_user", function(data) {
    io.emit("remove_user", data);
    modelUser.update({status: 0}, {where: {id: data.id}})
  });

  socket.on('update_user', function(data) {
    modelUser.update(data, {where: {id:data.id}})
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