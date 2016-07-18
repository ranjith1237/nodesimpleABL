var fs = require('fs');
var path = require('path');
var fileUpload = require('express-fileupload');
var url = require('url');
var bodyParser = require('body-parser');
var qs = require('querystring');
var jsonfile = require('jsonfile')
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

exports.getABL = function(url_get)
{
	var str='';
	var error_status={};
	var url_parts = url.parse(url_get, true);
	var query = url_parts.query;  
	var path_param = url_parts.pathname.split('/'); 
	var exact_method = path_param[2] + '_get';
	var data = fs.readFileSync('config.json', 'utf8');
	var obj = JSON.parse(data);
	var op = obj[exact_method].params;
	var cnt = 0;
	var offset = 3;
	
 	for(var i in op)
 	{
 		cnt++;
 		var input = 'param'+cnt;
		var result = op[i][input].split('.');
		if(result[0]=='query')
		{
			if(query.hasOwnProperty(result[1]))
			{
				if(result[1]=='filter')
				{
					//write the query[result[1]] into result[1].txt file;;;;;
					fs.writeFileSync(result[1]+'.txt',query[result[1]],'utf8');
					if(str=='')
					{
						str = result[1]+'.txt';
					}
					else
					{
						str = str +","+result[1]+'.txt';
					}	
				}
				else
				{
					if(str=='')
					{
						str = query[result[1]];
					}
					else
					{
						str = str +","+query[result[1]];
					}	
				}
			}
			else
			{
				error_status[result[1]]="query parameter is missing";
				return error_status;
			}
		}
		else if(result[0]=='path')
		{
			if(offset<path_param.length)
			{
				if(str=='')
				{
					str = path_param[offset];
				}
				else
				{
					str = str +","+path_param[offset];
				}
			}
			else
			{
				error_status[result[1]]="path parameter is missing";
				return error_status;	
			}
			offset++;
		}
 	}
 	var file_name = obj[exact_method].ABLFILE;
 	var filePath = obj[exact_method].ABLFILELOC+file_name;
 	var dlc = obj["PATH"].DLC+'bin/_progres.exe';
 	var append = dlc;
 	if(obj[exact_method].hasOwnProperty("DB"))
 	{
 		append =append + ' -db '+ obj[exact_method].DB;
 	}
 	append = append+' -p '+filePath;
	if(fileExists(filePath)) // file is present
	{
		// spawn the child....
		const exec = require('child_process').execSync;
		if(str=='')
		{
			exec(append +' -b');
		}
		else
		{
			exec(append + ' -param ' + str+' -b');
		}
		var response = fs.readFileSync(obj[exact_method].OUTFILE, 'utf8');// read the output file.....
		return response;
	}
	else
	{
		error_status["config.json"]="File doesen't exist";
		return error_status;
	}		
}


exports.postABL = function(url_post,body_params)
{
	var js;
	var str='';
	var error_status={};
	var url_parts = url.parse(url_post, true);
	var query = url_parts.query;  // query conatins input parameters through url
	var path_param = url_parts.pathname.split('/'); // path parameters.....
	var v = body_params;    // body parametrs
	var exact_method = path_param[2] + '_post';
	var data = fs.readFileSync('config.json', 'utf8');
	obj = JSON.parse(data);
	var op = obj[exact_method].params;
	var cnt=0;
	var offset=3;
	for(var i in op)
	{
		cnt++;
 		var input = 'param'+cnt;
		var result = op[i][input].split('.');
		if(result[0]=='path')
		{
			if(offset<path_param.length)
			{
				if(str=='')
				{
					str = path_param[offset];
				}
				else
				{
					str = str +","+path_param[offset];
				}
			}
			else
			{
				error_status[result[1]]="path parameter is missing";
				return error_status;	
			}
			offset++;
		}
		else if(result[0]=='query')
		{
			if(query.hasOwnProperty(result[1]))
			{
				if(str=='')
				{
					str = query[result[1]];
				}
				else
				{
					str = str +","+query[result[1]];
				}
			}
			else
			{
				error_status[result[1]]="query parameter is missing";
				return error_status;
			}
		}
		else if(result[0]=='body')
		{
			if(v.hasOwnProperty(result[1]))
			{
				if(str=='')
				{
					str = result[1]+'.json';
				}
				else
				{
					str = str +","+result[1]+'.json';
				}
				var js = v[result[1]];
				jsonfile.writeFileSync(result[1]+'.json', js, {spaces: 2});  // writing into a json file....
			}
			else
			{
				error_status[result[1]]="body parameters are missing";
				return error_status;
			}		
		}
		
	}
	var file_name = obj[exact_method].ABLFILE;
 	var filePath = obj[exact_method].ABLFILELOC+file_name;
 	var dlc = obj["PATH"].DLC+'bin/_progres.exe';
 	var append = dlc;
 	if(obj[exact_method].hasOwnProperty("DB"))
 	{
 		append =append + ' -db '+ obj[exact_method].DB;
 	}
 	append = append+' -p '+filePath;
	if(fileExists(filePath)) // file is present
	{
		// spawn and exec the progress command.......
		const exec = require('child_process').execSync;
		if(str=='')
		{
			exec(append +' -b');  
		}
		else
		{
			exec(append + ' -param ' + str+' -b');    
		}
		var response = fs.readFileSync(obj[exact_method].OUTFILE, 'utf8');
		return response;
	}
	else
	{
		error_status["config.json"]="File doesen't exist";
		return error_status;
	}  	 		
}




