var ejs = require("ejs");
var mysql = require('./mysql');
var gcm = require('node-gcm');
//var userid;
/*
 * GET users listing.
 */


function addSession(email, sessionId,callback){
	var addsession ="insert into  user_session(email,session_id) values ( ? , ? )" ; 
	var param = [email, sessionId];
	mysql.executequery(function(err, results) {
		if(err){ throw err;	}
		else{
				console.log("session added");
				callback(err,results);
			}
		}, addsession,param);
}



function getSession(callback, sessionId) {
	var getsession = "select * from user_session where session_id = ? " ;
	var param = [sessionId];	
	console.log(getsession);
	mysql.executequery(function(err, results) {
		if(err){ throw err;	}
		else{
			callback(err,results);
		}
	}, getsession, param);	
}

/////////////////////////////////////////////LOGIN//////////////////////////////////////////////////////////////////
exports.login = function login(req,res)
{	
	
	var uname = req.param("username");
	var pwd = req.param("password");
	var lat = req.param("lat");
	var lng = req.param("lng");
	
	console.log("Params are "+uname+" "+pwd+" "+lat+" "+lng);
	var getUser="select * from users where emailid='"+uname+"' and password='" + pwd +"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){								
				console.log("valid Login");	
				updateLocation(uname, lat, lng, function(){
					res.json({
						"code": 200,
						"value" : "success"
					});
				});
			}
			else {    
				console.log("Invalid Login");
				res.json({
					"code": 404,
					"value" : "failure"
				});
			}
		}  
	},getUser);

};

//getFoundItems - get the found items list
exports.getFoundItems = function(req, res){
	
	var query1 = "select * from found join users on found.emailid = users.emailid where flag = -1 order by id desc"; 
	mysql.fetchData(function(err,results){
		if(err){
			console.log("unable to get Found items");
			res.json({
				code : 400
			});
		}
		else 
		{  
			res.json({
				code : 200,
				items : results
			});
		}
	},query1);
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.list = function(req, res){
  res.send("respond with a resource");
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.lost = function(req, res){
	
	var query1 = "select * from lost join users on lost.emailid = users.emailid where flag = -1 order by id desc "; 
	mysql.fetchData(function(err,results){
		if(err){
			console.log("unable to get lost items");
			res.json({
				code : 400
			});
		}
		else 
		{  
			res.json({
				code : 200,
				items : results
			});
		}
	},query1);
};
////////////////////////////////////////////////SHOW DETAILS///////////////////////////////////////////////////////////////////////
exports.showdetails = function(req, res){	
	console.log("show details" + req.param("id") );
	var query1 = "select * from lost join users on lost.emailid = users.emailid where id = " + req.param("id") ;
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{  
			res.send({"details" : JSON.stringify(results)});
		}
	},query1);
};
//
////////////////////////////////////////////////SHOW FOUND DETAILS///////////////////////////////////////////////////////////////////////
exports.showfounddetails = function(req, res){	
	console.log("show found details" + req.param("id") );
	var query1 = "select * from found join users on found.emailid = users.emailid where id = " + req.param("id") ;
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{  
			res.send({"details" : JSON.stringify(results)});
		}
	},query1);
};
/////////////////////////////////////////////HOMEPAGE///////////////////////////////////////////////////////////////////
exports.homepage = function(req, res){
	var query1 = "select CONCAT(firstname , ' ',  lastname) as fullname , mobile,emailid from users where emailid = '" + req.param("useremail") + "'"; 
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{   console.log(results);
			res.send({"results" : JSON.stringify(results)});
		}
	},query1);
};
	
