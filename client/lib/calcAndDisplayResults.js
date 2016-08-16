let $ = require('jquery');

function calcPercent([partial, total]) {
	return Math.round((partial / total) *100 );
}

module.exports = function calcAndDisplayResults([results, scope]) {
	var totalVotes = results[scope].total_votes;
	var totalRed = results[scope].votes.red;
	var totalBlue = results[scope].votes.blue;
	var totalPurple = results[scope].votes.purple;


	$('.cup.red').text(`Red: ${calcPercent([totalRed, totalVotes])}%`);
	$('.cup.blue').text(`Blue: ${calcPercent([totalBlue, totalVotes])}%`);
	$('.cup.purple').text(`Purple: ${calcPercent([totalPurple, totalVotes])}%`);
}