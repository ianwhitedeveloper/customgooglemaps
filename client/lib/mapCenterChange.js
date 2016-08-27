let map = require('../lib/map');
let $ = require('jquery');
let debounce = require('es6-promise-debounce');

let debouncedFunction = debounce(function(center) {
    return new Promise(function(resolve) {
        resolve(center);
    });
}, 600);

map.addListener('center_changed', function debounceMapCenter() {
	debouncedFunction(map.getCenter())
	.then(center => { 
		// console.log('this one should be executed'); 
		console.log(center.lat());
		console.log(center.lng());
	});
});
