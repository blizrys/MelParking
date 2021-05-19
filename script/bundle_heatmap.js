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
       console.log(parkwithsensor);
       console.log(parkwithoutsensor);
       // my_data = data;
       //
       //
       //
       //
       //  run_ticker(my_data)
       var heat = L.heatLayer(parkwithsensor,{
           radius: 5,
           blur: 5,
           maxZoom: 17,
           gradient: {0: "#FFEE00",0.2: "#FBB806",0.4: "#F6830C",0.6: "#F6830C",0.8: "#F24D11",1: "#FFFFB7"}
       }).addTo(map);

       var heat2 = L.heatLayer(parkwithoutsensor,{
           radius: 5,
           blur: 5,
           maxZoom: 17,
           gradient: {0: "#BFBFFF",0.2: "#A3A3FF",0.4: "#7879FF",0.6: "#4949FF",0.8: "#1F1FFF",1: "#0000FF"}
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
    }).addTo(map);


}());
