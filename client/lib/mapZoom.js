let sElEvtEmitter = require('./globals').sElEvtEmitter;
let map = require('../lib/map');

function toggleStorePins(zoomLevel) {
	zoomLevel > 5 
		? sElEvtEmitter.emit('showMarkers')
		: sElEvtEmitter.emit('clearMarkers');

}

map.addListener('zoom_changed', function() {
	toggleStorePins(returnCurrentMapZoomLevel());
});


function returnCurrentMapZoomLevel() {
	return map.getZoom();
}

module.exports = {
	returnCurrentMapZoomLevel
}