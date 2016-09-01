let sElEvtEmitter = require('./globals').sElEvtEmitter;
let map = require('../lib/map');
let stateMetaEl = require('./CONSTANTS').stateMetaEl;

function toggleStorePins(zoomLevel) {
	if (zoomLevel <= 8) {
		sElEvtEmitter.emit('clearMarkers');
		sElEvtEmitter.emit('resetBannerCTA');
		sElEvtEmitter.emit('overrideGeoStyle', {boundaryName: stateMetaEl.attr('content'), style: {strokeWeight: 5, strokeColor: '#fff', fillOpacity: 0.8}});
		sElEvtEmitter.emit('enableStateClickListener');
	}
	else 
	{
		sElEvtEmitter.emit('showMarkers');
		sElEvtEmitter.emit('overrideGeoStyle', {boundaryName: stateMetaEl.attr('content'), style: {strokeWeight: 5, strokeColor: '#fff', fillOpacity: 0.3}});
		sElEvtEmitter.emit('disableStateClickListener');
	}

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