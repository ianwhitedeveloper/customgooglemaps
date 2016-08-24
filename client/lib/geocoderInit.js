let map = require('../lib/map');
let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;

function geocoderInit(boundaryName) {
	let deferred = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': `${boundaryName}`}, deferred.resolve);
	deferred.then(fitBounds);
	return deferred.promise();
}

function fitBounds(results) {
	sElEvtEmitter.emit('boundTheMap', 
		{
			scope: 
			results[0].address_components[2] ?
			results[0].address_components[2].short_name :
			results[0].address_components[0].short_name
		});
	map.fitBounds(results[0].geometry.viewport);
};

module.exports = geocoderInit;