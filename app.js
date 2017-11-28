var express=require('express');

var bodyParser=require('body-parser');

var path=require('path');

var MongoClient = require('mongodb').MongoClient;

var fs=require('fs');

var url = "mongodb://localhost:27017/quizdb";
url="mongodb://a:a@ds115085.mlab.com:15085/quizdb";

var app=express();

app.use(express.static(__dirname+"/public"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function (req,res)
	{

		res.sendFile('index.html',{root:__dirname});

	});



app.get('/options',function (req,res)
{


	MongoClient.connect(url,function (err,db)
	{
		if(err)
			{
				console.log(err);
				throw er;
			}

		db.collection('options').find({active:"1"}).toArray(function (err,objs)
		{
			if(err)
				{
					console.log(err);
					throw er;
				}
			//	console.log(objs);
			res.json(objs);
			db.close();
		});
	});
});


app.get('/questions',function (req,res)
{
	MongoClient.connect(url,function (err,db)
	{
		if(err)
			{
				console.log(err);
				throw er;
			}


		db.collection('questions').find({active:"1"}).toArray(function (err,objs)
		{

			if(err)
				{
					console.log(err);
					throw er;
				}
				//console.log(objs);

			res.json(objs);
			db.close();
		});
	});
});

app.get('/quizzes',function (req,res)
{
	MongoClient.connect(url,function (err,db)
		{
			if(err)
				{
					console.log(err);
					throw er;
				}


			db.collection('quizzes').find({title:"JAVA",active:"1"}).toArray(function (err,objs)
			{

				if(err)
					{
						console.log(err);
						throw er;
					}
					var java=[];
					for(var i in objs)
					{
						if(objs[i].title==='JAVA')
						{
							java.push(objs[i]);
						}
					}
				res.json(java);
				db.close();
			});
		});
});



/*
app.post('/options',function (req,res) {
	res.end();
var data =JSON.parse(req.body.data);

MongoClient.connect(url,function (err,db) {
	db.collection('options').deleteMany({});
	});
data.forEach( function(element, index) {

MongoClient.connect(url,function (err,db) {
		if(err)throw err;


			db.collection('options').insert(element);
			db.close();
});
});


});

app.post('/questions',function (req,res) {
	res.end();
var data =JSON.parse(req.body.data);

MongoClient.connect(url,function (err,db) {
	db.collection('questions').deleteMany({});
	});
data.forEach( function(element, index) {

MongoClient.connect(url,function (err,db) {
		if(err)throw err;


			db.collection('questions').insert(element);
			db.close();
});
});

});

app.post('/quizzes',function (req,res) {
res.end();

var data =JSON.parse(req.body.data);

MongoClient.connect(url,function (err,db) {
	db.collection('quizzes').deleteMany({});
	});
data.forEach( function(element, index) {

MongoClient.connect(url,function (err,db) {
		if(err)throw err;


			db.collection('quizzes').insert(element);
			db.close();
});
});


});*/

app.post('/addquiz',function (req,res)
{

	//console.log(req.body);
	var data =req.body;

	MongoClient.connect(url,function (err,db)
	{
		if(err)
			{
				console.log(err);
				throw er;
			}



		var query = {
						title:data.title
					}

		db.collection('quizzes').find(query).toArray(function (err,objs)
		{

			if(err)
				{
					console.log(err);
					throw er;
				}
				//console.log(objs);

			if(objs.length==0)
			{

db.collection('quizzes').find().toArray(function (err,objs)
		{

			if(err)
				{
					console.log(err);
					throw er;
				}
				data.id=1;
				if(objs.length>0)
				{
					 data.id=parseInt(objs[objs.length-1].id)+1;
				}
				console.log(data);
				db.collection('quizzes').insert(data,function (err,user)
				{
					var a=new Object();
					if(err)
					{

						a.msg="SERVER ERROR";
						res.json(a)
						throw err;
					}
					else
					{
						a.msg="added";
						a.data=data;
						res.json(a);
					}
					db.close();
				});

			});
			}
			else
			{
				var a=new Object();
				a.msg="quiz already exists";
				res.json(a);
			}
			
		});
	});
});


app.post('/addQue',function (req,res)
{

	//console.log(req.body);
	var data =req.body;

	MongoClient.connect(url,function (err,db)
	{
		if(err)
			{
				console.log(err);
				throw er;
			}



		var query = {
						title:data.title
					}

		db.collection('questions').find(query).toArray(function (err,objs)
		{

			if(err)
				{
					console.log(err);
					throw er;
				}
				//console.log(objs);

			if(objs.length==0)
			{
db.collection('questions').find().toArray(function (err,objs)
		{

			if(err)
				{
					console.log(err);
					throw er;
				}
				data.id=1;
				if(objs.length>0)
				{
					 data.id=parseInt(objs[objs.length-1].id)+1;
				}
				db.collection('questions').insertOne(data,function (err,user)
				{
					var a=new Object();
					if(err)
					{
						a.msg="SERVER ERROR";
						res.json(a);
						throw er;
					}
					else
					{
						a.msg="added";
						a.data=data;
						res.json(a);
					}

					db.close();
				});
			});
			}
			else
			{
				var a=new Object();
				a.msg="question already exists";
				res.json(a);
			}
			
		});
	});
});



app.post('/addoption',function (req,res)
{

	//console.log(req.body);
	var data =req.body;

	MongoClient.connect(url,function (err,db)
	{
		if(err)
			{
				console.log(err);
				throw er;
			}



		var query = {
						 QueId:data.QueId,
						title:data.title
					}

		db.collection('options').find(query).toArray(function (err,objs)
		{

			if(err)
				{
					console.log(err);
					throw er;
				}
				console.log(objs);

			if(objs.length==0)
			{
db.collection('options').find().toArray(function (err,objs)
		{

			if(err)
				{
					console.log(err);
					throw er;
				}
				data.id=1;
				if(objs.length>0)
				{
					 data.id=parseInt(objs[objs.length-1].id)+1;
				}
				db.collection('options').insertOne(data,function (err,user)
				{
					var a=new Object();
					if(err)
					{
						a.msg="SERVER ERROR";
						res.json(a);
						throw er;
					}
					else
					{
						a.msg="added";
						a.data=data;
						res.json(a);
					}
					db.close();
				});
			});
			}
			else
			{
				var a=new Object();
				a.msg="option already exists";
				res.json(a);
			}
			
		});
	});
});



app.get('/options/:QueId',function(req,res)
{


	MongoClient.connect(url,function (err,db)
	{
		if(err)
		{
			console.log(err);
			throw er;
		}
		var query =
		{
			QueId:(req.params.QueId),
			active:"1"
		}

		db.collection('options').find(query).toArray(function (err,objs)
		{
			if(err)
			{
				console.log(err);
				throw er;
			}
			res.json(objs);
		});
	});
});






app.get('/questions/:QuizId',function(req,res)
{

	MongoClient.connect(url,function (err,db)
	{
		if(err)
		{
			console.log(err);
			throw er;
		}
		var query =
		{
			Quizid:(req.params.QuizId),
			active:"1"
		}

		db.collection('questions').find(query).toArray(function (err,objs)
		{
			if(err)
			{
				console.log(err);
				throw er;
			}
			//console.log(objs);
			res.json(objs);

		});
	});
});




app.get('/question/:id',function(req,res)
{

	MongoClient.connect(url,function (err,db)
	{
		if(err)
		{
			console.log(err);
			throw er;
		}
		var query =
		{
			id:parseInt(req.params.id),
			active:"1"
		}

		db.collection('questions').find(query).toArray(function (err,objs)
		{
			if(err)
			{
				console.log(err);
				throw er;
			}
			if(objs.length==1)
		{
					res.json(objs[0]);
				}
		else
			res.send(null);

		});
	});
});



app.get('/quizzes/:id',function(req,res)
{

	MongoClient.connect(url,function (err,db)
	{
		if(err)
		{
			console.log(err);
			throw er;
		}
		var query =
		{
			id:parseInt(req.params.id),
			active:"1"
		}

		db.collection('quizzes').find(query).toArray(function (err,objs)
		{
			if(err)
			{
				console.log(err);
				throw er;
			}
			if(objs.length==1)
			res.json(objs[0]);
		else
			res.send(null);

		});
	});
});

app.post('/login',function (req,res)
{
	var data =req.body;

	MongoClient.connect(url,function (err,db)
	{
		if(err)
			{
				console.log(err);
				throw er;
			}
		db.collection('login').find(data).toArray(function (err,objs)
		{
			var a=new Object();
			if(err)
				{
					console.log(err);

					a.msg="SERVER ERROR";
					res.json(a);
					throw er;
				}

			//	console.log(objs);
			if(objs.length==1)
				{
					a.msg="ok";
				}
			else
				{
					a.msg="enter valid details";
				}
			res.json(a);
			db.close();
		});
	});
});

app.get('/marks',function(req,res){
MongoClient.connect(url,function (err,db){
	if(err)
	{
	res.send("ERROR OCCURED");
	throw err;
	}

db.collection('marks').find({},{_id:0}).toArray(function(err,obj){
if(err)
	{
	res.send("ERROR OCCURED");
	throw err;
	}

res.write('<html><body>');
for(var i in obj)
{
	res.write(obj[i].roll+"  :  "+obj[i].marks+"<br>");
}
res.end('</body></html>');


});
});


});

app.post('/submitMarks',function(req,res){
	var data=req.body;
	var q={
		rollno:data.roll
	}
		MongoClient.connect(url,function (err,db){

	if(err)
	{
	res.send("ERROR OCCURED");
	throw err;
	}


    db.collection('marks').find(q,{_id:0}).toArray(function(err,obj){
                   if(err)
				{
					console.log(err);
					throw err;
				}


    	else if(obj.length>0)
	{
	res.send("marks of this roll no already exists");
	}
	else
	{
	db.collection('marks').insertOne(data,function(err,data){
	if(err)
	{
	res.send("ERROR OCCURED");
	throw err;
	}
	else
	{
	res.send("marks submitted");
	}

	});

	}
	});


});
    });





app.listen(process.env.PORT||5000,function()
{
	console.log('running on port 5000');
});