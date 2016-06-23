var fs = require('fs');
var path = require('path');
var fileUpload = require('express-fileupload');
var url = require('url');
var bodyParser = require('body-parser');
var qs = require('querystring');


exports.getABL = function(url_get,method){
	var obj;
	var str='';
	var url_parts = url.parse(url_get, true);
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
//	method = req.params.fname;
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
				return "working";
			}
			else
			{
				console.log('No such file exists');
			}				
	  }
	  else
	  {
	  		return "Error : number of parameters doesnt match";
	//  		res.send("Error : number of parameters doesnt match");
	  }
	});
}


exports.postABL = function(url_post,body_params,method)
{
	var url_parts = url.parse(url_post, true);
	var query = url_parts.query;  // query conatins input parameters through url
	var query_length = Object.keys(query).length;

	var v = body_params;    //  req.body contains the input parameters through the body
	var body_length = Object.keys(v).length;
  	
// 	var method = req.params.fname;
	var exact_method = method + '_post';
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
	  	 			console.log(i+"   "+op[i].var);
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
		  	 				str=str+','+query[temp];	
		  	 			}
		  	 			
		  	 		}		
	  	 		}
	  	 		console.log('my string is : '+str);
	  	 		var file_name = obj[exact_method].inp_file;
		  	 	var filePath = 'C:/Users/ranreddy/Documents/node/uploads/'+file_name;
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
	  	 		return 'Error : number of parameters doesnt match';
       //	  	res.send("Error : number of parameters doesnt match");	 		
	  	 	}
	  }
	  else
	  {
		  	return 'Error : number of parameters doesnt match';
	  	//	res.send("Error : number of parameters doesnt match");
	  }
	});
}








// uplaod a zip file that has *.p files.......
exports.upload_file = function(f_name)
{
	if(!f_name)
	{
	//	res.send('No files are uploaded');
		return 'NO file exists';
	}
	var tempfile = f_name.body;
	console.log("file name: " + tempfile.name);
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
			console.log('file uploaded');
			return 'file uploaded!!';
		}
	});	
}