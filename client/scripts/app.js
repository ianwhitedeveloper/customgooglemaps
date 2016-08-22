let jQuery = require('jquery');
let $ = require('jquery');
let map = require('../lib/map');
let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let mapOptions = require('../lib/mapOptions');
let voteResults = require('../lib/voteResults');
let setResults = require('../lib/AddMapBoundaries').setResults;
let init = require('../lib/AddMapBoundaries').init;

$(document).ready(function(){
	    //set your google maps parameters
		//you can use any,location as center on map startup
		//google map custom marker icon - .png fallback for IE11
	let	isInternetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1,
		marker_url = 'imgs/cd-icon-location.png',
		/*marker_url = ( isInternetExplorer11 ) ? 
			'imgs/cd-icon-location.png' : 
			'imgs/cd-icon-location.svg',*/
		marker,
		zoomControlDiv = document.createElement('div'),
		zoomControl,
		contentString,
		infowindow,
		hash = (location.href.split("#")[1] || null);
	

	$.when($.get('/external/boundariesFromGeoJson.json'), $.get('/external/dummyStateResults.json'))
	.then((usBounds, results) => {
		if (hash) { hash = hash.toUpperCase(); }
		init({
			bounds: usBounds[0],
			results: results[0],
			scope: hash || 'national',
			boundaryId: hash || 'united states'
		});
	});

	/*let bounds = new google.maps.LatLngBounds();

    // Multiple Markers
    let markers = [
        {title: 'Austin', lat: 30.2672, lng: -97.7431},
        {title: 'Austin', lat: 30.3111, lng: -97.7501},
        {title: 'Austin', lat: 30.2692, lng: -97.8431},
        {title: 'Austin', lat: 30.2694, lng: -97.8461},
    ];

    // Loop through our array of markers & place each one on the map  
    for(let i = 0; i < markers.length; i++ ) {
        let position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i].title,
            icon: marker_url
        });
        
        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }
*/

	zoomControl = new CustomZoomControl(zoomControlDiv, map);

	//insert the zoom div on the top left of the map
	map.controls[google.maps.ControlPosition.LEFT_CENTER].push(zoomControlDiv);
	
	//add custom buttons for the zoom-in/zoom-out on the map
	function CustomZoomControl(controlDiv, map) {
		//grap the zoom elements from the DOM and insert them in the map 
	  	var controlUIzoomIn= document.getElementById('cd-zoom-in'),
	  		controlUIzoomOut= document.getElementById('cd-zoom-out');
	  	controlDiv.appendChild(controlUIzoomIn);
	  	controlDiv.appendChild(controlUIzoomOut);

		// Setup the click event listeners and zoom-in or out according to the clicked element
		google.maps.event.addDomListener(controlUIzoomIn, 'click', function() {
		    map.setZoom(map.getZoom()+1)
		});
		google.maps.event.addDomListener(controlUIzoomOut, 'click', function() {
		    map.setZoom(map.getZoom()-1)
		});
	}

});

  