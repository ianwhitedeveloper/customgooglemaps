let $ = require('jquery');

function calcPercent([partial, total]) {
	let result = Math.round((partial / total) *100 );
	return isNaN(result) ? 0 : result;
}

function calcAndDisplayResults({results, scope}) {
	try {
		let resultsObject = results.states[scope] ? results.states[scope] : results[scope];

		let totalVotes = resultsObject.total_votes;
		let totalRed = resultsObject.votes.red;
		let totalBlue = resultsObject.votes.blue;
		let totalPurple = resultsObject.votes.purple;


		$('.cup.red').text(`Red: ${calcPercent([totalRed, totalVotes])}%`);
		$('.cup.blue').text(`Blue: ${calcPercent([totalBlue, totalVotes])}%`);
		$('.cup.purple').text(`Purple: ${calcPercent([totalPurple, totalVotes])}%`);
	}
	catch (e) {
		console.warn(e);
	}
}

module.exports = calcAndDisplayResults;