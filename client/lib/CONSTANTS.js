let $ = require('jquery');
let TEST_API_URL = 'https://api-test.7-eleven.com/v3/election/stores/';
let redCupEl = $('.cup.red .percentage');
let blueCupEl = $('.cup.blue .percentage');
let purpleCupEl = $('.cup.purple .percentage')
let bannerEl = $('.results .banner');
let directionsEl = $('.results .directions');
let stateSelectEl = $('.state_select');

module.exports = {
	TEST_API_URL,
	redCupEl,
	blueCupEl,
	purpleCupEl,
	bannerEl,
	directionsEl,
	stateSelectEl
}