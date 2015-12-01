var ejs = require("ejs");
var mysql = require('./mysql');
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
	
	getSession(function(err,results) {
		console.log("session - "+ results);
		if(results.length>0){			
			console.log("Got the user in session");
			res.send({"login":"Success"});
		}else{
			
			var getUser="select * from users where emailid='"+req.param("username")+"' and password='" + req.param("password") +"'";
			console.log("Query is:"+getUser);
			
			mysql.fetchData(function(err,results){
				if(err){
					throw err;
				}
				else 
				{
					if(results.length > 0){								
						console.log("valid Login");
						addSession(uname, uname, function(err,results) {
							if(err){
								console.log("Cannt add to session table");
							}else{
								console.log("Added to session table");
							}
						});
						res.send({"login":"Success"});
					}
					else {    
						console.log("Invalid Login");
						res.send({"login":"Fail"});
					}
				}  
			},getUser);
		}		
	}, uname);
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.list = function(req, res){
  res.send("respond with a resource");
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.lost = function(req, res){
	
	var query1 = "select * from lost join users on lost.uid = users.uid order by date desc "; 
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{  
			//console.log(results);
		    //console.log(results[0].itemname);
			res.send({"items" : JSON.stringify(results)});
		}
	},query1);
};
////////////////////////////////////////////////SHOW DETAILS///////////////////////////////////////////////////////////////////////
exports.showdetails = function(req, res){	
	console.log("show details" + req.param("id") );
	var query1 = "select * from lost join users on lost.uid = users.uid where id = " + req.param("id") ;
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
exports.newlostitem = function(req, res){
	console.log("inside newlostitem");
	var getUser="insert into lost(uid,itemname,itemdesc,date,time) values (" + req.session.myid + ", '" + req.param("itemname") + "','" + req.param("itemdesc") + "','" + req.param("lostdate") + "','" +  req.param("losttime") + "')"; 
	console.log("Query is:"+getUser);
	mysql.fetchData(function(err,results){
		if (results.insertId > 0){
		console.log("Successfully Signed up");
		        	res.send({"login":"Success"});
		        }
		        else {
		        	res.send({"login":"Fail"});
		            console.log(err);
		        }  
		},getUser); 
};


//////////////////////////////////////////////////ON DELETE////////////////////////////////////////////	
exports.ondelete = function(req, res){
	var id = req.param("uid");
	console.log(" in ondelete " +id);

};
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////

//Is the name of the function login?
exports.signup = function login(req,res)
{	
	
	var insertUser = "INSERT INTO users (username,password,emailid,phone) VALUES ('" +req.param("name")+ "','" +req.param("password")+ "','" +req.param("email")+ "','" +req.param("phone")+ "')";
	
	console.log("Query is: "+insertUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				//res.session.userid = results[0].uid;
				console.log("valid Signup");
				res.send({"signup":"Success"});
			}
			else {    
				

				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	},insertUser);
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getLocation = function(req,res)
{  
	console.log(req.param("latitude"));
	console.log(req.param("longitude"));
	var query = "update user_location set latitude = '"+req.param("latitude")+  "' ,longitude = '"+req.param("longitude")+  "'  where uid =  2";
	mysql.fetchData(function(err,addmembersresult){
		if(err){
			throw err;
		}
		else 	
		{  
		    console.log("location");
		    res.send({"db" : "sendingg"});
			//res.send({"gid": JSON.stringify(req.session.gid) });
			console.log("added location");
		}
	},query); 
	
};