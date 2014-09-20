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
			console.log("here");

			var dotsToPlot = 
			[[41.764391, -87.784413],
			[40.762193, -73.588426],
			[37.128000, -121.956873],
			[33.776528, -84.396686]];

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
				.attr("class", "glow")
				.attr("r", "7");
			
			glow.append("animate")
				.attr("attributeType", "XML")
				.attr("attributeName", "r")
				.attr("from", "7")
				.attr("to", "10")
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
				.attr("r", "6")
				.attr("fill", "url(#dotfill)");
		});