let $ = require('jquery');
let geocoderInit = require('./geocoderInit');

let cache = {};
let searchBoxInput = $('input[name="cityzip"]');

$('body').on('click', '#findAStore', (e) => {
	console.log(searchBoxInput.val());
	geocoderInit(searchBoxInput.val()).done(getData);

	/*if(!cache[state]) {
	    cache[state] = $.get(`https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=${state}`).promise();
	} 
	cache[state].done(callback);*/
});

function getData(resultsArray) {
	console.log(resultsArray[0]);
	let result = resultsArray[0];
	let lat = result.geometry.location.lat();
	let lng = result.geometry.location.lng();
	$.get(`https://api-test.7-eleven.com/v3/election/stores/?lat=${lat}&lon=${lng}`)
		.done((r) => {
			console.log(r);
		});
}



// $.when($.get('https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=TX')).then(drawToDOM);
/*let callbacks = {
	enableSeachBox: function enableSeachBox(res) {
		$('.search_box input').prop('disabled', false);
	}
}

module.exports = function loadVoteResults({state='TX', callback=callbacks.enableSeachBox} = {}) {
    if(!cache[state]) {
        cache[state] = $.get(`https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=${state}`).promise();
    } 
    cache[state].done(callback);
}

if(!cache[result.formatted_address]) {
	    cache[result.formatted_address] = $.get(`https://api-test.7-eleven.com/v3/election/stores/?lat=${lat}&lon=${lng}`).promise();
	} 
	cache[result.formatted_address].done((r) => {
		let c = cache;
			debugger;
		});

*/