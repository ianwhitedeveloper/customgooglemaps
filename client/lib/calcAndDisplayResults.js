let $ = require('jquery');

function calcPercent([partial, total]) {
	let result = Math.round((partial / total) *100 );
	return isNaN(result) ? 0 : result;
}

function calcAndDisplayResults(results, scope, state=false) {
	var totalVotes = state ? results.states[scope].total_votes : results[scope].total_votes;
	var totalRed = state ? results.states[scope].votes.red : results[scope].votes.red;
	var totalBlue = state ? results.states[scope].votes.blue : results[scope].votes.blue;
	var totalPurple = state ? results.states[scope].votes.purple : results[scope].votes.purple;


	$('.cup.red').text(`Red: ${calcPercent([totalRed, totalVotes])}%`);
	$('.cup.blue').text(`Blue: ${calcPercent([totalBlue, totalVotes])}%`);
	$('.cup.purple').text(`Purple: ${calcPercent([totalPurple, totalVotes])}%`);
}

module.exports = calcAndDisplayResults;