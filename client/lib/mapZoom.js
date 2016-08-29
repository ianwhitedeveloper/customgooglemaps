let sElEvtEmitter = require('./globals').sElEvtEmitter;
let map = require('../lib/map');

function toggleStorePins(zoomLevel) {
	zoomLevel <= 10
		? sElEvtEmitter.emit('clearMarkers')
		: sElEvtEmitter.emit('showMarkers');

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