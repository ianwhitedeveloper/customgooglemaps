let $ = require('jquery');
let API_URL = 'https://api-test.7-eleven.com/v3/election/stores/';
let redCupEl = $('.cup_results_container.red .percentage span');
let blueCupEl = $('.cup_results_container.blue .percentage span');
let purpleCupEl = $('.cup_results_container.purple .percentage span')
let bannerEl = $('.results .banner .location');
let directionsEl = $('.results .directions');
let colorKey = {
	purple: '#4F2169',
	red: '#DA1F31',
	blue: '#0099DD'
};

module.exports = {
	API_URL,
	redCupEl,
	blueCupEl,
	purpleCupEl,
	bannerEl,
	directionsEl,
	colorKey
}