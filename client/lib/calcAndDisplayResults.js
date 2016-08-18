let $ = require('jquery');

function calcPercent([partial, total]) {
	let result = Math.round((partial / total) *100 );
	return isNaN(result) ? 0 : result;
}

function calcAndDisplayResults(results, scope, state=false) {
	let resultsObject;

	state ? resultsObject = results.states[scope] : resultsObject = results[scope];

	let totalVotes = resultsObject.total_votes;
	let totalRed = resultsObject.votes.red;
	let totalBlue = resultsObject.votes.blue;
	let totalPurple = resultsObject.votes.purple;


	$('.cup.red').text(`Red: ${calcPercent([totalRed, totalVotes])}%`);
	$('.cup.blue').text(`Blue: ${calcPercent([totalBlue, totalVotes])}%`);
	$('.cup.purple').text(`Purple: ${calcPercent([totalPurple, totalVotes])}%`);
}

module.exports = calcAndDisplayResults;