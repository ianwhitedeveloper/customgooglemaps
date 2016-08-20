let jQuery = require('jquery');
let $ = require('jquery');
let map = require('../lib/map');
let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let mapOptions = require('../lib/mapOptions');
let setResults = require('../lib/AddMapBoundaries').setResults;
let init = require('../lib/AddMapBoundaries').init;

$(document).ready(function(){
	    //set your google maps parameters
		//you can use any,location as center on map startup
		//google map custom marker icon - .png fallback for IE11
	let	isInternetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1,
		marker_url = ( isInternetExplorer11 ) ? 
			'imgs/cd-icon-location.png' : 
			// 'imgs/cd-icon-location.svg',
			'imgs/cd-icon-location.png',
		marker,
		zoomControlDiv = document.createElement('div'),
		zoomControl,
		contentString,
		infowindow,
		hash = (location.href.split("#")[1] || null);
	

	$.when($.get('/external/boundariesFromGeoJson.json'), $.get('/external/dummyStateResults.json'))
	.then((usBounds, results) => {
		init({
			bounds: usBounds[0],
			results: results[0],
			scope: hash || 'national',
			boundaryId: hash || 'united states'
		});
	});

	/*//add a custom marker to the map				
	marker = new google.maps.Marker({
	  	position: defaultLatitudeLongitude,
	    map: map,
	    visible: true,
	 	icon: marker_url,
	});

    marker.addListener('click', function() {
      map.setZoom(8);
      map.setCenter(marker.getPosition());
    });*/


	zoomControl = new CustomZoomControl(zoomControlDiv, map);

	//insert the zoom div on the top left of the map
	map.controls[google.maps.ControlPosition.LEFT_CENTER].push(zoomControlDiv);
	

	/*contentString = 	`<div class="state_info">
							<h1>Header Lorem Ipsum</h1>
							<div style="text-align: center;">
								<img src="imgs/cd-icon-location.png">
							</div>
							<div style="text-align: center;">
								<img src="imgs/cd-icon-location.png">
							</div>
							<div style="text-align: center;">
								<img src="imgs/cd-icon-location.png">
							</div>
						</div>`;

	infowindow = new google.maps.InfoWindow({
      content: contentString
    });

	marker.addListener('click', () => {
		infowindow.open(map, marker);
	});*/

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

  