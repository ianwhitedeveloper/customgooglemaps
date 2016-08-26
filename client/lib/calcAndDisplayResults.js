let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let redCupEl = require('./CONSTANTS').redCupEl,
	blueCupEl = require('./CONSTANTS').blueCupEl,
	purpleCupEl = require('./CONSTANTS').purpleCupEl,
	bannerEl = require('./CONSTANTS').bannerEl,
	directionsEl = require('./CONSTANTS').directionsEl;
	

function calcPercent([partial, total]) {
	let result = Math.round((partial / total) *100 );
	return isNaN(result) ? 0 : result;
}

function calcAndDisplayResults({results, scope}) {
	try {
		let resultsObject = 	scope ? 
								results.states[scope] ? 
									results.states[scope] : 
									results[scope]
								:
								results;

		let totalVotes 	= resultsObject.total_votes,
			totalRed 	= resultsObject.votes.red,
			totalBlue 	= resultsObject.votes.blue,
			totalPurple = resultsObject.votes.purple,
			winner 		= resultsObject.winner,
			address 	= resultsObject.address || '',
			bannerText	= 	resultsObject.address || 
							resultsObject.state_name || 
							scope;


		redCupEl.html(`${calcPercent([totalRed, totalVotes])}<sup>%</sup>`);
		blueCupEl.html(`${calcPercent([totalBlue, totalVotes])}<sup>%</sup>`);
		purpleCupEl.html(`${calcPercent([winner, totalVotes])}<sup>%</sup>`);
		sElEvtEmitter.emit('updateBannerText', {bannerText: bannerText, address: address, winner: winner});
	}
	catch (e) {
		console.warn(e);
		sElEvtEmitter.emit('updateBannerText', {bannerText: 'No Results'});
	}
}

function updateBannerText({bannerText, address='', winner}) {
	bannerEl.text(bannerText);
	bannerEl.attr('data-winner', winner);
	directionsEl.text(address);
}

sElEvtEmitter.on('updateBannerText', updateBannerText);

module.exports = calcAndDisplayResults;