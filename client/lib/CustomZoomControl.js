//add custom buttons for the zoom-in/zoom-out on the map
module.exports = function CustomZoomControl(controlDiv, map) {
	//grap the zoom elements from the DOM and insert them in the map 
  	var controlUIzoomIn= document.getElementById('cd-zoom-in'),
  		controlUIzoomOut= document.getElementById('cd-zoom-out');
  	controlDiv.appendChild(controlUIzoomIn);
  	controlDiv.appendChild(controlUIzoomOut);

	// Setup the click event listeners and zoom-in or out according to the clicked element
	google.maps.event.addDomListener(controlUIzoomIn, 'click', function() {
	    map.setZoom(map.getZoom()+1)
	});
	google.maps.event.addDomListener(controlUIzoomOut, 'click', function() {
	    map.setZoom(map.getZoom()-1)
	});
}