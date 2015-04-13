var express = require("express"),
	http = require("http"),
	mongoose = require("mongodb"),
	bodyParser = require('body-parser'),
	app = express(),
	mongoClient;

//indext.hmtl file & mongoose setup
app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({ extended: false }));

//generate url 
function randomURL() {
	// body...
	//http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
	//var text = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
	var text = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
	return text;
}

//data enters database
//when person enters url check if it exist or is a shortened url or new url to shorten
app.get("/geturl", function (req, res) {

});


//sends user to long url & increments views 
//should update views of data on redis and send user to original url 
//http://expressjs.com/api.html
app.get("/:url", function (req, res){

});


//gets top urls visited 
//https://ricochen.wordpress.com/2012/02/28/example-sorted-set-functions-with-node-js-redis/
//http://stackoverflow.com/questions/2295496/convert-array-to-json
app.post("/getList", function (req, res){

});

