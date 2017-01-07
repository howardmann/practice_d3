document.addEventListener("DOMContentLoaded", function(){
  console.log("ready");

  // Selections and method chaining
  // d3.select('css-selector').append('element').html('text').style('property','name');

  // d3.select('.chart').append('div').html('Bar chart').style('color', 'red');

  // bar chart html
  // var data = [4, 6, 8, 15, 16, 23, 42];
  //
  // var scaleX = d3.scaleLinear()
  //   .domain([0, d3.max(data)])
  //   .range([0, 80]);
  //
  // d3.select(".bar-chart")
  //   .selectAll("div")
  //     .data(data)
  //   .enter().append("div")
  //     .classed('bar', true)
  //     .style("width", function(d) { return scaleX(d) + "%"; })
  //     .text(function(d) { return d; });
  //
  // // bar chart load csv
  // d3.csv("test.csv", function(data){
  //   var x = d3.scaleLinear()
  //     .domain([0, d3.max(data, function(d){
  //       return parseInt(d.Revenue);
  //     })])
  //     .range([0, 80]);
  //
  //   d3.select('.bar-chart-csv')
  //     .selectAll('div')
  //       .data(data)
  //     .enter().append('div')
  //       .classed('bar', true)
  //       .style('width', function(d) { return x(d.Revenue) + '%';})
  //       .text(function(d) {return Math.round(d.Revenue);});
  //
  // });
  //
  //
  // // // bar chart svg
  // var barHeight = 25;
  //
  // d3.csv("test.csv", function(data){
  //   var scaleXSVG = d3.scaleLinear()
  //       .domain([0, d3.max(data, function(d){
  //         return parseInt(d.Revenue);
  //       })])
  //       .range(['0%', '80%']);
  //
  //   var chartSVG = d3.select(".bar-chart-svg")
  //       .attr("width", '100%')
  //       .attr("height", barHeight * data.length);
  //
  //   var bar = chartSVG.selectAll("g")
  //       .data(data)
  //     .enter().append("g")
  //       .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
  //
  //   bar.append("rect")
  //       .attr("width", function(d){
  //         return scaleXSVG(d.Revenue);
  //       })
  //       .attr("height", barHeight - 1);
  //
  //   bar.append("text")
  //       .attr("y", barHeight / 2)
  //       .attr("x", function(d){
  //         return scaleXSVG(d.Revenue);
  //       })
  //       .attr("dy", ".35em")
  //       .text(function(d) { return Math.round(d.Revenue); });
  // });

  // LINE CHART

  // Set the dimensions and margins of the graph - We set the margins as the graph needs padding inside the chart
  var margin = {top: 20, right: 20, bottom: 30, left: 50};
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  // Parse the date/ time
  var parseTime = d3.timeParse('%d-%b-%y');

  // Set the x and y ranges to the graph dimensions
  var scaleX = d3.scaleTime().range([0, width]);
  var scaleY = d3.scaleLinear().range([height, 0]);

  // Define the inbuilt d3 line and its x and y coordinates. Here it takes the data and close value for its x and y (path generator for the svg line)
  // Needs teo be fit to the scale defined above for x and y
  var valueline = d3.line()
    .x(function(d) { return scaleX(d.date); })
    .y(function(d) { return scaleY(d.close); });

  // Select the svg object on the page and set the width and height of the canvas
  // append a 'group' element to the 'svg' (think of this as an svg div)
  // move the group element to the top left margin (the top of our chart, this is where we start drawing the graph)
  var svg = d3.select('.line-chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Fetch the csv data
  d3.csv('data.csv', function(err, data){
    if(err) throw err;

    // Format the data by parsing date (method defined above) and integer
    data.forEach(function(d){
      d.date = parseTime(d.date);
      d.close = parseInt(d.close);
    });

    // Scale the range of the data (min and max dates for x axis and 0 to max for y axis)
    scaleX.domain(d3.extent(data, function(d) {return d.date;}));
    scaleY.domain([0, d3.max(data, function(d) { return d.close ;})]);

    // Add the valueline path (the line).
    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', valueline);

    // // === BARCHART DEMO
    // // Create individual bar groups appending the data and setting the position
    // var barWidth = width/ data.length; // Set equidistant to graph
    // var bar = svg.selectAll('g')
    //     .data(data, function(d){ return d.close; })
    //   .enter().append('g')
    //     .attr('transform', function(d, i) { return `translate(${i * barWidth}, 0)`} );
    //
    // // Add a rectanble to each bar group with the width and height based on data setting
    // bar.append('rect')
    //   .attr('y', function(d){return height - scaleY(d.close)})
    //   .attr('width', barWidth - 1)
    //   .attr('height', function(d){
    //     return scaleY(d.close);
    //   });
    //
    // bar.append('text')
    //   .attr('y', function(d){return height - scaleY(d.close)})
    //   .attr('dx', '0.5em')
    //   .text(function(d) { return d.close})
    // // === BARCHART DEMO

    // Add the X axis (start at bottom left of chart)
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(scaleX));

    // Add the y axis (start at top left of chart)
    svg.append('g')
      .call(d3.axisLeft(scaleY));

  });




});
