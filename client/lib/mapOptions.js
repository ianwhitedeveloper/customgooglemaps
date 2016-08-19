let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let mapZoom = 5;
let style = require('../lib/mapStyle');

//set google map options
let mapOptions = {
	bounds: defaultLatitudeLongitude,
  	center: defaultLatitudeLongitude,
  	zoom: mapZoom,
  	panControl: false,
  	draggable: true,
  	zoomControl: true,
  	mapTypeControl: false,
  	streetViewControl: false,
  	mapTypeId: google.maps.MapTypeId.ROADMAP,
  	scrollwheel: false,
  	styles: style,
}

module.exports = mapOptions;
