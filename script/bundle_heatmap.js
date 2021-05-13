(function () {
    'use strict';

    d3.csv('./assets/data3.csv').then(function(data) {
       //if (error) throw error;

       // console.log(data);

       var new_quakePoints = []

       data.forEach(d => {
           // console.log(d);
           let datapoint = [];
           // datapoint.push(d.lat);
           // datapoint.push(d.lat);
           // datapoint.push(d.lat);
           new_quakePoints.push([+d.lat,+d.lng,5]);
       //    d.value = +d.value,
       //       d.lastValue = +d.lastValue,
       //       d.value = isNaN(d.value) ? 0 : d.value,
       //       d.year = +d.year,
       //       d.colour = d3.hsl(Math.random()*360,0.75,0.75)
       });
       //
       console.log(new_quakePoints);
       // my_data = data;
       //
       //
       //
       //
       //  run_ticker(my_data)
       var heat = L.heatLayer(new_quakePoints,{
           radius: 5,
           blur: 5,
           maxZoom: 17,
       }).addTo(map);
    });


    // var mymap = document.getElementById('map');

    var map = L.map('map').setView([-37.810935,144.956457], 14);
    var mapLink =
        '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(map);


}());
