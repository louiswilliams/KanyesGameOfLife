var socket = io(); 

function mapCoordToPixel(latitude, longitude) {
    origin = {

        latitude: 48.98,
        longitude: -124.771694
    }

	//pixels per degree longitude
    xscale = $("#map").width() / 59;
    //pixels per degree latitude
    yscale = $("#map").height() / 26.5;	
    return {
        x: parseInt(xscale * (longitude - origin.longitude) ),
        y: parseInt(yscale * (origin.latitude - latitude) + 23	)
    }
}

//var chicago = mapCoordToPixel(41.764391, -87.784413);
//console.log(chicago);

function verticalCenter($div) {
	//console.log("repositioning");
	var height = $div.parent().height() - $div.height();
	$div.css('top', (Math.max(60,height)) / 2);
}


function startStream(query) {
	socket.emit('queryStream', {query: query});
	socket.on('twitterStream', function (msg) {
		console.log(msg);

		spawnPoint(msg);
		addCard(msg);
	})
}



$(document).ready(function() {

	startStream('iHeartRadio', function(data) {
		//console.log(data);
		//code to spawn dots goes here.
		spawnPoint(data);
		addCard(data);
	});

	$query = $("#query");
	startStream($query.val());


	$("#arrows").on("click", function() {
		$('#description')[0].scrollIntoView(true);
	})

	$("#query").keypress(function(e) {
		if (e.keyCode == 13) {
			d3.select('svg').text('');
			socket.emit('disconnect');
			startStream($query.val());
		}
	})
	$map = $("#map");
	$map.load(function() {
		verticalCenter(this);
	});
	//resize map properly
	var width = Math.min(window.innerWidth - 350, 1280);
	$map.width(width);
	$map.css("background-size", width + "px")


	//document.getElementById("canvas").removeAttribute("width");
	//document.getElementById("canvas").removeAttribute("height");



	$(window).resize(function() {
		verticalCenter($map);
	});

	arrowControl();
	$(window).scroll(arrowControl);
		

	/*var dotsToPlot = 
	[[41.764391, -87.784413, 1],
	[40.762193, -73.588426, -1],
	[37.128000, -121.956873, 1],
	[33.776528, -84.396686, 1],
	[25.779387, -80.207391, 1]];

	var points = d3.select("#canvas")
		.selectAll("g")
		.data(dotsToPlot)
		.enter().append("g")
		.attr("class", "ping")
		.attr("transform", function(d) {
			var coord = mapCoordToPixel(d[0], d[1]);
			console.log(coord);
			return "translate(" + coord["x"] + "," + coord["y"] + ")";
		});

	var glow = points.append("circle")
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", function(d) {
			var color = scoreToRGB(d[2]);
			return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
		})
		.attr("r", "15");
	
	glow.append("animate")
		.attr("attributeType", "XML")
		.attr("attributeName", "r")
		.attr("from", "15")
		.attr("to", "20")
		.attr("dur", "1s")
		.attr("fill", "freeze");
	glow.append("animate")
		.attr("attributeType", "CSS")
		.attr("attributeName", "stroke-opacity")
		.attr("from", "1")
		.attr("to", "0")
		.attr("dur", "1s")
		.attr("fill", "freeze");

	var dot = points.append("circle")
		.attr("class", "dot")
		.attr("opacity", "1")
		.attr("fill", function(d) {
			var color = scoreToRGB(d[2]);
			return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
		})
		.attr("r", "15")
		.attr("mask", "url(#dotmask)")
		.transition()
			.attr("opacity", ".5")
			.duration(2000);*/
});

function arrowControl() {
	var arrow = $("#arrowWrap");
	var map = $("#mapwrap");

	var offset = window.innerHeight - (-window.pageYOffset + map.height() + map.position().top);
	if(offset > 0) {
		//map portion is above the bottom of the screen
		arrow.css("bottom", 10 + "px");
	} else {
		arrow.css("bottom", -offset + 10 + "px");
	}
}

function addCard(datapoint) {
	var message = datapoint.text;
	var user = datapoint.user.screen_name;
	var name = datapoint.user.name;

	var data = {msg: message, usr: user, name:name};
	var cards = [];
	cards.push(data);
	
	var card = d3.select("#list")
		.insert("div", ":first-child")
			.data(cards)
			.attr("class", "card")
	
	var handle = card.append("a")
		.attr("href", function(d) {
			return "https://twitter.com/" + d.usr;
		})
		.attr("class", "handle")
	handle.append("strong")
		.text(function(d) {
			return "@" + d.usr;
		});
	handle.append("div")
		.text(function(d) {
			return "  " + d.name;
		})


	card.append("p")
		.text(function(d) {
			return d.msg;
		})
}
function spawnPoint(datapoint) {
	var datapointArray = [];
	datapointArray.push(datapoint);



	var point = d3.select("#canvas")
		.append("g")
		.data(datapointArray)
		.attr("class", "point")
		.attr("transform", function(d) {
			//var coord = mapCoordToPixel(d.x, d.y);
			//console.log(coord);
			//console.log(d);
			var lat = d.coordinates.coordinates[1];
			var lon = d.coordinates.coordinates[0];
			var coord = mapCoordToPixel(lat, lon)
			return "translate(" + coord.x + "," + coord.y + ")";
		});

	var glow = point.append("circle")
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", function(d) {
			var color = scoreToRGB(d.score);
			return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
		})
		.attr("r", "15")
		.attr("stroke-opacity", "1");
	/*glow.append("animate")
		.attr("attributeType", "XML")
		.attr("attributeName", "r")
		.attr("from", "10")
		.attr("to", "15")
		.attr("dur", "3s")
		.attr("fill", "freeze");*/
	/*glow.append("animate")
		.attr("attributeType", "CSS")
		.attr("attributeName", "stroke-opacity")
		.attr("from", "1")
		.attr("to", "0")
		.attr("dur", "1s")
		.attr("fill", "freeze");*/

	var enlarge = glow.transition()
		.attr("r", "20")
		.ease("linear")
		.duration(250);
		
	
	enlarge.transition()
		.attr("stroke-opacity", "0");


	var dot = point.append("circle")
		.attr("class", "dot")
		.attr("opacity", "1")
		.attr("fill", function(d) {
			var color = scoreToRGB(d.score);
			return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
			//return "#FF0000";
		})
		.attr("r", "15")
		.attr("mask", "url(#dotmask)")
		.transition()
			.attr("opacity", ".5")
			.duration(2000);

}

function scoreToRGB(score) {
	var red = 255, green = 255, blue = 0;
	
	if (score <= 0) {
		green += 255 * score;
	} else if (score > 0) {
		red -= 255 * score;
	}

	/*var green = 0;
	var red = 0;
	var blue = 0;

	if(score >= 0) {
		red = score * 255;
		blue = 255-red;
	} else {
		blue = -score * 255;
		red = 255-blue;
	}*/

	/*if(score >= 0) {
		red = 255;
		green = 255 - (255*score);
		blue = 255 - (255*score);
	} else {
		blue = 255;
		red = 255*score;
		green = 255*score;
	}*/
	

	return {
		r: Math.floor(red),
		g: Math.floor(green),
		b: Math.floor(blue)
	}
}	
