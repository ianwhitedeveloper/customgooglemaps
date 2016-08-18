let jQuery = require('jquery');
let $ = require('jquery');
let map = require('../lib/map');
let boundariesFromGeoJson = require('../lib/boundariesFromGeoJson');
let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let mapOptions = require('../lib/mapOptions');
let AddMapBoundaries = require('../lib/AddMapBoundaries');
let InfoBox =  require('../lib/infobox');

$(document).ready(function(){
	    //set your google maps parameters
		//you can use any,location as center on map startup
		//google map custom marker icon - .png fallback for IE11
	var	isInternetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1,
		marker_url = ( isInternetExplorer11 ) ? 
			'imgs/cd-icon-location.png' : 
			// 'imgs/cd-icon-location.svg',
			'imgs/cd-icon-location.png',
		marker,
		zoomControlDiv = document.createElement('div'),
		zoomControl,
		contentString,
		infowindow;
	
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
	

	contentString = 	`<div class="state_info">
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

    /*var ibOptions = {
		disableAutoPan: false
		,maxWidth: 0
		// ,pixelOffset: new google.maps.Size(-140, 0)
		,zIndex: null
		,boxStyle: {
      padding: "0px 0px 0px 0px",
      width: "252px",
      height: "40px",
      backgroundColor: '#fff',
      color: '#000'
    },
    closeBoxURL : "",
    infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: "floatPane",
		enableEventPropagation: false
	};
	marker.addListener('click', function() {
        var source   = $("#infobox-template").html();
        var template = 'hi';
 
        var boxText = document.createElement("div");
        boxText.style.cssText = "margin-top: 8px; background: #fff; padding: 0px;";
        boxText.innerHTML = 'hi ho silver';
 
		ibOptions.content = 'wtf';
        
		var ib = new InfoBox(ibOptions);
      	ib.open(map, marker);
        map.panTo(ib.getPosition());
	  });*/


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

  