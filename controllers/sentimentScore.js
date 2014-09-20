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