//////////////////////////////////////////////////////////////////////////////////////////////////
//{ "userID": UserSession.GetUser() , "itemname": $scope.data.itemName , "itemdesc": $scope.data.itemDescr , "lostdate": data.itemDate,"losttime": data.itemTime } 
exports.newlostitem = function(req, res){
	var lat = req.param("lat");
	var lng = req.param("lng");
	
	console.log("inside newlostitem");

	var itmnm = req.param("itemname");
	var itmdsc = req.param("itemdesc");
	
	var flag = -1;
	var query="insert into lost(emailid,itemname,itemdesc,flag,date,time,latitude,longitude) values ('" + req.param("userID")  + "', '" + req.param("itemname") + "','" + req.param("itemdesc") + "',"+ flag +",'" + 
	req.param("lostdate") + "','" +  req.param("losttime") + "',"+lat+","+lng+")"; 
	console.log("Query is:"+query);
	mysql.fetchData(function(err,results){
		if (results.insertId > 0){
			console.log("Posted");
			
		    var query = "SELECT A.emailid, B.device_token, ACOS( SIN( RADIANS( A.latitude  ) ) * SIN( RADIANS("+ lat 
		    +") ) + COS( RADIANS( A.latitude ) ) * COS( RADIANS("+ lat +")) * COS( RADIANS( A.langitude  ) - RADIANS("+ lng 
		    +")) ) * 6380 AS distance FROM users  B, users_location A WHERE A.emailid = B.emailid and  ACOS( SIN( RADIANS( A.latitude  ) ) * SIN( RADIANS( " 
		    + lat +") ) + COS( RADIANS( A.latitude  ) ) * COS( RADIANS( "+  lat +" )) * COS( RADIANS(  A.langitude  ) - RADIANS(  "
		    + lng+"  )) ) * 6380 < 1 ORDER BY distance";
			
		    var lost = "Lost"
		    push(query, itmnm, itmdsc,lost, function(){
		    	res.json({
					code : 200
				});
		    });
		}
		else {
			res.json({
        		code : 404
        	});
		}  
	},query); 
};

//addNewFoundItem - Add new found item
exports.addNewFoundItem = function(req, res){
	
	 var lat = req.param("lat");
	 var lng = req.param("lng");    
	 
	 var itmnm = req.param("itemname");
	 var itmdsc = req.param("itemdesc");
     
	console.log("inside addNewFoundItem");
	var flag = -1;
	var getUser="insert into found(emailid,itemname,itemdesc,flag,date,time,latitude,longitude) values ('" + req.param("userID")  + "', '" + req.param("itemname") + "','" + req.param("itemdesc") + "',"+ flag +",'" + 
		req.param("lostdate") + "','" +  req.param("losttime") + "',"+lat+","+lng+")"; 
	console.log("Query is:"+getUser);
	mysql.fetchData(function(err,results){
		if (results.insertId > 0){
			var query = "SELECT A.emailid, B.device_token, ACOS( SIN( RADIANS( A.latitude  ) ) * SIN( RADIANS("+ lat 
		    +") ) + COS( RADIANS( A.latitude ) ) * COS( RADIANS("+ lat +")) * COS( RADIANS( A.langitude  ) - RADIANS("+ lng 
		    +")) ) * 6380 AS distance FROM users  B, users_location A WHERE A.emailid = B.emailid and  ACOS( SIN( RADIANS( A.latitude  ) ) * SIN( RADIANS( " 
		    + lat +") ) + COS( RADIANS( A.latitude  ) ) * COS( RADIANS( "+  lat +" )) * COS( RADIANS(  A.langitude  ) - RADIANS(  "
		    + lng+"  )) ) * 6380 < 1 ORDER BY distance";
				
			 	var found = "Found "
			    push(query, itmnm, itmdsc, found, function(){
			    	res.json({
						code : 200
					});
			    });
			    
		        }
		        else {
		        	res.json({
		        		code : 404
		        	});
		        }  
		},getUser); 
};


//////////////////////////////////////////////////ON DELETE////////////////////////////////////////////	
exports.ondelete = function(req, res){
	var id = req.param("uid");
	console.log(" in ondelete " +id);

};
	
