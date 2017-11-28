var quizs=[];

function storequiz(id)
{
	sessionStorage.quizId=id;
}

function getStoredQuiz()
{

	$.get('/quizzes', function(data)
	{
		if(data!=null)
			quizs=data;

		show_in_table();

	});

}


function show_in_table()
{
	var table=$('#table tbody');
	table.html('');
	for(var i=0;i<quizs.length;i++)
	{
		insertIntoList(quizs[i]);
	}
	if(table.children().length>0)
	{
		$('#show').show();
		$(".empty").hide();
	}
	else
	{
		$('#show').hide();
		$(".empty").show();
	}
}


function insertIntoList(myquiz)
{

	var tr =$('<tr>');

	tr.append($('<td>').text( myquiz.id).hide());
	tr.append($('<td>').text( myquiz.title));
	tr.append($('<td>').text( myquiz.desc));
	tr.append($('<td>').text( myquiz.Time_BASED));
	tr.append($('<td>').text( myquiz.Time_Allowed));
	tr.append($('<td>').text( myquiz.no_of_Q));
	tr.append($('<td>').append($('<button>').addClass("take_quiz_btn").text('take quiz').click(function(event) {
		var mytr=$(this).parent().parent();
		console.log(mytr.children()[0])
		var index=(mytr.children().eq(0).text());
		storequiz(index);
		window.location.href='TakeQuiz.html';
	})));
	$('#table tbody').append(tr);

}

$(document).ready(function($) {

getStoredQuiz();

});