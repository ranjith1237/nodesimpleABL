//usage of nodesimpleABL

var express = require('express');
var nodesimpleabl=require('nodesimpleabl');
var fileUpload = require('express-fileupload');
var morgan = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var auth = require('basic-auth');
app.use(fileUpload());
app.use(morgan('dev'));



app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get("/nodeabl/:fname*",function(req,res){
	var user = auth(req);
	if(user.name=='progress'&&user.pass=='Progress@123456')
	{
	 	nodesimpleabl.getABL(req.url,res);
	}
	else
	{
		res.send('Enter credentials correctly');
	}
});

app.post("/nodeabl/:fname*",function(req,res){
	var user = auth(req);
	if(user.name=='progress'&&user.pass=='Progress@123456')
	{
		var response = nodesimpleabl.postABL(req.url,req.body);
		res.send(response);
	}
	else
	{
		res.send('Enter credentials correctly');
	}

});


app.put("/nodeabl/:fname*",function(req,res){
	var user = auth(req);
	if(user.name=='progress'&&user.pass=='Progress@123456')
	{
		var response = nodesimpleabl.putABL(req.url,req.body);
		res.send(response);	
	}
	else
	{
		res.send('Enter credentials correctly');
	}
});

app.delete("/nodeabl/:fname*",function(req,res){
	var user = auth(req);
	if(user.name=='progress'&&user.pass=='Progress@123456')
	{
		var response = nodesimpleabl.delABL(req.url,req.body);
		res.send(response);
	}
	else
	{
		res.send('Enter credentials correctly');
	}
});

app.post("/publish",function(req,res){
	var user = auth(req);
	if(user.name=='progress'&&user.pass=='Progress@123456')
	{
		var response = nodesimpleabl.upload_file(req.files);
		res.send(response);
	}
	else
	{
		res.send('Enter credentials correctly');
	}	
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at  port %s",  port)
})