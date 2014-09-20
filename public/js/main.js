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

var chicago = mapCoordToPixel(41.764391, -87.784413);
console.log(chicago);