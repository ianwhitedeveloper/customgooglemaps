let $ = require('jquery');
let TEST_API_URL = 'https://api-test.7-eleven.com/v3/election/stores/';
let redCupEl = $('.cup.red');
let blueCupEl = $('.cup.blue');
let purpleCupEl = $('.cup.purple')
let bannerEl = $('.results .banner');
let directionsEl = $('.results .directions');

module.exports = {
	TEST_API_URL,
	redCupEl,
	blueCupEl,
	purpleCupEl,
	bannerEl,
	directionsEl
}