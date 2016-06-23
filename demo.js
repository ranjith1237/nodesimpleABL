
//usage of nodesimpleABL

var express = require('express');
var nodeabl1=require('nodeabl1');
var fileUpload = require('express-fileupload');
var app = express();
var bodyParser = require('body-parser');

app.use(fileUpload());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get("/runABL/:fname",function(req,res){
	nodeabl1.getABL(req.url,req.params.fname);
});

app.post("/runABL/:fname",function(req,res){
	nodeabl1.postABL(req.url,req.body,req.params.fname);
	res.send('posted');
});

app.post("/publish",function(req,res){
	nodeabl1.upload_file(req.files);
	
});



var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at  port %s",  port)
})