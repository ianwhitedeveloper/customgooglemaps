let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;


function getStateNameFromGeoResults(results) {
	let deferred = $.Deferred();
	// http://stackoverflow.com/questions/6778205/google-maps-geocoder-to-return-state
	for(let i=0; i < results[0].address_components.length; i++)
    {
        if (results[0].address_components[i].types[0] === "administrative_area_level_1")
        {
            let data = {};
            data.stateNameShort = results[0].address_components[i].short_name;
            data.stateNameLong = results[0].address_components[i].long_name;
            deferred.resolve(data);
        }
    }
    return deferred.promise();
}

sElEvtEmitter.on('getStateNameFromGeoResults', getStateNameFromGeoResults);

module.exports = getStateNameFromGeoResults;