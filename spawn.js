var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var qs = require('querystring');

var app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get("/runABL/:fname", function(req,res){
	var obj;
	var str='';
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;  // command line inputs throught the url
	var length = 0;
	for(var i  in query)
	{
		length++;					//length tells the number of parameters.....
		if(str=='')
		{
			str = query[i];
		}
		else
		{
			str = str +","+query[i];
		}
	}
	console.log(str);             
	method = req.params.fname;
	exact_method = method + '_get';
	fs.readFile('myjson.json', 'utf8', function (err, data) {
	  if (err) 
	  {
	  	throw err;
	  }
	  obj = JSON.parse(data);
	  var op = obj[exact_method].params;
	  var len_json = Object.keys(op).length;
	  if(length==len_json)
	  {
	  	 	res.send("length matches");
	  	 	var file_name = obj[exact_method].inp_file;
	  	 	var filePath = 'C:/Users/ranreddy/Documents/node/uploads/'+file_name;
	  	 	console.log(filePath);
	  	 	function fileExists(filePath)
			{
			    try
			    {
			        return fs.statSync(filePath).isFile();
			    }
			    catch (err)
			    {
			        return false;
			    }
			}
			if(fileExists(filePath)) // file is present
			{
				// spawn and exec the progress command.......
				const exec = require('child_process').execSync;
				if(str=='')
				{
					exec('C:/Progress/Openedge/bin/_progres.exe -p '+ filePath + ' -b');    
				}
				else
				{
					exec('C:/Progress/Openedge/bin/_progres.exe -p '+filePath+' -param ' + str+' -b');    
				}
				
				// Asynchronous read
				var outputfile = file_name.split(".")[0]+".out";
				fs.readFile(outputfile, function(err, data) {       // reading from the output file.......
				   if (err)
				   {
				       return console.error(err);
				   }
				   console.log("Asynchronous read: " +data.toString());  // prints the output text....
				});
			}
			else
			{
				console.log('No such file exists');
			}				
	  }
	  else
	  {
	  		res.send("Error : number of parameters doesnt match");
	  }
	});	
});

app.post("/runABL/:fname",function(req,res){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;  // query conatins input parameters through url
	var query_length = Object.keys(query).length;

	var v = req.body;    //  req.body contains the input parameters through the body
	var body_length = Object.keys(v).length;
  	
  	var method = req.params.fname;
	var exact_method = method + '_post';
	res.send(exact_method);

	console.log(v);
	console.log(query);

  	fs.readFile('myjson.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  obj = JSON.parse(data);
	  var op = obj[exact_method].params;
	  var len_json = Object.keys(op).length;
	  if(body_length+query_length==len_json)
	  {
	  		var b_len=0,q_len=0;
	  	 	for(var i in op)
	  	 	{
	  	 		if(op[i].var=='body'){
	  	 			b_len++;
	  	 		}
	  	 		else{
	  	 			q_len++;
	  	 		}
	  	 	}
	  	 	if(b_len==body_length&&q_len==query_length)
	  	 	{
	  	 		b_len=0;q_len=0;
	  	 		var str='';
	  	 		for(var i in op)
	  	 		{
		  	 		if(op[i].var=='body'){
		  	 			b_len++;
		  	 			var temp = "par"+b_len;
		  	 			if(str=='')
		  	 			{
		  	 				str=str+v[temp];
		  	 			}
		  	 			else
		  	 			{
		  	 				str=str+','+v[temp];	
		  	 			}
		  	 			
		  	 		}
		  	 		else{
		  	 			q_len++;
		  	 			var temp = "par"+q_len;
		  	 			if(str=='')
		  	 			{
		  	 				str=str+query[temp];	
		  	 			}
		  	 			else
		  	 			{
		  	 				str=str+','+v[temp];	
		  	 			}
		  	 			
		  	 		}		
	  	 		}
	  	 		console.log('my string is : '+str);
	  	 		var file_name = obj[exact_method].inp_file;
		  	 	var filePath = 'C:/Users/ranreddy/Documents/node/uploads/'+file_name;
		  	 	console.log(filePath);
		  	 	function fileExists(filePath)
				{
				    try
				    {
				        return fs.statSync(filePath).isFile();
				    }
				    catch (err)
				    {
				        return false;
				    }
				}

				if(fileExists(filePath)) // file is present
				{
					// spawn and exec the progress command.......
					const exec = require('child_process').execSync;
					if(str=='')
					{
						exec('C:/Progress/Openedge/bin/_progres.exe -p '+ filePath + ' -b');    
					}
					else
					{
						exec('C:/Progress/Openedge/bin/_progres.exe -p '+ filePath + ' -param ' +str+' -b');
					}
		

					// Asynchronous read
					var outputfile = file_name.split(".")[0]+".out";
					fs.readFile(outputfile, function(err, data) {       // reading from the output file.......
					   if (err)
					   {
					       return console.error(err);
					   }
					   console.log("Asynchronous read: " +data.toString());  // prints the output text....
					});

				}
				else
				{
					console.log('No such file exists');
				}					  	 		
	  	 		console.log(str);
	  	 	}
	  	 	else
	  	 	{
	  			res.send("Error : number of parameters doesnt match");	 		
	  	 	}
	  }
	  else
	  {
	  		res.send("Error : number of parameters doesnt match");
	  }
	});	
});

// uplaod a zip file that has *.p files.......
app.post("/publish",function(req,res){	
	if(!req.files)
	{
		res.send('No files are uploaded');
		return;
	}
	var tempfile = req.files.body;
	tempfile.mv("uploads/"+tempfile.name, function(err){
		if(err)
		{
			res.status(500).send(err);
		}
		else
		{
			const decompress = require('decompress'); 
			decompress('uploads/'+tempfile.name, 'uploads/').then(files => {
			});
			res.send('file uploaded!!!!');
		}
	});
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at  port %s",  port)
})
