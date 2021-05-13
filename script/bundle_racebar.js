(function () {
    'use strict';

       // Feel free to change or delete any of the code you see in this editor!
       var svg2 = d3.select("#partitionSVG_2")
       // .style('max-width', '600px')
       // .style('max-height', '600px')
       // .attr('viewBox', '0 0 1000 600');
       // .style('max-width', '75%')
       // .style('max-height', '75%')
       .attr('viewBox', '-10 0 1000 600');

         var tickDuration = 1000;
         var my_data;

         var top_n = 12;
         var height = 600;
         var width = 960;

         const margin = {
            top: 80,
            right: 0,
            bottom: 5,
            left: 0
         };

         let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);

         // let title = svg2.append('text')
         //    .attr('class', 'title')
         //    .style('font-size','2em')
         //    .attr('y', 24)
         //    .html('18 years of Interbrand’s Top Global Brands');
         //
         // let subTitle = svg2.append("text")
         //    .attr("class", "subTitle")
         //    .attr("y", 55)
         //    .html("Brand value, $m");
         //
         // let caption = svg2.append('text')
         //    .attr('class', 'caption')
         //    .attr('x', width)
         //    .attr('y', height-5)
         //    .style('text-anchor', 'end')
         //    .html('Source: Interbrand');


         var formatTime = d3.timeFormat("%Y-%m-%d.%H");
         var parseTime = d3.timeParse("%Y-%m-%d.%H");


         d3.csv('../data/data2_2.csv').then(function(data) {
            //if (error) throw error;
         // filteredArray = myArray.filter( function( el ) {
         //     return !toRemove.includes( el );
         // } );
            // console.log(data);

            data.forEach(d => {
               d.value = +d.value,
                  d.lastValue = +d.lastValue,
                  d.value = isNaN(d.value) ? 0 : d.value,
                  // d.year = parseTime(d.year),
                  d.year = +d.year,
                  d.colour = d3.hsl(Math.random()*360,0.75,0.75)
            });

            // console.log(data);
            my_data = data;




             run_ticker(my_data,0)
         });

         function run_ticker(data,end_time){
             // let year = parseTime("2019-1-1.1");
             let year = 0;

             svg2.selectAll("*").remove();

             let yearSlice = data.filter(d => d.year == year && !isNaN(d.value))
                .sort((a,b) => b.value - a.value)
                .slice(0, top_n);

             yearSlice.forEach((d,i) => d.rank = i);

             console.log('yearSlice: ', yearSlice)

             let x = d3.scaleLinear()
                .domain([0, d3.max(yearSlice, d => d.value)])
                .range([margin.left, width-margin.right-65]);

             let y = d3.scaleLinear()
                .domain([top_n, 0])
                .range([height-margin.bottom, margin.top]);

             let xAxis = d3.axisTop()
                .scale(x)
                .ticks(width > 500 ? 5:2)
                .tickSize(-(height-margin.top-margin.bottom))
                .tickFormat(d => d3.format(',')(d));

             svg2.append('g')
                .attr('class', 'axis xAxis')
                .attr('transform', `translate(0, ${margin.top})`)
                .call(xAxis)
                .selectAll('.tick line')
                .classed('origin', d => d == 0);

             svg2.selectAll('rect.bar')
                .data(yearSlice, d => d.name)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', x(0)+1)
                .attr('width', d => x(d.value)-x(0)-1)
                .attr('y', d => y(d.rank)+5)
                .attr('height', y(1)-y(0)-barPadding)
                .style('fill', d => d.colour);

             svg2.selectAll('text.label')
                .data(yearSlice, d => d.name)
                .enter()
                .append('text')
                .attr('class', 'label')
                .attr('x', d => x(d.value)-8)
                .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
                .style('text-anchor', 'end')
                .html(d => d.name);

             svg2.selectAll('text.valueLabel')
                .data(yearSlice, d => d.name)
                .enter()
                .append('text')
                .attr('class', 'valueLabel')
                .attr('x', d => x(d.value)+5)
                .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
                .text(d => d3.format(',.0f')(d.lastValue));

             let labelText = svg2.append('text')
                .attr('class', 'yearText')
                .attr('x', width-margin.right)
                .attr('y', height-25)
                .style('text-anchor', 'end')
                .html((Math.floor(year/60))+":"+ String((year%60)).padStart(2, '0') + " // "+ year)
                .call(halo, 10);


             let ticker = d3.interval(e => {

                 // console.log(formatTime(year))
                 console.log(year)
                // yearSlice = data.filter(d => formatTime(d.year) == formatTime(year) && !isNaN(d.value))
                yearSlice = data.filter(d => d.year == year && !isNaN(d.value))
                   .sort((a,b) => b.value - a.value)
                   .slice(0,top_n);

                yearSlice.forEach((d,i) => d.rank = i);

                console.log('IntervalYear: ', yearSlice);

                x.domain([0, d3.max(yearSlice, d => d.value)]);

                svg2.select('.xAxis')
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .call(xAxis);

                let bars = svg2.selectAll('.bar').data(yearSlice, d => d.name);

                bars
                   .enter()
                   .append('rect')
                   .attr('class', d => `bar ${d.name.replace(/\s/g,'_')}`)
                   .attr('x', x(0)+1)
                   .attr( 'width', d => x(d.value)-x(0)-1)
                   .attr('y', d => y(top_n+1)+5)
                   .attr('height', y(1)-y(0)-barPadding)
                   .style('fill', d => d.colour)
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('y', d => y(d.rank)+5);

                bars
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('width', d => x(d.value)-x(0)-1)
                   .attr('y', d => y(d.rank)+5);

                bars
                   .exit()
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('width', d => x(d.value)-x(0)-1)
                   .attr('y', d => y(top_n+1)+5)
                   .remove();

                let labels = svg2.selectAll('.label')
                   .data(yearSlice, d => d.name);

                labels
                   .enter()
                   .append('text')
                   .attr('class', 'label')
                   .attr('x', d => x(d.value)-8)
                   .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
                   .style('text-anchor', 'end')
                   .html(d => d.name)
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);


                labels
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('x', d => x(d.value)-8)
                   .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

                labels
                   .exit()
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('x', d => x(d.value)-8)
                   .attr('y', d => y(top_n+1)+5)
                   .remove();



                let valueLabels = svg2.selectAll('.valueLabel').data(yearSlice, d => d.name);

                valueLabels
                   .enter()
                   .append('text')
                   .attr('class', 'valueLabel')
                   .attr('x', d => x(d.value)+5)
                   .attr('y', d => y(top_n+1)+5)
                   .text(d => d3.format(',.0f')(d.lastValue))
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

                valueLabels
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('x', d => x(d.value)+5)
                   .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
                   .tween("text", function(d) {
                      let i = d3.interpolateRound(d.lastValue, d.value);
                      return function(t) {
                         this.textContent = d3.format(',')(i(t));
                      };
                   });


                valueLabels
                   .exit()
                   .transition()
                   .duration(tickDuration)
                   .ease(d3.easeLinear)
                   .attr('x', d => x(d.value)+5)
                   .attr('y', d => y(top_n+1)+5)
                   .remove();

                // labelText.html(formatTime(year));
                labelText.html((Math.floor(year/60))+":"+ String((year%60)).padStart(2, '0') + " // "+ year);

                // if(formatTime(year) == "2019-12-30.23") ticker.stop();
                if(year >= end_time) ticker.stop();
                // console.log(d3.timeHour.offset(year, 1))
                // year = d3.timeHour.offset(year, 1);
                year += 15
             },tickDuration);
         }

         const halo = function(text, strokeWidth) {
            text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
               .style('fill', '#ffffff')
               .style('stroke','#ffffff')
               .style('stroke-width', strokeWidth)
               .style('stroke-linejoin', 'round')
               .style('opacity', 1);

         }

         var myLink = document.getElementById('resetbtn');
         // console.log(myLink)
         myLink.onclick = function(){

             console.log("Hellow");
             // console.log(ticker)
             run_ticker(my_data,1425);
             // var script = document.createElement("script");
             // script.type = "text/javascript";
             // script.src = "Public/Scripts/filename.js.";
             // document.getElementsByTagName("head")[0].appendChild(script);
             // return false;

         }
         function pad(n) {
             return (n < 10) ? ("0" + n) : n;
         }
}());
