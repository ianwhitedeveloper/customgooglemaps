let jQuery = require('jquery');
let $ = require('jquery');
let map = require('../lib/map');
let boundariesFromGeoJson = require('../lib/boundariesFromGeoJson');
let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let mapOptions = require('../lib/mapOptions');
// let loadBoundariesFromGeoJson = require('../lib/loadBoundariesFromGeoJson');
// let boundTheMap = require('../lib/boundTheMap');
// let initializeDataLayer = require('../lib/initializeDataLayer');
let AddMapBoundaries = require('../lib/AddMapBoundaries');

jQuery(document).ready(function(){
	    //set your google maps parameters
		//you can use any,location as center on map startup
		//google map custom marker icon - .png fallback for IE11
	var	isInternetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1,
		marker_url = ( isInternetExplorer11 ) ? 
			'imgs/cd-icon-location.png' : 
			'imgs/cd-icon-location.svg',
		marker,
		zoomControlDiv = document.createElement('div'),
		zoomControl,
		contentString,
		infowindow;
		// defaultLatitudeLongitude = new google.maps.LatLng(39.8282, -98.5795);
		//we define here the style of the map
				
	
	AddMapBoundaries.loadBoundariesFromGeoJson(boundariesFromGeoJson);

	//add a custom marker to the map				
	marker = new google.maps.Marker({
	  	position: defaultLatitudeLongitude,
	    map: map,
	    visible: true,
	 	icon: marker_url,
	});

    marker.addListener('click', function() {
      map.setZoom(8);
      map.setCenter(marker.getPosition());
    });


	zoomControl = new CustomZoomControl(zoomControlDiv, map);

	//insert the zoom div on the top left of the map
	map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);
	

	contentString = `<h1>hi there!</h1>`;

	infowindow = new google.maps.InfoWindow({
      content: contentString
    });

	marker.addListener('click', () => {
		infowindow.open(map, marker);
	});

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

  