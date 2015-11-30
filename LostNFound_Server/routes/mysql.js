var ejs = require('ejs');
var mysql = require('mysql');
function getConnection(){
	var connection = mysql.createConnection({
	/*	host : 'us-cdbr-iron-east-03.cleardb.net',
		port : 3306 , 
		user : 'b8cd2644306e66',
		password : 'a7b29589',
		database : 'ad_62239dae15da89c' */
		
		host : 'localhost',
		port : 3306 , 
		user : 'root',
		password : '123456',
		database : 'lostnfound' 
	});
	return connection ;
}


function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	


var executequery = function(callback, query, param){
	//var con = getSQLConnection();
	var con = getConnection();
	con.query(query,param , function(err, rows, fields) {
			if (err) {
				console.log("ERROR in fetching the data");
			} else {
				console.log("no rows");
				callback(err,rows);
			}
		});
	con.end();
	
};


exports.fetchData=fetchData;
exports.executequery=executequery;
