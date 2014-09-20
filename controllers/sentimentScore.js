var sentiment = require('sentiment');

function textToScore(text) {
    result1 = sentiment(text);
    console.log(result1);

    score = result1.score / 10;

    if (score > 1) score = 1;
    if (score < -1) score = -1;
    return score;
}

//console.log(textToScore("Beyonce's got a big ole ass fucking bitch mother fucker hatred"));
// on client side convert score to rgb using this commented out code
// var red = 255, green = 255, blue =0;
// if (score <= 0) {
//     green += 255 * score;
// } else if (score > 0) {
//     red -= 255 * score;
// }
// console.log(red + ", " + green + ", " + blue);