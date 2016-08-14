let jQuery = require('jquery');
let boundariesFromGeoJson = require('../lib/boundariesFromGeoJson');
let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let mapOptions = require('../lib/mapOptions');

jQuery(document).ready(function(){
	var map = null,
		myBoundaries = {},
		geoDataJsonLayer,
		infoWindow,
		$ = jQuery,
		//set your google maps parameters
		//you can use any,location as center on map startup
		//google map custom marker icon - .png fallback for IE11
		isInternetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1,
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
				
	

    //inizialize the map
	map = new google.maps.Map(document.getElementById('google-container'), mapOptions);
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
	
	loadBoundariesFromGeoJson(boundariesFromGeoJson);

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

	function initializeDataLayer(){
		if(geoDataJsonLayer){
			geoDataJsonLayer.forEach(function(feature) {
				geoDataJsonLayer.remove(feature);
			});
			geoDataJsonLayer = null;
		}
		geoDataJsonLayer = new google.maps.Data({map: map}); //initialize geoDataJson layer which contains the boundaries. It's possible to have multiple geoDataJson layers on one map
		geoDataJsonLayer.setStyle({ //using set style we can set styles for all boundaries at once
			fillColor: 'blue',
			strokeWeight: 1,
			fillOpacity: 0.8
		});

		geoDataJsonLayer.addListener('click', boundTheMap);

		geoDataJsonLayer.addListener('mouseover', function(e) {
			geoDataJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 3,
				strokeColor: '#ff0000'
			});
			var boundary_id = e.feature.getProperty('boundary_id');
			var boundary_name = "NOT SET";
			if(boundary_id && 
				myBoundaries[boundary_id] && 
				myBoundaries[boundary_id].name
			) {
				boundary_name = myBoundaries[boundary_id].name;
			}
			$('#bname').html(boundary_name);
		});

		geoDataJsonLayer.addListener('mouseout', function(e) {
			geoDataJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 1,
				strokeColor: ''
			});
			$('#bname').html("");
		});
	}

	function boundTheMap(e) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundary_id'); we set when adding boundary to geoDataJson layer
		if (!e.feature) {

		}

		var boundary_id = e.feature.getProperty('boundary_id');
		var boundary_name = "NOT SET";
		var geocoder = new google.maps.Geocoder();


		if(boundary_id && 
			myBoundaries[boundary_id] && 
			myBoundaries[boundary_id].name
		) {
			boundary_name = myBoundaries[boundary_id].name;
		}
		if(infoWindow){
			infoWindow.setMap(null);
			infoWindow = null;
		}

		infoWindow = new google.maps.InfoWindow({
			content: '<div>You have clicked a boundary: <span style="color:red;">' + boundary_name + '</span></div>',
			size: new google.maps.Size(150,50),
			position: e.latLng, map: map
		});


		geocoder.geocode({'address': boundary_name}, function (results, status) {
			var ne = results[0].geometry.viewport.getNorthEast();
			var sw = results[0].geometry.viewport.getSouthWest();

			map.fitBounds(results[0].geometry.viewport);               

			var boundingBoxPoints = [
				ne, new google.maps.LatLng(ne.lat(), sw.lng()),
				sw, new google.maps.LatLng(sw.lat(), ne.lng()), ne
			];

			var boundingBox = new google.maps.Polyline({
				path: boundingBoxPoints,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});

			boundingBox.setMap(map);
		}); 
	}

	function loadBoundariesFromGeoJson(geoDataJson) {
		initializeDataLayer();
		if (geoDataJson.type === "FeatureCollection") { //we have a collection of boundaries in geojson format
			if (geoDataJson.features) {
				for (var i = 0; i < geoDataJson.features.length; i++) {
					var boundary_id = i + 1;
					var new_boundary = {};
					if (!geoDataJson.features[i].properties) { 
						geoDataJson.features[i].properties = {};
					}
					geoDataJson.features[i].properties.boundary_id = boundary_id; //we will use this id to identify boundary later when clicking on it
					geoDataJsonLayer.addGeoJson(geoDataJson.features[i], {idPropertyName: 'boundary_id'});
					new_boundary.feature = geoDataJsonLayer.getFeatureById(boundary_id);
					if (geoDataJson.features[i].properties.name) {
						new_boundary.name = geoDataJson.features[i].properties.name;
					}
					if (geoDataJson.features[i].properties.NAME) {
						new_boundary.name = geoDataJson.features[i].properties.NAME;
					}
					myBoundaries[boundary_id] = new_boundary;
				}
			}
		}
	}
});

  