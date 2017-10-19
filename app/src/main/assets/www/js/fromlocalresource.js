// information about server communication. This sample webservice is provided by Wikitude and returns random dummy places near given location
var ServerInformation = {
	POIDATA_SERVER: "https://example.wikitude.com/GetSamplePois/",
	POIDATA_SERVER_ARG_LAT: "lat",
	POIDATA_SERVER_ARG_LON: "lon",
	POIDATA_SERVER_ARG_NR_POIS: "nrPois"
};

// implementation of AR-Experience (aka "World")
var World = {
	// you may request new data from server periodically, however: in this sample data is only requested once
	isRequestingData: false,
userLocation: null,
	// true once data was fetched
	initiallyLoadedData: false,

	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {


		// empty list of visible markers
		World.markerList = [];

		// start loading marker assets
		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			var singlePoi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"title": poiData[currentPlaceNr].name,
				"description": poiData[currentPlaceNr].description
			};

			World.markerList.push(new Marker(singlePoi));
		}
 World.updateDistanceToUserValues();
		World.updateStatusMessage(currentPlaceNr + ' places loaded');
	},
	 // sets/updates distances of all makers so they are available way faster than calling (time-consuming) distanceToUser() method all the time
    	updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
    		for (var i = 0; i < World.markerList.length; i++) {
    			World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
    		}
    	},

// updates status message shown in small "i"-button aligned bottom center
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},
    	// reload places from content source
        	reloadPlaces: function reloadPlacesFn() {
        		if (!World.isRequestingData) {
        			if (World.userLocation) {
        				World.requestDataFromServer(World.userLocation.latitude, World.userLocation.longitude);
        			} else {
        				World.updateStatusMessage('Unknown user-location.', true);
        			}
        		} else {
        			World.updateStatusMessage('Already requesing places...', true);
        		}
        	},

	// updates status message shown in small "i"-button aligned bottom center
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

showRange: function showRangeFn() {
		if (World.markerList.length > 0) {

			// update labels on every range movement
			$('#panel-distance-range').change(function() {
				World.updateRangeValues();
			});

			World.updateRangeValues();
			World.handlePanelMovements();

			// open panel
			$("#panel-distance").trigger("updatelayout");
			$("#panel-distance").panel("open", 1234);
		} else {

			// no places are visible, because the are not loaded yet
			World.updateStatusMessage('No places available yet', true);
		}
	},
	// location updates, fired every time you call architectView.setLocation() in native environment
	// Note: You may set 'AR.context.onLocationChanged = null' to no longer receive location updates in World.locationChanged.
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {
World.userLocation = {
			'latitude': lat,
			'longitude': lon,
			'altitude': alt,
			'accuracy': acc
		};

		// request data if not already present
		if (!World.initiallyLoadedData) {
			World.requestDataFromServer(lat, lon);
			World.initiallyLoadedData = true;
		}
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {

		// deselect previous marker
		if (World.currentMarker) {
			if (World.currentMarker.poiData.id == marker.poiData.id) {
				return;
			}
			World.currentMarker.setDeselected(World.currentMarker);
		}

		// highlight current one
		marker.setSelected(marker);
		World.currentMarker = marker;
	},

	// screen was clicked but no geo-object was hit
	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
		World.currentMarker = null;
	},
	// returns distance in meters of placemark with maxdistance * 1.1
    	getMaxDistance: function getMaxDistanceFn() {

    		// sort places by distance so the first entry is the one with the maximum distance
    		World.markerList.sort(World.sortByDistanceSortingDescending);

    		// use distanceToUser to get max-distance
    		var maxDistanceMeters = World.markerList[0].distanceToUser;

    		// return maximum distance times some factor >1.0 so ther is some room left and small movements of user don't cause places far away to disappear
    		return maxDistanceMeters * 1.1;
    	},
updateRangeValues: function updateRangeValuesFn() {

    // get current slider value (0..100);
    var slider_value =100;

    // max range relative to the maximum distance of all visible places
    var maxRangeMeters = Math.round(World.getMaxDistance() * (slider_value / 100));

    // range in meters including metric m/km
    var maxRangeValue = (maxRangeMeters > 999) ? ((maxRangeMeters / 1000).toFixed(2) + " km") : (Math.round(maxRangeMeters) + " m");
//alert(maxRangeValue);
    // number of places within max-range
    var placesInRange = World.getNumberOfVisiblePlacesInRange(maxRangeMeters);

    // update UI labels accordingly
    $("#panel-distance-value").html(maxRangeValue);
//    alert((placesInRange != 1) ? (placesInRange + " Places") : (placesInRange + " Place"));

    // update culling distance, so only places within given range are rendered
    AR.context.scene.cullingDistance = Math.max(maxRangeMeters, 1);

    // update radar's maxDistance so radius of radar is updated too

},

// returns number of places with same or lower distance than given range
getNumberOfVisiblePlacesInRange: function getNumberOfVisiblePlacesInRangeFn(maxRangeMeters) {

    // sort markers by distance
    World.markerList.sort(World.sortByDistanceSorting);

    // loop through list and stop once a placemark is out of range ( -> very basic implementation )
    for (var i = 0; i < World.markerList.length; i++) {
        if (World.markerList[i].distanceToUser > maxRangeMeters) {
            return i;
        }
    };

    // in case no placemark is out of range -> all are visible
    return World.markerList.length;
},
handlePanelMovements: function handlePanelMovementsFn() {

		$("#panel-distance").on("panelclose", function(event, ui) {
			$("#radarContainer").addClass("radarContainer_left");
			$("#radarContainer").removeClass("radarContainer_right");

		});

		$("#panel-distance").on("panelopen", function(event, ui) {
			$("#radarContainer").removeClass("radarContainer_left");
			$("#radarContainer").addClass("radarContainer_right");

		});
	},

	/*
		JQuery provides a number of tools to load data from a remote origin.
		It is highly recommended to use the JSON format for POI information. Requesting and parsing is done in a few lines of code.
		Use e.g. 'AR.context.onLocationChanged = World.locationChanged;' to define the method invoked on location updates.
		In this sample POI information is requested after the very first location update.

		This sample uses a test-service of Wikitude which randomly delivers geo-location data around the passed latitude/longitude user location.
		You have to update 'ServerInformation' data to use your own own server. Also ensure the JSON format is same as in previous sample's 'myJsonData.js'-file.
	*/
	// request POI data
	requestDataFromServer: function requestDataFromServerFn(lat, lon) {

		// set helper var to avoid requesting places while loading
		World.isRequestingData = true;
		World.updateStatusMessage('Requesting places from web-service');

		// server-url to JSON content provider
		var serverUrl = ServerInformation.POIDATA_SERVER + "?" + ServerInformation.POIDATA_SERVER_ARG_LAT + "=" + lat + "&" + ServerInformation.POIDATA_SERVER_ARG_LON + "=" + lon + "&" + ServerInformation.POIDATA_SERVER_ARG_NR_POIS + "=20";


		var jqxhr = $.getJSON(serverUrl, function(data) {
				World.loadPoisFromJsonData(data);
			})
			.error(function(err) {
				World.updateStatusMessage("Invalid web-service response.", true);
				World.isRequestingData = false;
			})
			.complete(function() {
				World.isRequestingData = false;
			});
	}

};


/* forward locationChanges to custom function */
AR.context.onLocationChanged = World.locationChanged;

/* forward clicks in empty area to World */
AR.context.onScreenClick = World.onScreenClick;

