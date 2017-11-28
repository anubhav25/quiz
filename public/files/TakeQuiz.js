var options=[];
var ques=[];
var ans=[];
var currentquiz;


function getStoredOPTIONS(e)
{
	$.get('/options/'+e.id, function(data)
	{
		if(data.length!=0)
		{
			data.forEach(function (a) {
			options.push(a);

			});
			createQueinList(e);

		}
	});
}


function getStoredQue()
{
	var id=getquizid();
if(id=="null")
{
window.location.href="Quiz.html";
}
	else{

	$.get('/quizzes/'+id,function (data) {

		if(data.length==0)
		{
			$('.empty').show();
			$('.quiq_frame').hide();
		}
		else
		{
			$('.empty').hide();
			$('.quiq_frame').show();
			$('#head').text(data.title);
			currentquiz=data;
			
			if(currentquiz.Time_BASED=="true")
{
				setTimeBar();
		}
		else
{
	stopTimeBar();
}

			$.get('/questions/'+id, function(data) {
if(data.length==0)
		{
			$('.empty').show();
			$('.quiq_frame').hide();
			stopTimeBar();
		}
		else
		{
			$('.empty').hide();
			$('.quiq_frame').show();
			ques=data;

	data.forEach(function (e) {
		getStoredOPTIONS(e);
	});
		}

});
		}
	})

}
}

function getquizid()
{
if (!sessionStorage.quizId||sessionStorage.quizId==null)
{
sessionStorage.quizId =null;
}
return sessionStorage.quizId;
}




function createQueinList(myque)
{
	var list=$('#mylist')
	var li=$('<li>');
	var div=$('<div>');
	


	var div2=$('<div>');

	var ol=$('<ol>');
	var i=1;
	for(var j=0;j<options.length;j++)
	{
		if(options[j].QueId==myque.id)
		{

			var li1=$('<li>');

			li1.append($('<input>').attr({
							type: 'radio',
							value: i,
							name:myque.id
						}).click(function () {
							for(var k=0;k<ans.length;k++)
							{
								if(ans[k].QueID==myque.id)
								{
									ans.splice(k,1);
								}
							}
							var a=new userans(myque.id,this.value);
							ans.push(a);
							storeans(ans);
						}));
			i++;

			li1.append($('<span>').text(options[j].title));

			ol.append(li1);
		}
	}



			var k=0;
			var y=0;
			for( y=0;y<options.length;y++)
			{
			if(options[y].QueId==myque.id)
		{
				k++;
				if(k==myque.correctOption)
					break;
		}
			}







			div2.append(ol);
			div2.append($('<span>').text("Correct Answer : "+options[y].title).addClass('hidden').hide());
			div.append($('<h3>').text(myque.title));
			div.append(div2);
	
	li.append(div);
	li.append($('<div>').css('clear','both'));
	list.append(li);

div.addClass('que');
	div2.addClass('div2')

}


function getans()
{
if (!sessionStorage.ans)
{
sessionStorage.ans =JSON.stringify([]);
}
return JSON.parse(sessionStorage.ans);
}


function storeans(myans)
{
sessionStorage.ans = JSON.stringify(myans);
}

function userans(QueID,selected_option)
{

	this.QueID=QueID;
	this.selected_option=selected_option;

}


function changetime () {
var ltime=JSON.parse(localStorage.time);
var timer;
if(ltime.id==0)
{
	clearTimeout(timer);
}
else
{
var min=ltime.m;
var hr=ltime.h;
var sec=ltime.s;
timer=	setTimeout(function () {

if(localStorage.timeactive==0)
{
	localStorage.time=JSON.stringify({h:0,m:0,s:0,id:0});
	return;
}

if(min==0&&sec==0&&hr==0)
{
	submit.click();
	return;
}
if(sec<0)
{
	sec=59;
	min--;
}
if(min<0)
{
	min=59;
	hr--;
}

time=hr+":"+min+":"+sec;
sec--;
var clock=$('#clock');
clock.text(time);
localStorage.time=JSON.stringify({h:hr,m:min,s:sec,id:currentquiz.id});
changetime();
},1000);
}
}

var onSubmit=function(btn)
	{

$('#clock_div').hide();

$('#marks').html('/');

var total=ques.length*4;

$('#marks').html($('#marks').html()+total);
var marks=0;
for(var j=0;j<ans.length;j++)
{
		for(var i=0;i<ques.length;i++)
			{
				if(ques[i].id==ans[j].QueID)
					{
						if(ques[i].correctOption==ans[j].selected_option)
						{

						marks+=4
						break;
					}
					else
					{
						marks-=1
						break;					}
					}

			}
}

$('#marks').html(marks+$('#marks').html());
$('#result').show();

var x=$('.hidden').show().css('color', 'red');

btn.setAttribute('disabled', true);
$(btn).css('background','#999999');
($('input[type="radio"]')).attr('disabled', true);
stopTimeBar();

return marks;
}
function stopTimeBar()
{
	$('#clock_div').hide();
	localStorage.timeactive="0";
}
function setTimeBar()
{


if(!localStorage.time || JSON.parse(localStorage.time).id!=currentquiz.id){

	localStorage.time=JSON.stringify({h:0,m:parseInt(currentquiz.Time_Allowed),s:0,id:currentquiz.id});
	localStorage.timeactive="1";
}
var ltime=JSON.parse(localStorage.time);
var clock=$('#clock');
var clock_div=$('#clock_div');
if(currentquiz.Time_BASED)
{
var min=ltime.m;
var hr=ltime.h;
var sec=ltime.s;
while(min>59)
{
	hr++;
	min-=60;
}

time=hr+":"+min+":"+sec;
//console.log(time);
clock.text(time);
localStorage.time=JSON.stringify({h:hr,m:min,s:sec,id:currentquiz.id});
localStorage.timeactive="1";
	changetime();
}
else{
clock_div.hide();
}

}



$(document).ready(function($) {

getStoredQue();
var roll;
roll=prompt("Enter Your RollNo");
$('#submit').click(function(){
	var marks = onSubmit(this);
var a={};
a.roll=roll;
a.marks=marks;
$.post('/submitMarks',a,function(data){
	alert(data);
})

});





});