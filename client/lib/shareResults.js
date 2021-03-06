let $ = require('jquery');
let notie = require('notie');
let confirmYesEl = require('../lib/CONSTANTS').confirmYesEl;
let confirmNoEl = require('../lib/CONSTANTS').confirmNoEl;
let stateMetaEl = require('../lib/CONSTANTS').stateMetaEl;
let cityMetaEl = require('../lib/CONSTANTS').cityMetaEl;
let stateMetaValue;
let cityMetaValue;
let encodedRelativeURL;
let encodedTwitterMsg = encodeURIComponent(`See my state’s #7Election results! Vote with your choice of XL Stay-Hot Cup at @7Eleven.`);
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let bannerCtaEl = require('../lib/CONSTANTS').bannerCtaEl;

$('body').on('click', 'a[rel="js-share-results"]', e => {
	e.preventDefault();
	sElEvtEmitter.emit('shareResultsClicked');
	notie.confirm(`Share Your State's Results`, '', '')
});

function storeMarkerSelected(address) {
	bannerCtaEl.attr({
		rel: 'js-share-address',
		href: `https://maps.google.com?daddr=${encodeURIComponent(address)} ${stateMetaEl.attr('content')}`,
	});

	bannerCtaEl.text('Get Directions');
}

function resetBannerCTA() {
	if (bannerCtaEl.attr('rel') === 'js-share-address') {
		bannerCtaEl.attr({
			rel: 'js-share-results',
			href: '',
		});

		bannerCtaEl.text('Share Results');
	}
}

$('#notie-confirm-yes')
.append(
	`<div style="width: 100%; height: 100%">
		<a href="" target="_blank" aria-label="Share on Facebook">
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 103.15 103.16"><title>fb</title><path d="M354.74,197.49H277.37a12.94,12.94,0,0,0-12.9,12.9v77.37a12.93,12.93,0,0,0,12.89,12.89h39.13v-37H304.14V247.55h12.36v-8.07c0-12.44,9.19-22.19,20.92-22.19H348.8v18.2H338.61c-2.66,0-3.44,1.53-3.44,3.64v8.42H348.8v16.12H335.16v37h19.57a12.92,12.92,0,0,0,12.89-12.89V210.38a12.91,12.91,0,0,0-12.88-12.9" transform="translate(-264.47 -197.49)" style="fill:#4f2169"/></svg></a></div>`
);

$('#notie-confirm-no')
.append(
	`<div style="width: 100%; height: 100%">
		<a href="" target="_blank" aria-label="Share on Twitter">
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 54.55 54.55"><title>tw</title><path d="M45.46,0H9.09A9.12,9.12,0,0,0,0,9.09V45.46a9.12,9.12,0,0,0,9.09,9.09H45.46a9.12,9.12,0,0,0,9.09-9.09V9.09A9.12,9.12,0,0,0,45.46,0m-.81,18.21c0,.39,0,.78,0,1.18,0,12.05-9,25.95-25.5,25.95a25,25,0,0,1-13.74-4.1A17.85,17.85,0,0,0,18.7,37.46a9,9,0,0,1-8.37-6.33,8.8,8.8,0,0,0,4-.16A9.08,9.08,0,0,1,7.19,22v-.11a8.84,8.84,0,0,0,4.06,1.14A9.23,9.23,0,0,1,8.47,10.88a25.31,25.31,0,0,0,18.47,9.53,9.25,9.25,0,0,1-.23-2.08,9,9,0,0,1,9-9.12,8.88,8.88,0,0,1,6.54,2.88,17.78,17.78,0,0,0,5.69-2.21,9.13,9.13,0,0,1-3.94,5,17.65,17.65,0,0,0,5.15-1.44,18.4,18.4,0,0,1-4.47,4.72" style="fill:#4f2169"/></svg></a></div>`
	);


function setShareURL() {
	stateMetaValue = stateMetaEl.attr('content');
	cityMetaValue = encodeURIComponent(cityMetaEl.attr('content'));
	encodedRelativeURL = cityMetaValue 
		? encodeURIComponent(`${window.location.origin}${window.location.pathname}?city=${cityMetaValue}#${stateMetaValue}`)
		: encodeURIComponent(`${window.location.origin}${window.location.pathname}#${stateMetaValue}`);

	$('#notie-confirm-yes a').attr('href', `https://www.facebook.com/sharer/sharer.php?u=${encodedRelativeURL}`);
	$('#notie-confirm-yes a').attr("onclick", "ga('send', 'event', 'share_state', 'share', 'facebook')");


	$('#notie-confirm-no a').attr('href', `https://twitter.com/intent/tweet?text=${encodedTwitterMsg} ${encodedRelativeURL}`);
	$('#notie-confirm-no a').attr("onclick", "ga('send', 'event', 'share_state', 'share', 'twitter')");

	console.log(cityMetaValue);
}

sElEvtEmitter.on('shareResultsClicked', setShareURL);
sElEvtEmitter.on('storeMarkerSelected', storeMarkerSelected);
sElEvtEmitter.on('resetBannerCTA', resetBannerCTA);