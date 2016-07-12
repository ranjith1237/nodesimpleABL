//usage of nodesimpleABL

var express = require('express');
var nodesimpleabl=require('nodesimpleabl');
var fileUpload = require('express-fileupload');
var app = express();
var bodyParser = require('body-parser');
app.use(fileUpload());


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get("/runABL/:fname",function(req,res){
	var ret = nodesimpleabl.getABL(req.url,req.params.fname);
	res.send(ret);
});

app.post("/runABL/:fname",function(req,res){
	nodesimpleabl.postABL(req.url,req.body,req.params.fname);
	res.send('posted');
});

app.post("/publish",function(req,res){
	nodesimpleabl.upload_file(req.files);
	res.send('uploaded');
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at  port %s",  port)
})