//////////////////////////////////////////////// SignUp /////////////////////////////////////////////////////////

//Is the name of the function login?
exports.signup = function login(req,res)
{	
	var tokenId = req.param("tokenId");
	
	
	var insertUser = "INSERT INTO users (firstname,lastname,password,emailid,mobile,device_token) VALUES ('" +req.param("fname")+ "','"+req.param("lname")+"','"+req.param("password")+ "','" +
						req.param("email")+ "','" +req.param("phone")+ "','"+tokenId+"')";
	
	console.log("Query is: "+insertUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			console.log("Invalid Login");
			res.json({
				code : 400
			});
		}
		else 
		{
			console.log("SignUp success");
			res.json({
				code : 200,
				user_ID : req.param("email")
			});
		}  
	},insertUser);
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateLocation(email, lat, lng, callback)
{  
	
	var query = "INSERT INTO users_location (emailid, latitude, langitude) VALUES ('"+email+"' ,"+lat+","+lng+") ON DUPLICATE KEY UPDATE " +
	 " latitude = VALUES(latitude), langitude = VALUES(langitude)";
	
	mysql.fetchData(function(err,result){
		if(err){
			throw err;
		}
		else 	
		{  
		    console.log("location");
		}
		callback();
	},query); 
};

exports.registerDevice = function(req, res){
	console.log("Service is " + req.param("device_token"));
	res.json({
		code: 200
	});
}
////////////////////////////////////////////////PUSH///////////////////////////////////////////////////////////////////////
function push(query,itmnm, itmdsc, type, callback){	
	
		var device_tokens = []; //create array for storing device tokens
		//var device_tokens = "APA91bG-6WnC1_qLPT3Pq69OEFj2MUxbaI2j9X1kXlBE0NFb9ZHU_k56eO6fCNlDUEIu-qdJ6OWTsiD6YM11aMF2ULhfON78vc8yalCP2auNYsro2jVl0tx8LYOhHwCrR7G-UGYUCyQK"
	    var retry_times = 4; //the number of times to retry sending the message if it fails

	    var sender = new gcm.Sender('AIzaSyBtXqwpDcgQRfkB05emjYLqeooq1Hkw1YE'); //create a new sender
	    var message = new gcm.Message(); //create a new message

	    message.addData('title', type +' Alert - '+itmnm );
	    message.addData('message', itmdsc);
	    message.addData('sound', 'notification');

	    message.collapseKey = 'testing'; //grouping messages
	    message.delayWhileIdle = true; //delay sending while receiving device is offline
	    message.timeToLive = 3; //the number of seconds to keep the message on the server if the device is offline

		

		mysql.fetchData(function(err,result){
			if(err){
				throw err;
			}
			else 	
			{  
				for(var i =0; i<result.length; i++){
					device_tokens.push(result[i].device_token);
					console.log(result[i].device_token);
				}
				sender.send(message, device_tokens, retry_times, function(result){
			        console.log(result);
			        console.log('push sent to: ' + device_tokens);
			    });
			}
			callback();
		},query);  
		
	};
	
	
//deleteFound

	exports.deleteFound = function(req, res){
		
		var id = req.param("id");
		console.log("in delete found" + id);
		var query1 = "update found set flag = 0 where id = "+id; 
		mysql.fetchData(function(err,results){
			if(err){
				console.log("unable to update");
				res.json({
					code : 400
				});
			}
			else 
			{  
				res.json({
					code : 200,
					items : results
				});
			}
		},query1);
	};

//deleteLost
	
exports.deleteLost = function(req, res){
		
		var id = req.param("id");
		console.log(id);
		var query1 = "update lost set flag = 0 where id = "+id; 
		mysql.fetchData(function(err,results){
			if(err){
				console.log("unable to update");
				res.json({
					code : 400
				});
			}
			else 
			{  
				res.json({
					code : 200,
					items : results
				});
			}
		},query1);
	};