exports.putABL = function(url_post,body_params){
	var js;
	var str='';
	var error_status={};
	var url_parts = url.parse(url_post, true);
	var query = url_parts.query;  // query conatins input parameters through url
	var path_param = url_parts.pathname.split('/'); // path parameters.....

	var v = body_params;    //  req.body contains the input parameters through the body

	var exact_method = path_param[2] + '_put';
	var data = fs.readFileSync('config.json', 'utf8');
	obj = JSON.parse(data);
	var op = obj[exact_method].params;
	var cnt=0;
	var offset=3;
	for(var i in op)
	{
		cnt++;
 		var input = 'param'+cnt;
		var result = op[i][input].split('.');
		if(result[0]=='path')
		{
			if(offset<path_param.length)
			{
				if(str=='')
				{
					str = path_param[offset];
				}
				else
				{
					str = str +","+path_param[offset];
				}
			}
			else
			{
				error_status[result[1]]="path parameter is missing";
				return error_status;	
			}
			offset++;
		}
		else if(result[0]=='query')
		{
			if(query.hasOwnProperty(result[1]))
			{
				if(str=='')
				{
					str = query[result[1]];
				}
				else
				{
					str = str +","+query[result[1]];
				}
			}
			else
			{
				error_status[result[1]]="query parameter is missing";
				return error_status;
			}
		}
		else if(result[0]=='body')
		{
			if(v.hasOwnProperty(result[1]))
			{
				if(str=='')
				{
					str = result[1]+'.json';
				}
				else
				{
					str = str +","+result[1]+'.json';
				}
				var js = v[result[1]];
				jsonfile.writeFileSync(result[1]+'.json', js, {spaces: 2});  // writing into a json file....
			}
			else
			{
				error_status[result[1]]="body parameters are missing";
				return error_status;
			}		
		}	
	}
	var file_name = obj[exact_method].ABLFILE;
 	var filePath = obj[exact_method].ABLFILELOC+file_name;
 	var dlc = obj["PATH"].DLC+'bin/_progres.exe';
 	var append = dlc;
 	if(obj[exact_method].hasOwnProperty("DB"))
 	{
 		append =append + ' -db '+ obj[exact_method].DB;
 	}
 	append = append+' -p '+filePath;
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
			exec(append +' -b');  
		}
		else
		{
			exec(  append + ' -param ' + str+' -b');    
		}
		var response = fs.readFileSync(obj[exact_method].OUTFILE, 'utf8');
		return response;
	}
	else
	{
		error_status["config.json"]="File doesen't exist";
		return error_status;
	}
}



exports.delABL = function(url_get,body_params){
	var js;
	var str='';
	var error_status={};
	var url_parts = url.parse(url_get, true);
	var query = url_parts.query;
	var path_param = url_parts.pathname.split('/'); 
	var v = body_params;
	var data = fs.readFileSync('config.json', 'utf8');
	var obj = JSON.parse(data);
	var exact_method = path_param[2] + '_delete';
	var op = obj[exact_method].params;
	var cnt=0;
	var offset=3;
	for(var i in op)
	{
		cnt++;
 		var input = 'param'+cnt;
		var result = op[i][input].split('.');
		if(result[0]=='path')
		{
			if(offset<path_param.length)
			{
				if(str=='')
				{
					str = path_param[offset];
				}
				else
				{
					str = str +","+path_param[offset];
				}
			}
			else
			{
				error_status[result[1]]="path parameter is missing";
				return error_status;	
			}
			offset++;
		}
		else if(result[0]=='query')
		{
			if(query.hasOwnProperty(result[1]))
			{
				if(str=='')
				{
					str = query[result[1]];
				}
				else
				{
					str = str +","+query[result[1]];
				}
			}
			else
			{
				error_status[result[1]]="query parameter is missing";
				return error_status;
			}
		}
		else if(result[0]=='body')
		{
			if(v.hasOwnProperty(result[1]))
			{
				if(str=='')
				{
					str = result[1]+'.json';
				}
				else
				{
					str = str +","+result[1]+'.json';
				}
				var js = v[result[1]];
				jsonfile.writeFileSync(result[1]+'.json', js, {spaces: 2});  // writing into a json file....
			}
			else
			{
				error_status[result[1]]="body parameters are missing";
				return error_status;
			}		
		}
	}
	var file_name = obj[exact_method].ABLFILE;
 	var filePath = obj[exact_method].ABLFILELOC+file_name;
 	var dlc = obj["PATH"].DLC+'bin/_progres.exe';
 	var append = dlc;
 	if(obj[exact_method].hasOwnProperty("DB"))
 	{
 		append =append + ' -db '+ obj[exact_method].DB;
 	}
 	append = append+' -p '+filePath;
	if(fileExists(filePath)) // file is present
	{
		// spawn and exec the progress command.......
		const exec = require('child_process').execSync;
		if(str=='')
		{
			exec(append +' -b');  
		}
		else
		{
			exec(append + ' -param ' + str+' -b');    
		}
		var response = fs.readFileSync(obj[exact_method].OUTFILE, 'utf8');
		return response;
	}
	else
	{
		error_status["config.json"]="File doesen't exist";
		return error_status;
	}
}


// uplaod a zip file that has *.p files.......
exports.upload_file = function(f_name)
{
	if(!f_name)
	{
		return 'NO file exists';
	}
	var tempfile = f_name.body;
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
			return 'file uploaded!!';
		}
	});	
}
