module.exports = function(con) {
  
  // var sql = require('mysql');
  // var connection = sql.createConnection({
  //   host: 'localhost',
  //   user: 'root',
  //   password: '',
  //   database: 'node_chat'
  // })
  
  Q = {};

  con.connect(function(err) {
    if (!err) console.log("Connected to DB");
    else console.log("Not Connected to DB");
  });

  Q.insert = function(data) {
    console.log(data);
    con.query("INSERT INTO `users` SET ?", data, function(error, result) {
    })
  };

  return Q;

};