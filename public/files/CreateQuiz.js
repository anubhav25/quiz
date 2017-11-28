
function quiz(title,desc,Time_BASED,Time_Allowed,no_of_Q)
{

	this.title=title;
	this.desc=desc;
	this.addedBy=currentadmin.name;
	this.Time_BASED=Time_BASED;
	this.Time_Allowed=Time_Allowed;
	this.AddedDate=new Date();
	this.no_of_Q=no_of_Q;
	this.active=1;

}



var quizs=[];
var currentadmin;

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

function storequizid(id)
{
	sessionStorage.quizId=id;
}





function getStoredQuiz()
{

	$.get('/quizzes', function(data) {
		if(data!=null)
		quizs= data;

	show_in_table();
	});
}




function storeQuiz(quiz)
{

$.post('/addquiz', quiz,function (data,txt) {

	if(data.msg=="added"){
		insertIntoList(data.data);
		quizs.push(data.data);
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
getStoredQuiz();
});






function show_in_table()
{
	var table=$('#table tbody');

	table.text('');

	for(var i=0;i<quizs.length;i++)
	{


		insertIntoList(quizs[i]);


	}
	if(table.children().length>0)
	{
		$('#show').show();
		$('.empty').hide();
	}
	else
	{
		$('#show').hide();
			$('.empty').show();
	}
}








$("#refresh").click(function(event)
		{
			getStoredQuiz();
		});




$("#my").click(function(event)
		{
			$(this).hide();
			createInputBox();
		});




function createInputBox()
{

			var input_data=$("#input_data");
			input_data.html('');
			input_data.show();



			input_data.append($('<p>')
				.append($('<input>').attr({
										type: 'text',
										id:'ntitle',
										placeholder:"title"
									})));



			input_data.append($('<p>').append($('<textarea>').attr({
										rows: '3',
										cols: '18',
										id:'desc',
										placeholder:"Description"

									})));




			input_data.append($('<p>')
				.append($('<input>').attr({
										type: 'number',
										id:'no_of_q',
										placeholder:"No Of Que"

									})));



			//input_data.append($('<p>').text("Time_BASED"));
			input_data.append($('<input type="text">').attr({
				placeholder: 'Time_BASED',
				disabled: 'true'
			}));


input=$('<input>').attr({
										type: 'radio',
										id:'time_based_yes',
										value:'YES',
										name:"time_based"
									}).hide().click(function(event) {

										var a=$('#Time_Allowed_p')
				a.attr('style', 'display:block');
									});
			input_data.append(input);


		input_data.append($('<button>').addClass('radio').text('YES').click(function(e)
									{
										$('#time_based_yes').click();
										$(this).css("background", "#fe8d08");
										$(this).siblings('.radio').css("background", "#ccc");
									}));



var input=$('<input>').attr({
										type: 'radio',
										id:'time_based_no',
										value:'NO',
										name:"time_based"
									}).hide().click(function(event) {
										var a=$('#Time_Allowed_p')
				a.hide();
									});
input.checked=true;
			input_data.append(input);


		input_data.append($('<button>').addClass('radio').text('NO').click(function(e)
									{
										$('#time_based_no').click();
										$(this).css("background", "#fe8d08");
										$(this).siblings('.radio').css("background", "#ccc")

									}));

		input_data.append($('<p>')
			.append(
				$('<input>').attr({
										type: 'number',
										id:'Time_Allowed',
										placeholder:'Time_Allowed in minutes'
									}))
			.attr('id', 'Time_Allowed_p')
			.hide()
				);




			input_data.append($('<p>').append($('<input>').attr({
										type: 'button',
										class: 'save',
										value:'save',
										id:'save'
									}).click(function() {
										saveNewData();
									})));



}




function insertIntoList(myquiz)
{

							var tr =$('<tr>');
							tr.append($('<td>').text(myquiz.id).hide());
							tr.append($('<td>').text(myquiz.title));
							tr.append($('<td>').text(myquiz.desc));
							tr.append($('<td>').text(myquiz.Time_BASED));
							tr.append($('<td>').text(myquiz.Time_Allowed));
							tr.append($('<td>').text(myquiz.AddedDate));
							tr.append($('<td>').text(myquiz.addedBy));
							tr.append($('<td>').text(myquiz.no_of_Q));
							var input=$('<button>').addClass('take_quiz_btn').attr('id', 'newQue').text("ADD QUE");
							tr.append($('<td>').append(input));
							input.click(function(event) {
							var mytr=$(this).parent().parent();
							var index=mytr.children().eq(0).text();
							storequizid(index);
							window.location.href='addQuestion.html';

							});

							var input=$('<button>').addClass('take_quiz_btn').attr('id', 'preview').text("PREVIEW");
							tr.append($('<td>').append(input));
							input.click(function(event) {
							var mytr=$(this).parent().parent();
							var index=mytr.children().eq(0).text();
							storequizid(index);
							window.location.href='TakeQuiz.html';
							});

							tr.append($('<td>').text(myquiz.active).hide());

							$('#table tbody').append(tr);
							$('.empty').hide();

}

function saveNewData()
{

					var title=$("#ntitle").val();
					var desc=$("#desc").val();
					var TB=$('input[name="time_based"')[0].checked;
					var TBb=$('input[name="time_based"')[1].checked;
					var TA=($("#Time_Allowed").val());
					var noQ=$("#no_of_q").val();

					if(TA=="")
					{
						TA=0;
					}



						if(title==""||desc==""||noQ==""||noQ<1||(TA<1&&TB==true)||(!(TB==true)&&!(TBb==true)))
						{
							alert("Enter valid data");
						}
						else
						{

							var myquiz=new quiz(title,desc,TB,TA,noQ);
							$('#show').show();
							storeQuiz(myquiz);

						$("#input_data").html('');
						$("#input_data").hide();
						$("#my").show();
						}
}

