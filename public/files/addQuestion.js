
function que(title,no_of_Option,correctOption)
{

	this.Quizid=parseInt(currentquiz.id);
	this.title=title;
	this.correctOption=correctOption;
	this.no_of_Option=no_of_Option;
	this.active=1;

}

var currentquiz;
var currentadmin;
var ques=[];

function getadmin()
{
if (!sessionStorage.admin)
{
sessionStorage.admin =null;
}
return JSON.parse(sessionStorage.admin);
}

$(document).ready(function($) {
	currentadmin=getadmin();
if(currentadmin==null)
{
	window.location.href = "login.html";
}

getStoredQue();
});


function getquizid()
{
if (!sessionStorage.quizId)
{
sessionStorage.quizId =null;
}
return sessionStorage.quizId;
}

function storequeid(id)
{
	sessionStorage.queId=id;
}








function getStoredQue()
{
	var id=getquizid();
if(id=="null")
{
window.location.href="CreateQuiz.html";
}
	else{
	$.get('/quizzes/'+id,function (data) {

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
			currentquiz=data;

				$.get('/questions/'+id, function(data) {
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
			ques=data;
			show_in_table();
		}

});
		}
	})

}
}




function storeQue(Que)
{
$.post('/addQue', Que ,function (data,txt) {

	if(data.msg=="added"){
		insertIntoList(data.data);
		ques.push(data.data);
				$('.empty').hide();
			$('#show').show();
	}
else
	alert(data.msg);
});
}






function show_in_table()
{

var table=$('#table tbody');
table.text('');

	for(var i=0;i<ques.length;i++)
	{

		insertIntoList(ques[i]);

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
			getStoredQue();
		});



$("#my").click(function(event)
		{


							var count=ques.length;

							if(count<currentquiz.no_of_Q){
								$(this).hide();
								createInputBox();

							}

							else
								alert('max que inserted');


		});








function createInputBox()
{


			var input_data=$("#input_data");
			input_data.text('');
			input_data.show();



			input_data.append($('<p>').append($('<textarea>').attr({
										rows: '3',
										cols: '18',
										id:'title',
										placeholder:"title"

									})));

			input_data.append($('<p>')
				.append($('<input>').attr({
										type: 'number',
										id:'no_of_op',
										placeholder:"No Of OPTIONS"

									})));


			input_data.append($('<p>')
				.append($('<input>').attr({
										type: 'number',
										id:'correct_op',
										placeholder:"Correct OPTION"

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




function insertIntoList(myque)
{

							var tr =$('<tr>');
							tr.append($('<td>').text(myque.id).hide());
							tr.append($('<td>').text(myque.Quizid));
							tr.append($('<td>').text(myque.title));
							tr.append($('<td>').text(myque.no_of_Option));
							tr.append($('<td>').text(myque.correctOption));

							var input=$('<button>')
										.addClass('take_quiz_btn')
										.attr('id', 'addopt')
										.text("ADD OPTION");
							tr.append($('<td>').append(input));
							input.click(function(event) {
							var mytr=$(this).parent().parent();
							var index=mytr.children().eq(0).text();
							storequeid(index);
							window.location.href='addOption.html';
							});
							tr.append($('<td>').text(myque.active).hide());



							var table=$('#table tbody');

							table.append(tr);

}

function saveNewData()
{
					var title=$("#title").val();
					var no_op=$("#no_of_op").val();
					var c_op=$("#correct_op").val();



						if(title==""||no_op==""||c_op==""||no_op<0||c_op<0||c_op>no_op)
						{
							alert("Enter valid data");
						}
						else
						{

							var myque=new que(title,no_op,c_op);
							$('#show').show();


							storeQue(myque);

						$('#my').show()
						var input_data=$("#input_data");
						input_data.hide();
						input_data.text('');
						}




}
