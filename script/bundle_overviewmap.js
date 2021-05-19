(function () {
    'use strict';

    // var map3 = new L.Map("partitionMap1", {center: [-37.810935,144.956457], zoom: 16})
    //     .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
    var map3 = L.map('partitionMap1').setView([-37.765,145.035], 12);
    var mapLink3 =
        '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink3 + ' Contributors',
        minZoom: 12
    }).addTo(map3);

    // console.log(map3.getBounds().toString());
    // console.log(map3.getBounds().getSouthWest().toString());
    // console.log(map3.getBounds().getNorthEast().toString());
    // map3.setMaxBounds(map3.getBounds());

    // console.log(map3.getPanes().overlayPane);

    var svg3 = d3.select(map3.getPanes().overlayPane).append("svg"),
        g3 = svg3.append("g").attr("class", "leaflet-zoom-hide");


    // var svg3 = d3.select("#partitionMap1")
    //
    // var projection = d3.geoEquirectangular();
    // var path = d3.geoPath().projection(projection);

    d3.json('../data/Postcodes.geojson').then(json => {
    // d3.json('../data/Postcodes.geojson', function(error,json) {
       //if (error) throw error;

       // console.log(json);
       // createMap(data);

       // var text = svg.append("text")
       //     .attr("x", 6)
       //     .attr("dy", 15);
       //
       // text.append("textPath")
       //     .attr("xlink:href","#yourPathId")
       //     .text("My counter text");

       var transform = d3.geoTransform({point: projectPoint}),
           path = d3.geoPath().projection(transform);


       var feature = g3.selectAll("path")
               .data(json.features)
             .enter().append("path");
       // console.log(feature)
       feature.style('fill', '#000')
       .style('fill-opacity','0.5')
       .style('stroke','#fff')
       .style('stroke-width','1.5px');

       // feature.append("title")
       //         .text(d => d.properties.xorg);

       map3.on("zoom", reset);
       reset();

       // svg3.call(d3.zoom().on("zoom", function () {reset();}));

       // Reposition the SVG to cover the features.
       function reset() {
           // console.log("reset called")
         var bounds = path.bounds(json),
             topLeft = bounds[0],
             bottomRight = bounds[1];

         svg3.attr("width", bottomRight[0] - topLeft[0])
             .attr("height", bottomRight[1] - topLeft[1])
             .style("left", topLeft[0] + "px")
             .style("top", topLeft[1] + "px");

         g3.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

         feature.attr("d", path);
       }

        // Use Leaflet to implement a D3 geometric transformation.
        function projectPoint(x, y) {
            var point = map3.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
    });






}());
