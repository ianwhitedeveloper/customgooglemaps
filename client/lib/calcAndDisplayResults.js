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

		let totalVotes = resultsObject.total_votes;
		let totalRed = resultsObject.votes.red;
		let totalBlue = resultsObject.votes.blue;
		let totalPurple = resultsObject.votes.purple;
		let bannerText = resultsObject.address || resultsObject.state_name;
		let address = resultsObject.address || '';


		redCupEl.text(`Red: ${calcPercent([totalRed, totalVotes])}%`);
		blueCupEl.text(`Blue: ${calcPercent([totalBlue, totalVotes])}%`);
		purpleCupEl.text(`Purple: ${calcPercent([totalPurple, totalVotes])}%`);
		sElEvtEmitter.emit('updateBannerText', {bannerText: bannerText, address: address});
	}
	catch (e) {
		console.warn(e);
	}
}

function updateBannerText({bannerText, address=''}) {
	bannerEl.text(bannerText);
	directionsEl.text(address);
}

sElEvtEmitter.on('updateBannerText', updateBannerText);

module.exports = calcAndDisplayResults;