function getadmin()
{
if (!sessionStorage.admin)
{
sessionStorage.admin =null;
}
return JSON.parse(sessionStorage.admin);
}


function storeadmin(myadmin)
{
sessionStorage.admin = JSON.stringify(myadmin);
}


var login=$('<div class="login">');

login.append($('<p>').append($('<input type="text" id="loginusername" placeholder="UserName">')));
login.append($('<p>').append($('<input type="password" id="loginpassword" placeholder="Password">')));
login.append($('<p>').append($('<button class="admin_login_btn" id="loginbtn">').text("login")));


$('#boxes').append(login);


var current_admin=null;
$("#loginbtn").click(function()
	{

		var a=new Object();
		a.username=document.getElementById('loginusername').value;
		a.password=document.getElementById('loginpassword').value;


		$.post('/login',a,function (data) {
			console.log(data)
			if(data.msg=="ok")
			{
				current_admin=new admin('ANUBHAV');
				storeadmin(current_admin);
				window.location.href = "CreateQuiz.html";
			}
			else
			{
				alert(data.msg);
			}
		});
	});
function admin(name) {
	this.name=name;
	
}