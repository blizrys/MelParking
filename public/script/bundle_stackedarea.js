(function () {
    'use strict';

    // d3.csv("./data/data_fined.csv").then(d => chart2(d))


    // function chart2(csv) {
    //     console.log(csv);
    //
    //     var keys = csv.columns.slice(2);
    //
    //     var year   = [...new Set(csv.map(d => d.Year))]
    //     var states = [...new Set(csv.map(d => d.sub_name))]
    //
    //     console.log(keys);
    //     console.log(year);
    //     console.log(states);
    // }

    d3.csv("./data/data_fined3.csv").then(d => chart(d))

    function chart(csv) {
        // console.log(csv);

    	var raw_keys = csv.columns.slice(2);

    	var raw_year   = [...new Set(csv.map(d => d.Year))]
    	var raw_states = [...new Set(csv.map(d => d.Month))]

        // console.log(raw_keys);
        // console.log(raw_year);
        // console.log(raw_states);

    	// var options = d3.select("#year").selectAll("option")
    	// 	.data(year)
    	// .enter().append("option")
    	// 	.text(d => d)

    	var svg6 = d3.select("#stackedarea_1"),
    		margin = {top: 35, left: 35, bottom: 0, right: 0},
    		width = +svg6.attr("width") - margin.left - margin.right,
    		height = +svg6.attr("height") - margin.top - margin.bottom;

    	var x = d3.scaleBand()
    		.range([margin.left, width - margin.right])
    		.padding(0.1)

    	var y = d3.scaleLinear()
    		.rangeRound([height - margin.bottom, margin.top])

    	var xAxis = svg6.append("g")
    		.attr("transform", `translate(0,${height - margin.bottom})`)
    		.attr("class", "x")

    	var yAxis = svg6.append("g")
    		.attr("transform", `translate(${margin.left},0)`)
    		.attr("class", "y-axis")

    	var z = d3.scaleOrdinal()
    		// .range(["steelblue", "darkorange", "lightblue"])
            // .range(d3.schemeSet3)
            .range(d3.quantize(d3.interpolateRainbow, raw_keys.length + 1))
    		.domain(raw_keys);

    	update(d3.select("#year").property("value"), 0)

    	function update(input, speed) {
            // console.log(input)

            var data = csv.filter(f => f.Year == 2019);
            var keys = raw_keys;
            var states = raw_states;
            if(input == "month"){
                // console.log("month");

                data = csv;
                keys = raw_keys;
                states = raw_states;
            }
            else{
                // console.log("suburb");
                var data2 =[];
                for(var i=0;i<raw_keys.length;i++){
                    // console.log(raw_keys[i]);
                    var temp_dict = {"Year":"2019",
                                "Month":raw_keys[i]};
                    for(var j=0;j<raw_keys.length;j++){
                        // console.log(csv[j][raw_keys[i]]);
                        temp_dict[raw_states[j]] = csv[j][raw_keys[i]];
                    }
                    data2.push(temp_dict);

                }
                // console.log(data2);
                // data = d3.transpose(csv);
                data = data2;
                keys = raw_states;
                states = raw_keys;

            }




    		data.forEach(function(d) {
    			d.total = d3.sum(keys, k => +d[k])
    			return d
    		})

    		y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

    		svg6.selectAll(".y-axis").transition().duration(speed)
    			.call(d3.axisLeft(y).ticks(null, "s"))

    		data.sort(d3.select("#sort").property("checked")
    			? (a, b) => b.total - a.total
    			: (a, b) => states.indexOf(a.Month) - states.indexOf(b.Month))

    		x.domain(data.map(d => d.Month));

    		svg6.selectAll(".x").transition().duration(speed)
    			.call(d3.axisBottom(x).tickSizeOuter(0))

    		var group = svg6.selectAll("g.layer")
    			.data(d3.stack().keys(keys)(data), d => d.key)

            var html_tooltip_text = document.getElementById("tooltip-text")

    		group.exit().remove()

            // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
            // Its opacity is set to 0: we don't see it by default.


    		group.enter().append("g")
    			.classed("layer", true)
    			.attr("fill", d => z(d.key))
                .attr("fill-opacity", 0.6)
                .on("mouseover", function(d, i) {
                    // console.log("Mouseover",d)
                    d3.select(this).attr("fill-opacity", 0.8);

                    html_tooltip_text.innerHTML = d.key;
                    // tooltip
                    //   .style("opacity", 1)
                    //   .text(d.key);
                    // var x = d3.mouse(this)[0];
                    // var y = d3.mouse(this)[1];
                    // tooltip = svg6
                    //     .append("text")
                    //     .text("Hello")
                    //     .attr("x", x)
                    //     .attr("y", y)
                })
                .on("mousemove", function(d, i) {
                    var x = d3.mouse(this)[0];
                    var y = d3.mouse(this)[1];
                    // tooltip
                    //   .attr("x", x)
                    //   .attr("y", y);
                })
                .on("mouseout", function(d, i) {
                    d3.select(this).attr("fill-opacity", 0.6);
                    html_tooltip_text.innerHTML = "Hover for more details";
                    // tooltip
                    //   .transition()
                    //   .duration(500)
                    //   .style("opacity", 0);
                });


    		var bars = svg6.selectAll("g.layer").selectAll("rect")
    			.data(d => d, e => e.data.Month);

    		bars.exit().remove()

    		bars.enter().append("rect")
    			.attr("width", x.bandwidth())
    			.merge(bars)
    		.transition().duration(speed)
    			.attr("x", d => x(d.data.Month))
    			.attr("y", d => y(d[1]))
    			.attr("height", d => y(d[0]) - y(d[1]))




    		var text = svg6.selectAll(".text")
    			.data(data, d => d.Month);

    		text.exit().remove()

    		text.enter().append("text")
    			.attr("class", "text")
    			.attr("text-anchor", "middle")
                .attr("font-size","8")
    			.merge(text)
    		.transition().duration(speed)
    			.attr("x", d => x(d.Month) + x.bandwidth() / 2)
    			.attr("y", d => y(d.total) - 5)
    			.text(d => d.total)

            var tooltip = svg6.append("text")
                  .style("opacity", 1);
    	}

    	var select = d3.select("#year")
    		.on("change", function() {
    			update(this.value, 750)
    		})

    	var checkbox = d3.select("#sort")
    		.on("click", function() {
    			update(select.property("value"), 750)
    		})
    }



}());
