let sElEvtEmitter = require('./globals').sElEvtEmitter;
let map = require('../lib/map');

function toggleStorePins(zoomLevel) {
	zoomLevel > 5 
		? sElEvtEmitter.emit('showMarkers')
		: sElEvtEmitter.emit('clearMarkers');

}

map.addListener('zoom_changed', function() {
	let zoomLevel = map.getZoom();
	toggleStorePins(zoomLevel);
});

