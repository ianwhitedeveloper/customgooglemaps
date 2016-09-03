let $ = require('jquery');
let API_URL = 'https://api.7-eleven.com/v3/election/stores/';
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
let stateMetaEl = $('meta[name=currentState]');
let cityMetaEl = $('meta[name=currentCity]');
let bannerCtaEl = $('.banner_cta a');
let generalErrorMsg = 'Location not found: your search returned no results';
let isIE = navigator.userAgent.match('MSIE');
let isIE11= navigator.userAgent.toLowerCase().indexOf('trident') > -1;
let RESULTS_ZOOM_LVL = 10;
let STATE_ZOOM_LVL = 9;

module.exports = {
	API_URL,
	redCupEl,
	blueCupEl,
	purpleCupEl,
	bannerEl,
	directionsEl,
	colorKey,
	stateMetaEl,
	bannerCtaEl,
	cityMetaEl,
	generalErrorMsg,
	isIE,
	isIE11,
	RESULTS_ZOOM_LVL,
	STATE_ZOOM_LVL
}