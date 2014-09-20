//var socket = io();

function mapCoordToPixel(latitude, longitude) {
    origin = {
        latitude: 48.997431,
        longitude: -124.723134
    }
    return {
        x: parseInt(21.5204 * (longitude - origin.longitude) + 37),
        y: parseInt(27.5368 * (origin.latitude - latitude) + 66)
    }
}

//var chicago = mapCoordToPixel(41.764391, -87.784413);
//console.log(chicago);

$(document).ready(function() {
	var dotsToPlot = 
	[[41.764391, -87.784413, 1],
	[40.762193, -73.588426, -1],
	[37.128000, -121.956873, .5],
	[33.776528, -84.396686, -.5],
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
			return "translate(10,10)";
		});

	var glow = points.append("circle")
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", function(d) {
			var color = scoreToRGB(d[2]);
			return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
		})
		.attr("r", "10");
	
	glow.append("animate")
		.attr("attributeType", "XML")
		.attr("attributeName", "r")
		.attr("from", "10")
		.attr("to", "15")
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
		.attr("opacity", "1")
		.attr("fill", function(d) {
			var color = scoreToRGB(d[2]);
			return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
		})
		.attr("r", "10")
		.attr("mask", "url(#dotmask)")
		.transition()
			.attr("opacity", ".5")
			.duration(2000);
});

function scoreToRGB(score) {
	var red = 255, green = 255, blue =0;
	
	if (score <= 0) {
		green += 255 * score;
	} else if (score > 0) {
		red -= 255 * score;
	}

	return {
		r: Math.floor(red),
		g: Math.floor(green),
		b: Math.floor(blue)
	}
}	