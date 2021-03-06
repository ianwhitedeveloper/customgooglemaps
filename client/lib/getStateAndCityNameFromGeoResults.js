let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let map = require('../lib/map');
let STATE_ZOOM_LVL = require('./CONSTANTS').STATE_ZOOM_LVL;
let RESULTS_ZOOM_LVL = require('./CONSTANTS').RESULTS_ZOOM_LVL;


function getStateAndCityNameFromGeoResults(results) {
    try {
    	let deferred = $.Deferred();
        let data = {};
        // http://stackoverflow.com/questions/6778205/google-maps-geocoder-to-return-state
        for(let i=0; i < results[0].address_components.length; i++)
            {
                if (results[0].address_components[i].types.indexOf("administrative_area_level_1") > -1 )
                {
                    if (
                        results[0]
                            .address_components[0]
                            .types.indexOf("locality") > -1
                        ||
                        results[0]
                            .address_components[0]
                            .types.indexOf("postal_code") > -1
                    ) {
                        setTimeout(() => {
                            if (map.getZoom() <= STATE_ZOOM_LVL) {
                                map.setZoom(RESULTS_ZOOM_LVL);
                            }
                        }, 100);
                    } else {
                        // Attmept to prevent map from zooming in too 
                        // far and triggering cup results prematurely
                        setTimeout(() => {
                            if (map.getZoom() > STATE_ZOOM_LVL) {
                                map.setZoom(STATE_ZOOM_LVL);
                            }
                        }, 100);
                        sElEvtEmitter.emit('clearCityMeta');
                    }

                    data.stateNameShort = results[0].address_components[i].short_name;
                    data.stateNameLong = results[0].address_components[i].long_name;

                    sElEvtEmitter.emit('updateStateMeta', data.stateNameShort);

                    deferred.resolve(data);
                }
            }
        return deferred.promise();
    } catch(error) {
        sElEvtEmitter.emit('silentError', error);
    }
}

sElEvtEmitter.on('getStateAndCityNameFromGeoResults', getStateAndCityNameFromGeoResults);

module.exports = getStateAndCityNameFromGeoResults;
