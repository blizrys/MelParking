(function () {
    'use strict';

    d3.csv('./data/data_on_parkingspace.csv').then(function(data) {
       //if (error) throw error;

       // console.log(data);

       var parkwithsensor = []
       var parkwithoutsensor = []

       data.forEach(d => {
           // console.log(d);
           let datapoint = [];
           // datapoint.push(d.lat);
           // datapoint.push(d.lat);
           // datapoint.push(d.lat);
           if(d.rate == 1){
               parkwithsensor.push([+d.lat,+d.lng,1]);
           }else{
               parkwithoutsensor.push([+d.lat,+d.lng,1]);
           }

       //    d.value = +d.value,
       //       d.lastValue = +d.lastValue,
       //       d.value = isNaN(d.value) ? 0 : d.value,
       //       d.year = +d.year,
       //       d.colour = d3.hsl(Math.random()*360,0.75,0.75)
       });
       //
       // console.log(parkwithsensor);
       // console.log(parkwithoutsensor);
       // my_data = data;
       //
       //
       //
       //
       //  run_ticker(my_data)
       var heat = L.heatLayer(parkwithsensor,{
           radius: 5,
           blur: 1,
           maxZoom: 17,
                      gradient: {0: "#BFBFFF",0.2: "#A3A3FF",0.4: "#7879FF",0.6: "#4949FF",0.8: "#1F1FFF",1: "#0000FF"}

           // gradient: {0: "#FFEE00",0.2: "#FBB806",0.4: "#F6830C",0.6: "#F6830C",0.8: "#F24D11",1: "#FFFFB7"}
       }).addTo(map);

       var heat2 = L.heatLayer(parkwithoutsensor,{
           radius: 5,
           blur: 1,
           maxZoom: 17,
           gradient: {0: "#ff0000",0.2: "#ff0000",0.4: "#ff4d00",0.6: "#ff7400",0.8: "#ff9a00",1: "#ffc100"}
       }).addTo(map);
    });


    // var mymap = document.getElementById('map');

    var map = L.map('heatmap_2').setView([-37.810935,144.956457], 14);
    var mapLink =
        '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
        minZoom: 12,
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});


    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = ["Sensor", "No Sensor", 20, 50, 100, 200, 500, 1000],
            labels = [];

        div.innerHTML += //'AAAA';
                '<i style="background:#0000FF"></i> Sensor<br>';
        div.innerHTML += //'AAAA';
                '<i style="background:#ffc100"></i> No sensor<br>';
        // loop through our density intervals and generate a label with a colored square for each interval
        // for (var i = 0; i < grades.length; i++) {
        //     div.innerHTML += //'AAAA';
        //         '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        //         grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        // }

        return div;
    };

    legend.addTo(map);


}());
