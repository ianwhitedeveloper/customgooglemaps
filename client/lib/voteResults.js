let $ = require('jquery');
let geocoderInit = require('./geocoderInit');

let searchCache = {};
let searchBoxInput = $('input[name="cityzip"]');

$('body').on('click', '#findAStore', (e) => {
	console.log(searchBoxInput.val());
	geocoderInit(searchBoxInput.val()).done((o) => { console.log(o);});

	/*if(!cache[state]) {
	    cache[state] = $.get(`https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=${state}`).promise();
	} 
	cache[state].done(callback);*/
});


/*let cache = {};
// $.when($.get('https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=TX')).then(drawToDOM);
let callbacks = {
	enableSeachBox: function enableSeachBox(res) {
		$('.search_box input').prop('disabled', false);
	}
}

module.exports = function loadVoteResults({state='TX', callback=callbacks.enableSeachBox} = {}) {
    if(!cache[state]) {
        cache[state] = $.get(`https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=${state}`).promise();
    } 
    cache[state].done(callback);
}*/
