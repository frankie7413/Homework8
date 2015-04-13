var express = require("express"),
	http = require("http"),
	redis = require("redis"),
	redisClient,
	bodyParser = require('body-parser'),
	key,
	app = express();

var _ = require('underscore');

//redis client
client = redis.createClient();

//indext.hmtl file
app.use(express.static(__dirname + "/client"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

http.createServer(app).listen(3000);
console.log("sever started at localhost:3000");

//generate url 
function randomURL () {
	// body...
	//http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
	//var text = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
	var text = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
	return text;
}


//when person enters url check if it exist or is a shortened url or new url to shorten
app.post("/geturl", function (req, res) {
	console.log("post called");
	//get the url from json
	var posturl = req.body.url0;
	var index = posturl.indexOf("localhost:3000"); //check if input is min url 
	if(index > -1)
	{
		//if user enters shorted url find the original to output
		//posturl = posturl.replace("http://localhost:3000/", "");
		client.get("short:" + posturl, function (err, original){
			if(err !== null){
				console.log("Error:" + err);
				return;  //error handling
			}
			else if(original === null){
				console.log("URL does not exist in the database");
				return;
			}
			else {
				//returns original long url 
				res.json({"url":original});
			}
		});

	}
	else
	{
		//what if url has been entered before? can we just returned a genrated one?
		//client.get(long)
		//if found do or else do the rest huh yup 
		//process the long url to shorten

		//check to see if long url already exist!
		posturl = "https://" + posturl;
		client.get("long:" + posturl, function (err, shorten){
			if(err !== null){
				console.log("Error:" + err);
				return;
			}
			else if(shorten === null){
				var sorturl = "localhost:3000/" + randomURL();
				client.set("short:" + sorturl, posturl);
				client.set("long:" + posturl,  sorturl);

				res.json({"url":sorturl});
				//new link to insert
				//long not exist
			}
			else{
				//return previously created short
				res.json({"url":shorten});
			}
		});
	}
	//res.json({"url":"test"});
	console.log("post suceesful");
});



//shuld update views of data on redis and send user to original url 
//http://expressjs.com/api.html
app.get("/:url", function (req, res){
	console.log("get called is called");
	var shorturl = req.params.url;
	var valueincr = 1,
		orignalurl;

	shorturl = "localhost:3000/" + shorturl;

	//assuming the original website they link exist and works
	client.get("short:" + shorturl, function (err, original){
		if(err !== null){
			console.log("Error:" + err);
			return;  //error handling
		}
		else if(original === null){
			console.log("URL does not exist in the database:");
			return;
		}
		else {
			//returns original long url 
			orignalurl = original;
		}
	});

	//check to see if it exist in views 
	//if exist add 1 to the value of it
	//else create one and set value to 1
	client.get("view:" + shorturl, function (err, value) {
		if(err !== null){
			console.log("Error:" + err);
			return;
		}
		else if(value === null){
			//create view for the link set to 1 value
			//creat zadd 
			client.set("view:" + shorturl, valueincr);
			client.zadd('link', valueincr, shorturl);
		}
		else{
			//increase value by 1 create zadd
			valueincr = parseInt(value, 10);
			valueincr = valueincr + 1;
			//set view to new value
			client.set("view:" + shorturl, valueincr);
			client.zadd('link', valueincr, shorturl);
		}
		res.redirect(orignalurl);
	});
});

//https://ricochen.wordpress.com/2012/02/28/example-sorted-set-functions-with-node-js-redis/
//http://stackoverflow.com/questions/2295496/convert-array-to-json
app.post("/getList", function (req, res){
	client.zrevrange('link', 0, -1, function (err, reply){
		var list =_.groupBy(reply, function(a,b) {
			return b;
      		// return Math.floor(b/2);
  		});
		res.json(JSON.stringify(list));
		console.log("list passed");
	});
});


