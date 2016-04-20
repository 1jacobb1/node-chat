var Connect = (function() {

  // emit - sends to server
  // on   - receives data from server

  var c = {};
  var myServer = "http://127.0.0.1:8081";
  var server = myServer;
  var socket = io.connect(server);
  var Evts = {};
  var count = 0;

  c.sendMessage = function(data) {
    socket.emit('send_message',data);
  }

  c.deleteUser = function(data) {
    socket.emit("delete_user", data);
  }

  c.updateUser = function(data) {
    socket.emit('update_user', data);
  }

  c.getAllUser = function(data) {
    socket.emit('show_all_user', {});
  }

  Evts.showUser = function(data) {
    var tdUsername = "<td id='username-"+data.id+"'>"+data.username+"</td>";
    var tdPassword = "<td id='password-"+data.id+"'>********</td>";
    var tdActionButton = "<td id='action-"+data.id+"'><button onclick='_edit("+data.id+");' id='edit-"+data.id+"'>edit</button> | <button onclick='_delete("+data.id+");' id='delete-"+data.id+"'>delete</button></td>";
    var hiddenInput = "<input type='text' id='in-username-"+data.id+"' value='"+data.username+"'><input type='text' id='in-password-"+data.id+"' value='"+data.password+"'>";
    $('#current_userss > tbody:last-child').append("<tr>"+hiddenInput+"<td> </td>"+tdUsername+tdPassword+tdActionButton+"</tr>");
  }

  Evts.remove_user = function(data) {
    $('#delete-'+data.id).parent().parent().remove();
  }

  Evts.show_updated_user = function(data) {
    $('#username-'+data.id).html(data.username);
    $('#password-'+data.id).html('********');
    var tdActionButton = "<button onclick='_edit("+data.id+");' id='edit-"+data.id+"'>edit</button> | <button onclick='_delete("+data.id+");' id='delete-"+data.id+"'>delete</button>";
    $('#action-'+data.id).html(tdActionButton);
  }

  Evts.return_all_users = function(data) {
    $('#current_userss > tbody').html('');
    for (var i = 0; i<data.length; i++) {
      var tdUsername = "<td id='username-"+data[i].id+"'>"+data[i].username+"</td>";
      var tdPassword = "<td id='password-"+data[i].id+"'>********</td>";
      var tdActionButton = "<td id='action-"+data[i].id+"'><button onclick='_edit("+data[i].id+");' id='edit-"+data[i].id+"'>edit</button> | <button onclick='_delete("+data[i].id+");' id='delete-"+data[i].id+"'>delete</button></td>";
      var hiddenInput = "<input type='text' id='in-username-"+data[i].id+"' value='"+data[i].username+"'><input type='text' id='in-password-"+data[i].id+"' value='"+data[i].password+"'>";
      $('#current_userss > tbody:last-child').append("<tr>"+hiddenInput+"<td> </td>"+tdUsername+tdPassword+tdActionButton+"</tr>");
    }
  }

  $(function(){
    for(var i in Evts){
      (function(e){
        socket.on(e, function(data) {
          Evts[e](data);
        });
      })(i);
    }
  });

  return c;
})();