'use strict';

var map = null;
var my_boundaries = {};
var data_layer;
var info_window;
var $ = jQuery;

jQuery(document).ready(function(){
	//set your google maps parameters
	var map_zoom = 5,
		latlng = new google.maps.LatLng(39.8282, -98.5795); //you can use any location as center on map startup

	//google map custom marker icon - .png fallback for IE11
	var is_internetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1;
	var marker_url = ( is_internetExplorer11 ) ? 'imgs/cd-icon-location.png' : 'imgs/cd-icon-location.svg';
		
	//define the basic color of your map, plus a value for saturation and brightness
	var	main_color = '#2d313f',
		saturation_value= -20,
		brightness_value= 5;

	//we define here the style of the map
	var style= [ 
		{
			//set saturation for the labels on the map
			elementType: "labels",
			stylers: [
				{saturation: saturation_value}
			]
		},  
	    {	//poi stands for point of interest - don't show these lables on the map 
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{visibility: "off"}
			]
		},
		{
			//don't show highways lables on the map
	        featureType: 'road.highway',
	        elementType: 'labels',
	        stylers: [
	            {visibility: "off"}
	        ]
	    }, 
		{ 	
			//don't show local road lables on the map
			featureType: "road.local", 
			elementType: "labels.icon", 
			stylers: [
				{visibility: "off"} 
			] 
		},
		{ 
			//don't show arterial road lables on the map
			featureType: "road.arterial", 
			elementType: "labels.icon", 
			stylers: [
				{visibility: "off"}
			] 
		},
		{
			//don't show road lables on the map
			featureType: "road",
			elementType: "geometry.stroke",
			stylers: [
				{visibility: "off"}
			]
		}, 
		//style different elements on the map
		{ 
			featureType: "transit", 
			elementType: "geometry.fill", 
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		}, 
		{
			featureType: "poi",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.government",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.sport_complex",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.attraction",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.business",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "transit",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "transit.station",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "landscape",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
			
		},
		{
			featureType: "road",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "road.highway",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		}, 
		{
			featureType: "water",
			elementType: "geometry",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		}
	];
		
	//set google map options
	var map_options = {
		bounds: latlng,
      	center: latlng,
      	zoom: map_zoom,
      	panControl: false,
      	draggable: false,
      	zoomControl: false,
      	mapTypeControl: false,
      	streetViewControl: false,
      	mapTypeId: google.maps.MapTypeId.ROADMAP,
      	scrollwheel: false,
      	styles: style,
    }
    //inizialize the map
	map = new google.maps.Map(document.getElementById('google-container'), map_options);
	//add a custom marker to the map				
	var marker = new google.maps.Marker({
	  	position: latlng,
	    map: map,
	    visible: true,
	 	icon: marker_url,
	});

    marker.addListener('click', function() {
      map.setZoom(8);
      map.setCenter(marker.getPosition());
    });


	var zoomControlDiv = document.createElement('div');
	var zoomControl = new CustomZoomControl(zoomControlDiv, map);

	//insert the zoom div on the top left of the map
	map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);
	
	loadBoundariesFromGeoJson("https://raw.githubusercontent.com/matej-pavla/Google-Mapshttps://raw.githubusercontent.com/matej-pavla/Google-Maps-Examples/master/BoundariesExample/geojsons/us.states.geo.json");

	var contentString = `<h1>hi there!</h1>`;

	var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

	marker.addListener('click', () => {
		infowindow.open(map, marker);
	});
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
	if(data_layer){
		data_layer.forEach(function(feature) {
			data_layer.remove(feature);
		});
		data_layer = null;
	}
	data_layer = new google.maps.Data({map: map}); //initialize data layer which contains the boundaries. It's possible to have multiple data layers on one map
	data_layer.setStyle({ //using set style we can set styles for all boundaries at once
		fillColor: 'blue',
		strokeWeight: 1,
		fillOpacity: 0.8
	});

	data_layer.addListener('click', function(e) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundary_id'); we set when adding boundary to data layer
		var boundary_id = e.feature.getProperty('boundary_id');
		console.log(e);
		var boundary_name = "NOT SET";
		if(boundary_id && 
			my_boundaries[boundary_id] && 
			my_boundaries[boundary_id].name
		) {
			boundary_name = my_boundaries[boundary_id].name;
		}
		if(info_window){
			info_window.setMap(null);
			info_window = null;
		}
		info_window = new google.maps.InfoWindow({
			content: '<div>You have clicked a boundary: <span style="color:red;">' + boundary_name + '</span></div>',
			size: new google.maps.Size(150,50),
			position: e.latLng, map: map
		});

		var geocoder = new google.maps.Geocoder();

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
	});

	data_layer.addListener('mouseover', function(e) {
		data_layer.overrideStyle(e.feature, {
			strokeWeight: 3,
			strokeColor: '#ff0000'
		});
		var boundary_id = e.feature.getProperty('boundary_id');
		var boundary_name = "NOT SET";
		if(boundary_id && 
			my_boundaries[boundary_id] && 
			my_boundaries[boundary_id].name
		) {
			boundary_name = my_boundaries[boundary_id].name;
		}
		$('#bname').html(boundary_name);
	});

	data_layer.addListener('mouseout', function(e) {
		data_layer.overrideStyle(e.feature, {
			strokeWeight: 1,
			strokeColor: ''
		});
		$('#bname').html("");
	});
}

function loadBoundariesFromGeoJson(geo_json_url) {
	initializeDataLayer();
	jQuery.getJSON(geo_json_url, function (data) {
		if (data.type === "FeatureCollection") { //we have a collection of boundaries in geojson format
			if (data.features) {
				for (var i = 0; i < data.features.length; i++) {
					var boundary_id = i + 1;
					var new_boundary = {};
					if (!data.features[i].properties) { 
						data.features[i].properties = {};
					}
					data.features[i].properties.boundary_id = boundary_id; //we will use this id to identify boundary later when clicking on it
					data_layer.addGeoJson(data.features[i], {idPropertyName: 'boundary_id'});
					new_boundary.feature = data_layer.getFeatureById(boundary_id);
					if (data.features[i].properties.name) {
						new_boundary.name = data.features[i].properties.name;
					}
					if (data.features[i].properties.NAME) {
						new_boundary.name = data.features[i].properties.NAME;
					}
					my_boundaries[boundary_id] = new_boundary;
				}
			}
		}
	});
}
  