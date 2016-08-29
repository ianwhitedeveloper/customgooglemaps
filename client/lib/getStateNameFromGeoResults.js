let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;


function getStateNameFromGeoResults(results) {
	let deferred = $.Deferred();
	// http://stackoverflow.com/questions/6778205/google-maps-geocoder-to-return-state
	let stateName;
	for(let i=0; i < results[0].address_components.length; i++)
    {
        if (results[0].address_components[i].types[0] === "administrative_area_level_1")
        {
            stateName = results[0].address_components[i].short_name;
            deferred.resolve(stateName);
        }
    }
    return deferred.promise();
}

sElEvtEmitter.on('getStateNameFromGeoResults', getStateNameFromGeoResults);

module.exports = getStateNameFromGeoResults;