let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let style = require('../lib/mapStyle');

//set google map options
let mapOptions = {
	bounds: defaultLatitudeLongitude,
  	center: defaultLatitudeLongitude,
  	panControl: false,
  	draggable: true,
  	zoomControl: false,
  	mapTypeControl: false,
  	streetViewControl: false,
  	mapTypeId: google.maps.MapTypeId.ROADMAP,
  	scrollwheel: false,
  	styles: style,
}

module.exports = mapOptions;
