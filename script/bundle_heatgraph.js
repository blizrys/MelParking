(function () {
    'use strict';

    function renderChart (wrapper, curData) {
      if (!wrapper) {
        return
      }
      const {
        select: d3Select, scaleBand: d3ScaleBand,
        scaleLinear: d3ScaleLinear, rgb: d3Rgb,
        axisBottom: d3AxisBottom, axisLeft: d3AxisLeft,
      } = d3

      const parsedDaysHours = curData.reduce((memo, item) => {
        if (!memo.weekDays.includes(item.day)) {
          memo.weekDays.push(item.day)
        }
        if (!memo.hours.includes(item.hour)) {
          memo.hours.push(item.hour)
        }
        return memo
      }, { weekDays: [], hours: [] })

      // var divbox = document.getElementById(wrapper);
      // console.log(wrapper.offsetWidth);

      const margin = { top: 0, right: 0, bottom: 50, left: 50 }
      const width = 800 - margin.left - margin.right
      const height = 300 - margin.top - margin.bottom
      const DURATION = 2000
      const xGridSize = Math.floor(width / parsedDaysHours.weekDays.length)-5
      // const xGridSize = 5
      const yGidSize = Math.floor(height / parsedDaysHours.hours.length)

      const svgData = d3Select(wrapper).selectAll('svg').data(['dummy data'])
      const svgEnter = svgData.enter().append('svg')
      svgEnter.attr("width", width + margin.left + margin.right)
      svgEnter.attr("height", height + margin.top + margin.bottom)

      const gEnter = svgEnter.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('class', 'heatmap')
      const svgMerge = svgData.merge(svgEnter)
      const gMerge = svgMerge.selectAll('g.heatmap')

      const freeColor = '#f9f5ef'
      const loadColor = '#a13d3b'
      const colorScale = d3ScaleLinear()
        .domain([0, 60]).range([d3Rgb(freeColor), d3Rgb(loadColor)])

      const xScale = d3ScaleBand()
        .domain(parsedDaysHours.weekDays)
        .range([0, parsedDaysHours.weekDays.length * xGridSize])

      const xAxis = d3AxisBottom(xScale)

      gEnter.append("g")
        .attr('class', 'x')
        .attr('transform', `translate(0, ${height})`)
        // .style('font-size', '4em !important')
      gMerge
        .select('g.x')
        .transition()
        .duration(DURATION)
        .call(xAxis)

      const yScale = d3ScaleBand()
        .domain(parsedDaysHours.hours)
        .range([height, 0])

      const yAxis = d3AxisLeft(yScale)

      gEnter.append("g")
        .attr('class', 'y')
      gMerge
        .select('g.y')
        .transition()
        .duration(DURATION)
        .call(yAxis)

      const tooltipData = d3Select(wrapper)
        .selectAll('div').data(['dummy data'])

      const tooltipEnter = tooltipData.enter()
        .append('div')
        .attr('class', 'tooltip')
        .style('background', '#ffffff')
        .style('color', '#000000')
        .style('display', 'none')
        .style('top', 0)
        .style('left', 0)
        .style('padding', '10px')
        .style('position', 'absolute')

        // console.log("test here")
      const tooltipMerge = tooltipData.merge(tooltipEnter)

      const heatBoxData = gMerge.selectAll('g.hour')
        .data(curData, (d) => `${d.day}:${d.hour}`)

      heatBoxData.exit().remove()

      const heatBoxEnter = heatBoxData.enter()
        .append('g')
        .attr('class', 'hour')

      heatBoxEnter.append("rect")
        .attr("x", (d) => xScale(d.day))
        .attr("y", (d) => yScale(d.hour))
        .attr("rx", 4)
        .attr("ry", 4)
        // .attr("width", '100%')
        // .attr("height", 'auto')
        .attr("width", xGridSize)
        .attr("height", yGidSize)
        .attr("stroke", '#000000')
        .attr("stroke-width", 1)
        .style("fill", freeColor)

      const heatBoxMerge = heatBoxData.merge(heatBoxEnter)
      heatBoxMerge.select('rect')
        .transition().duration(DURATION)
        .style("fill", (d) => colorScale(d.value))

      heatBoxEnter.append('text')
        .style('font-size', '10px')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr("x", (d) => xScale(d.day) + xGridSize/2)
        .attr("y", (d) => yScale(d.hour) + yGidSize/2)

      heatBoxMerge.select('text')
        .text((d) => d3.format(',.2f')(d.value))

      heatBoxMerge
        .on('mouseover', (d) => {
          tooltipMerge
            .text(`${d.value} at ${d.day} ${d.hour}`)
            .style('box-shadow', `0 0 5px ${colorScale(d.value)}`)
            .style('border', `1px solid ${colorScale(d.value)}`)
            .style('display', 'block')
        })
        .on('mousemove', () => {
          tooltipMerge
            .style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
            .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
        })
        .on('mouseout', () => {
          tooltipMerge.style('display', 'none')
        })
    }

    function destroyChart (wrapper) {
      const {select: d3Select} = d3
      d3Select(wrapper).selectAll('*').remove()
    }

    d3.json('../data/data_heatmap.json').then(data => {
        // console.log(data);
        var dataSlice = data.filter(d => d.hour%120 ==0)
        // console.log(dataSlice)
        dataSlice.forEach((item, i) => {
            item.hour = item.hour/60
        });

        renderChart(document.querySelector('#heatmap_1'), dataSlice);
    });

}());
