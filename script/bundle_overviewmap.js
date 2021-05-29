(function () {
    'use strict';

    var map3 = L.map('partitionMap1').setView([-37.80,145.06], 12);
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

    d3.json('../data/Postcodes.geojson').then(json => {

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

       map3.on("zoom", reset);
       reset();

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

    // $(document).ready(function(){
    //     var width = document.getElementById("partitionMap1").clientWidth,
    //         height = document.getElementById("partitionMap1").clientHeight;
    //
    //     var offset = [width/2, height/2];
    //     console.log(document.getElementById("partitionMap1"),width,height);
    //
    //     path.translate([width / 2, height / 2])
    //
    //     map3 = L.map('partitionMap1').setView([0,145.035], 12);
    // });

}());
