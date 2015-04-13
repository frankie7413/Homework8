var express = require("express"),
	http = require("http"),
	mongoose = require("mongodb"),
	bodyParser = require('body-parser'),
	app = express(),
	mongodbClient;



//generate short url 
function randomURL() {
	// body...
	//http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
	//var text = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
	var text = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
	text = "localhost:3000/" + text;
	return text;
}

//create connection to db
function connDB(proccess, url, res) {
	var mongoUrl = "mongodb://localhost/shortenedurl";
	mongodbClient.connect(mongoUrl, function(err, db){
		if(err){
			console.log("Error: " + err);
			return;
		}
		var collection = db.collection('url');
		proccess(collection, url, res);
	});
}

//insert longurls db
var insertDB = function(collection, longurl, res) {
	var shorturl, schema;
	shorturl = randomURL();
	longurl = "https://" + longurl;
	schema = {long: longurl, short: shorturl, count: 0};

	//enter into db
	collection.insert(schema, {w:1}, function(err, result){
		if(err){
			console.log("Error: " + err);
			return;
		}
		else{
			res.json("url": shorturl);
		}
	});
} 

//search for item in db
var findURL = function(collection, url, res) {
	var index = url.indexOf("localhost:3000");
	//if url is a short url find long
	if(index > -1){
		collection.findOne({short : url}, function(err, item){
			if(err){
				console.log("Error " + err);
				return;
			}
			else if(item != null){
				res.json({"url":item.long});
			}
			else{
				res.json({"url": "Url not found!"});
			}
		});
	} 
	else {
		collection.findOne({long: url}, function(err, item){
			if(err){
				cosole.log("Error " + err);
				return;
			}
			else if(item != null){
				//return short url from long url 
				res.json({"url": item.short});
			}
			else {
				//if long not in db insert into db
				connDB(insertDB, url, res);
			}
		});
	}
}

var getTopList = function(collection, url, res) {
	collection.aggregate([
		//sort
		{$sort: {count: -1}},

		//get top ten
		{$limit: 10}
	], function(err, topten) {
		if (topten !== null) {
			//return top ten
			res.json(topten);
		}
	});
};



//create db 
mongodbClient = mongodb.MongoClient;

http.createServer(app).listen(3000);
app.use(express.static(__dirname + "/client"));

//body parrser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//data enters database
//when person enters url check if it exist or is a shortened url or new url to shorten
app.post("/geturl", function (req, res) {
	var posturl = req.body.url0;

	console.log("geturl called suces");

});


//sends user to long url & increments views 
//should update views of data on redis and send user to original url 
//http://expressjs.com/api.html
app.get("/:url", function (req, res){
	//search for short in db increment view count & redirect to page 
});


//gets top urls visited 
app.post("/getList", function (req, res){
	//return top 10
});



console.log("Server is listening at localhost:3000");