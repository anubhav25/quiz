function option(title)
{

	this.QueId=currentque.id;
	this.title=title;
	this.active=1;

}

var currentque;
var currentadmin;
var options=[];


 function getadmin()
{
if (!sessionStorage.admin)
{
sessionStorage.admin =null;
}
return JSON.parse(sessionStorage.admin);
}





function getquizid()
{
if (!sessionStorage.quizId)
{
sessionStorage.quizId =null;
}
return sessionStorage.quizId;
}


function getqueid()
{
if (!sessionStorage.queId)
{
sessionStorage.queId =null;
}
return sessionStorage.queId;
}





function getStoredOPTIONS()
{
	var id=getqueid();
if(id=="null")
{
window.location.href="addOption.html";
}
	else{
	$.get('/question/'+id,function (data) {
//console.log(data);
		if(data.length==0)
		{
			$('.empty').show();
			$('#show').hide();
		}
		else
		{
			$('.empty').hide();
			$('#show').show();
			$('#head').text(data.title);
			currentque=data;

				$.get('/options/'+id, function(data,a) {
console.log(data);

if(data.length==0)
		{
			$('.empty').show();
			$('#show').hide();

		}
		else
		{
			$('.empty').hide();
			$('#show').show();
			options=data;
			show_in_table();
		}

});
		}
	})

}
}




function storeOPTIONS(opt)
{
$.post('/addoption', opt, function (data,txt) {
console.log(data);
	if(data.msg=="added"){
		insertIntoList(data.data);
		options.push(data.data);
				$('.empty').hide();
			$('#show').show();
	}
else
	alert(data.msg);
});
}



$(document).ready(function($) {
	currentadmin=getadmin();
if(currentadmin==null)
{
	window.location.href = "login.html";
}
	var qid=getquizid();
if(qid==null)
{
	window.location.href = "CreateQuiz.html";
}

getStoredOPTIONS();
});




function show_in_table()
{

	var table=$('#table tbody');

	table.html('');
console.log(options);
	for(var i=0;i<options.length;i++)
	{


		insertIntoList(options[i]);


	}
	if(table.children().length>0)
	{
		$("#show").show();
		$('.empty').hide();
	}
	else
	{
		$("#show").hide();
		$('.empty').show();
	}
}








$("#refresh").click(function(event)
		{
			getStoredOPTIONS();
		});



$("#my").click(function(event)
		{

console.log(currentque);
							var count=options.length;
							if(count<currentque.no_of_Option)
							{
								$(this).hide();
								createInputBox();
							}
							else
								alert('max options inserted');
		});






function createInputBox()
{


			var input_data=$("#input_data");
			input_data.html('');
			input_data.show();

			input_data.append($('<p>').append($('<textarea>').attr({
										rows: '3',
										cols: '18',
										id:'title',
										placeholder:"title"

									})));



			input_data.append($('<p>').append($('<input>').attr({
										type: 'button',
										class: 'save',
										value:'save',
										id:'save'
									}).click(function() {
										saveNewData();
									})));



}




function insertIntoList(myopt)
{

							var tr =$('<tr>');
							tr.append($('<td>').text( myopt.id).hide());
							tr.append($('<td>').text( myopt.QueId));
							tr.append($('<td>').text( myopt.title));
							tr.append($('<td>').text( myopt.active).hide());

							$('#table tbody').append(tr);

}

function saveNewData()
{

					var title=$("#title").val();



						if(title=="")
						{
							alert("Enter all data");
						}
						else
						{

							var myopt=new option(title);
							var table=$('#table');
							$('#show').show();

							storeOPTIONS(myopt);

						$('#my').show()
						var input_data=$("#input_data");
						input_data.hide();
						input_data.text('');
						}


}