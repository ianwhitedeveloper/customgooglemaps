let $ = require('jquery');
let map = require('./map');
let geocoderInit = require('./geocoderInit');
let calcAndDisplayResults = require('./calcAndDisplayResults');
let TEST_API_URL = require('./CONSTANTS').TEST_API_URL;
let defaultIcon = 'imgs/cd-icon-location.png';
let activeIcon = 'imgs/cd-icon-location-active.png';
let searchBoxInput = $('input[name="cityzip"]');
let cache = {
	markers: []
};

$('body').on('click', '#findAStore', (e) => {
	console.log(searchBoxInput.val());
	geocoderInit(searchBoxInput.val()).done(getData);
});

function getData(resultsArray) {
	let result = resultsArray[0];
	let lat = result.geometry.location.lat();
	let lng = result.geometry.location.lng();
	deleteMarkers();
	$.get(`${TEST_API_URL}?lat=${lat}&lon=${lng}`)
		.done(plotMarkers);
}

function plotMarkers(resultsArray) {
	let bounds = new google.maps.LatLngBounds();
	let marker;
	let marker_url = defaultIcon;

    // Loop through our array of markers & place each one on the map  
    for(let i = 0; i < resultsArray.length; i++ ) {
		let currentResult = resultsArray[i];
        let position = new google.maps.LatLng(currentResult.lat, currentResult.lon);
     	addMarker(position, currentResult);
    }
 	showMarkers();
}

/////////////////////////////////////////////////////
// Helpers                                         //
// Adds a marker to the map and push to the array. //
/////////////////////////////////////////////////////
function addMarker(position, results) {
	var marker = new google.maps.Marker({
		position: position,
		map: map,
		icon: defaultIcon
	});

	google.maps.event.addListener(marker, "click", function () {
	    //alert(this.html);
	    for (var i=0; i<cache.markers.length; i++) {
	       cache.markers[i].setIcon(defaultIcon);
	    }
	    this.setIcon(activeIcon);
	    calcAndDisplayResults({results: results});

	});
	cache.markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < cache.markers.length; i++) {
		cache.markers[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
	setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	cache.markers = [];
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