let sElEvtEmitter = require('./globals').sElEvtEmitter;
let map = require('../lib/map');
let stateMetaEl = require('./CONSTANTS').stateMetaEl;
let RESULTS_ZOOM_LVL = require('./CONSTANTS').RESULTS_ZOOM_LVL;

function toggleStorePins() {
	let zoomLevel = map.getZoom();

	if (zoomLevel < RESULTS_ZOOM_LVL) {
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

map.addListener('idle', toggleStorePins);

module.exports = {
	toggleStorePins
}