var seq = require('sequelize');
var conn = new seq('node_chat', 'root', '');

exports.connection = conn;

var User = conn.define('users', {
  id                : {
    type            : seq.INTEGER,
    primaryKey      : true,
    autoIncrement   : true
  },
  username          : {
    type            : seq.STRING,
  },
  password          : {
    type            : seq.STRING
  },
  status            : {
    type            : seq.BOOLEAN
  },
  profile_image     : {
    type            : seq.STRING,
  },
  gender            : {
    type            : seq.INTEGER
  },
  hometown          : {
    type            : seq.STRING
  },
  chat_id           : {
    type            : seq.STRING
  }
}, {
  createdAt         : false,
  updatedAt         : false
});

module.exports = User;