
var localizaciones = [];
var id;
var posiciones = [];
var markers = [];
var id;
var map;
var map2;
var pos;
var web;

	var directionsDisplay = null;
	var directionsService = null;

$(document).on('pageshow','#list-page', function() {
    $("#detail-viewer").css("bottom","-400px");
    localizaciones = World.markerList;
    localizaciones.sortByDistanceSorting;
    var lista = "";
    localizaciones.forEach(function(element, index, array){
        var distancia = (element.distanceToUser > 999) ? ((element.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(element.distanceToUser) + " m")
        lista = lista + "<li class='collection-item avatar materialize_esp'>\
          <img src='http://rauleam.000webhostapp.com/assets/img/User/"+element.poiData.image+"' alt='' class='circle'>\
           <span class='title'>"+element.poiData.titvle+"</span><br>\
           <p> <br>\
             "+distancia+"\
          </p>\
          <a href='#detail-page' onclick='llamadaid("+index+")' id='"+index+"' class='secondary-content' data-transition='slide'><i class='mdi-action-info-outline itp-list-link'></i></a>\
        </li>";
          console.log(index);
    });
    $( "#listado").html(lista);
    $("#flecha").on("click", function(e){
        $(document).on('pageshow','#cam-page', function() {


        });
    });

    $("a").on("click", function(e){

                id = $(this).attr("id");
            });
  });

function generaMapaMini(){

//alert(" 1 "+World.userLocation.latitude);
 //   var LatLang = new google.maps.LatLng(World.userLocation.latitude, World.userLocation.longitude);
   // var myOptions = {
     //   zoom: 20,
       // center: LatLang,
        //mapTypeId: google.maps.MapTypeId.ROADMAP
//    };
 //   var map2 = new google.maps.Map(document.getElementById("map-canvas2"), myOptions);
        // Add an overlay to the map of current lat/lng
   //   directionsDisplay = new google.maps.DirectionsRenderer();
    //		directionsService = new google.maps.DirectionsService();

var myLatlng = new google.maps.LatLng(World.userLocation.latitude, World.userLocation.longitude);
	    var myOptions = {
	        zoom: 16,
	        center: myLatlng,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    map = new google.maps.Map($("#map-canvas2").get(0), myOptions);
		directionsDisplay = new google.maps.DirectionsRenderer();
		directionsService = new google.maps.DirectionsService();

}
function getDirections(){
//alert(World.userLocation.latitude);

//		var start = World.userLocation.latitude+", "+World.userLocation.longitude;
//		var end = localizaciones[id].poiData.latitude+", "+ localizaciones[id].poiData.longitude;
//		alert(start);
//		if(!start || !end){
//			alert("Start and End addresses are required");
//			return;
//		}
//		var request = {
//		        origin: start,
//		        destination: end,
//		        travelMode: google.maps.DirectionsTravelMode["DRIVING"],
//		        unitSystem: google.maps.DirectionsUnitSystem["METRIC"],
//		        provideRouteAlternatives: true
//	    };
//		directionsService.route(request, function(response, status) {
//	        if (status == google.maps.DirectionsStatus.OK) {
//	            directionsDisplay.setMap(map2);
//
//	            directionsDisplay.setDirections(response);
//	        } else {
//	            alert("There is no directions available between these two points");
//	        }
//	    });

        var start = World.userLocation.latitude+", "+World.userLocation.longitude;
		var end = localizaciones[id].poiData.latitude+", "+ localizaciones[id].poiData.longitude;
		if(!start || !end){
			alert("Start and End addresses are required");
			return;
		}
		var request = {
		        origin: start,
		        destination: end,
		        travelMode: google.maps.DirectionsTravelMode["DRIVING"],
		        unitSystem: google.maps.DirectionsUnitSystem["METRIC"],
		        provideRouteAlternatives: true
	    };
		directionsService.route(request, function(response, status) {
	        if (status == google.maps.DirectionsStatus.OK) {
	            directionsDisplay.setMap(map);
	            //directionsDisplay.setPanel($("#directions_panel").get(0));
	            directionsDisplay.setDirections(response);
	        } else {
	            alert("There is no directions available between these two points");
	        }
	    });
	}


$(document).on('pageshow','#detail-page', function(){
  $("#detail-viewer").css("bottom","-400px");
  generaMapaMini();
    getDirections();
    //$('#info-imagen2').attr("src", "");
    //$('#info-imagen2').css( "width", "+=225" );
    $('#info-nombre').html(localizaciones[id].poiData.title);
    $('#info-distancia').html((localizaciones[id].distanceToUser > 999) ? ((localizaciones[id].distanceToUser / 1000).toFixed(2) + " km") : (Math.round(localizaciones[id].distanceToUser) + " m"));
    $('#info-descripcion').html(localizaciones[id].poiData.description);

});
var a;
function llamadaid(id){
a=id;
}



$("#loca").on("click", function(e){
     eleminar();
        $(document).on('pageshow','#cam-page', function() {

                var myJsonData = [{
                    "id": 0,
                    "longitude": localizaciones[a].poiData.longitude,
                    "latitude": localizaciones[a].poiData.latitude,
                    "description": localizaciones[a].poiData.description,
                    "title":"22222222",
                    "altitude": "100.0",
                    "name": localizaciones[a].poiData.title
                }];

                 World.loadPoisFromJsonData(myJsonData);

                 World.isRequestingData = false;
                 console.log(a);
                 World.updateRangeValues();
                 console.log("pulsadorer");
                   // str = JSON.stringify(marker);
                    //console.log(str);
        });

    });



    function eleminar(){
    AR.context.destroyAll();

    }
    function  datos(marker){

     console.log(marker);
    }
 var myVar;
function hola(id){
    var id2=id;
    World.updateDistanceToUserValues();
    localizaciones = World.markerList;
    str = JSON.stringify(localizaciones);
         //alert(str);
    console.log(localizaciones);
    console.log(id2);


    if(id2>=0){
    $("#distance").html((localizaciones[id2].distanceToUser > 999) ? ((localizaciones[id2].distanceToUser / 1000).toFixed(2) + " km") : (Math.round(localizaciones[id2].distanceToUser) + " m"));
    console.log(localizaciones[id2].distanceToUser);
      myVar=setTimeout('hola(id)',5000);
    }else{
    $("#distance").html((localizaciones[0].distanceToUser > 999) ? ((localizaciones[0].distanceToUser / 1000).toFixed(2) + " km") : (Math.round(localizaciones[0].distanceToUser) + " m"));
    consele.log((localizaciones[0].distanceToUser > 999) ? ((localizaciones[0].distanceToUser / 1000).toFixed(2) + " km") : (Math.round(localizaciones[0].distanceToUser) + " m"));

       myVar=setTimeout('hola(id)',5000);
    }


}

function myStopFunction(){

 clearTimeout(myVar);
}

 function ocultar(){
 //alert("d");
  $("#detail-viewer").css("bottom","+900px");
  };





