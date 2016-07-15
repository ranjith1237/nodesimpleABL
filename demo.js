//usage of nodesimpleABL

var express = require('express');
var nodesimpleabl=require('nodesimpleabl');
var fileUpload = require('express-fileupload');
var morgan = require('morgan');
var app = express();
var bodyParser = require('body-parser');
app.use(fileUpload());
app.use(morgan('dev'));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get("/runABL/:fname*",function(req,res){
	var response = nodesimpleabl.getABL(req.url);
	res.send(response);
});

app.post("/runABL/:fname*",function(req,res){
	var response = nodesimpleabl.postABL(req.url,req.body);
	res.send(response);
});


app.put("/runABL/:fname*",function(req,res){
	var response = nodesimpleabl.putABL(req.url,req.body);
	res.send(response);
});

app.delete("/runABL/:fname*",function(req,res){
	var response = nodesimpleabl.delABL(req.url,req.body);
	res.send(response);
});

app.post("/publish",function(req,res){
	var response = nodesimpleabl.upload_file(req.files);
	res.send(response);
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at  port %s",  port)
})