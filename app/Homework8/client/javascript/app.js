var main = function() {
    var $result,
        url,
        link,
        index,
        userUrl;

    //parse the json string to be able to get or to link to long url 
    function checkinput (link) {
        index = link.indexOf("localhost:3000");

        if(index > -1) {
            //posturl = posturl.replace("http://localhost:3000/", "");
            link = link.replace("localhost:3000", "");
        }

        return link;
    }

    getTopList();


    $("#button").click(function() {
        url = $("#url").val();
        if (url === '') {
            alert("Empty url, please enter url.");
        }
        else {
            userUrl = JSON.stringify({url0:url});
            $.ajax({
                type: "POST",  //post to server.js
                url: "/geturl",    //route
                contentType: "application/json; charset=utf-8",
                dataType: "json",  //json type
                data: userUrl
            })
            .done(function (data, status) {
                $("#result").html(""); //html added
                //inserts link into dom
                link = checkinput(data.url);
                $("#result").append("<a href = "+ link + ">" + data.url + "</a>");  
            })
            .fail(function (data, status){
                console.log("Call is fail");
            });
        }
    });

};

function getTopList() {
	$.getJSON("/getList", function (data){
		var i, shrink;
		$("#visit").empty();
		var $result = $("<ol>");
		//$("#visit").append($result);
		for(i = 0; i < data.length; i++){
			shrink = data[i].short;
			shrink = shrink.replace("localhost:3000", "");
			$result.append("<li><a href = "+ shrink + "> URL: " + data[i].short + "</a> " + " Views: " + data[i].count + "</li>");
		}
		$("#visit").append($result);
	});
}


$(document).ready(main);