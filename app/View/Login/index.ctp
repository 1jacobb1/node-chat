<h1><?php echo strtoupper("this is home/index page"); ?></h1>
<div>
  Current Users
  <div id="current_users">
    <table id="current_userss">
    	<thead>
    		<th>ID</th>
    		<th>USERNAME</th>
    		<th>PASSWORD</th>
    		<th>ACTION</th>
    	</thead>
    	<tbody id="table-user">
    	</tbody>
    </table>
  </div>
</div>
<br>
<br>
<input type="text" id="username" placeholder="Username"/>
<input type="password" id="password" placeholder="Password"/>
<button type="submit" id="btn-add-user">Add</button>
<script type="text/javascript">
  var data, username, password;
  $(document).ready(function() {
    $('#btn-add-user').click(function(e) {
      username = $.trim($('#username').val());
      password = $.trim($('#password').val());
      if (username && password) {
        data = {
          username: username,
          password: password
        }
        Connect.sendMessage(data);
      }
      e.preventDefault;
    })
    getAllUsers();
  })
  function _edit(id) {
  	var uname = $.trim($('#username-'+id).text());
  	alert(uname);
  	var inputUsername = "<input type='text' id='edit-username-"+id+"' placeholder='username'>";
  	var inputPassword = "<input type='password' id='edit-password-"+id+"' placeholder='password'>";
    // var cancelButton = '<button onclick="_cancel('+id+',"'+uname+'");" id="cancel-'+id+'"></button>';
  	var cancelButton = "<button id='cancel-"+id+"' onclick='_cancel("+id+","+uname+");'>cancel</button>";
  	// "<button onclick='_cancel(id, '"++"  '> </button>";
  	var actionButton = "<button onclick='_update("+id+");' id='update-"+id+"'>update</button> | "+cancelButton;
  	$('#username-'+id).html(inputUsername);
  	$('#password-'+id).html(inputPassword);
  	$('#action-'+id).html(actionButton);
  	console.log(cancelButton);
  }

  function _delete(id) {
  	data = {
  		id: id
  	};
  	Connect.deleteUser(data);
  }

  function _cancel(id, username) {
  	// alert(username);
    alert(username);
  	alert(id);
  	var uname = $('#username-'+id).text();
  	var password = $('#password-'+id).text();
   	var tdActionButton = "<button onclick='_edit("+id+");' id='edit-"+id+"'>edit</button> | <button onclick='_delete("+id+");' id='delete-"+id+"'>delete</button>";
  	$('#username-'+id).html(uname.toString());
  	$('#password-'+id).html('********');
  	$('#action-'+id).html(tdActionButton);
  }

  function _update(id) {
  	var uname = $.trim($('#edit-username-'+id).val());
  	var password = $.trim($('#edit-password-'+id).val());
  	if (uname && password) {
  		Connect.updateUser({id:id,username:uname,password:password});
  	}
  }

  function getAllUsers() {
  	Connect.getAllUser();
  }
</script>