
var localizaciones = [];
var id;
$(document).on('pageshow','#list-page', function() {
    $("#detail-viewer").css("bottom","-400px");
    localizaciones = World.markerList;
    localizaciones.sortByDistanceSorting;
    var lista = "";
    localizaciones.forEach(function(element, index, array){
        var distancia = (element.distanceToUser > 999) ? ((element.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(element.distanceToUser) + " m")
        lista = lista + "<li class='collection-item avatar materialize_esp'>\
          <img src='"+element.poiData.image+"' alt='' class='circle'>\
          <span class='title'>"+element.poiData.title+"</span>\
          <span class='title'>"+element.poiData.latitude+"</span>\
          <span class='title'>"+element.poiData.longitude+"</span>\
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



$(document).on('pageshow','#detail-page', function(){
    $('#info-imagen').attr("src", localizaciones[id].poiData.image);
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
                    "id": a,
                    "longitude": "-80.752779",
                    "latitude": "-0.9625554",
                    "description": localizaciones[a].poiData.description,
                    "altitude": "100.0",
                    "name": localizaciones[a].poiData.id
                }];

               World.loadPoisFromJsonData(myJsonData);
               World.isRequestingData = false;
                  console.log(a);

                 World.updateRangeValues();
                                   console.log("pulsadorer");


        });

    });



    function eleminar(){
    AR.context.destroyAll();

    }

