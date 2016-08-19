//define the basic color of your map, plus a value for saturation and brightness
let main_color = '#2d313f',
	saturation_value = -20,
	brightness_value = 5;

let styles = [
	{
		// remove all labels (cities, states, oceans, countries, etc)
		elementType: "labels",
		stylers: [
			{ visibility: "off" }
		]
	},  
    {	//poi stands for point of interest - don't show these lables on the map 
		featureType: "poi",
		elementType: "labels",
		stylers: [
			{visibility: "off"}
		]
	},
	{
		//don't show highways lables on the map
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [
            {visibility: "off"}
        ]
    }, 
	{ 	
		//don't show local road lables on the map
		featureType: "road.local", 
		elementType: "labels.icon", 
		stylers: [
			{visibility: "off"} 
		] 
	},
	{ 
		//don't show arterial road lables on the map
		featureType: "road.arterial", 
		elementType: "labels.icon", 
		stylers: [
			{visibility: "off"}
		] 
	},
	{
		//don't show road lables on the map
		featureType: "road",
		elementType: "geometry.stroke",
		stylers: [
			{visibility: "off"}
		]
	}, 
	//style different elements on the map
	{ 
		featureType: "transit", 
		elementType: "geometry.fill", 
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	}, 
	{
		featureType: "poi",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	},
	{
		featureType: "poi.government",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	},
	{
		featureType: "poi.sport_complex",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	},
	{
		featureType: "poi.attraction",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	},
	{
		featureType: "poi.business",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	},
	{
		featureType: "transit",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	},
	{
		featureType: "transit.station",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	},
	{
		featureType: "landscape",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
		
	},
	{
		featureType: "road",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	},
	{
		featureType: "road.highway",
		elementType: "geometry.fill",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	}, 
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [
			{ hue: main_color },
			{ visibility: "on" }, 
			{ lightness: brightness_value }, 
			{ saturation: saturation_value }
		]
	}
];

module.exports = styles;