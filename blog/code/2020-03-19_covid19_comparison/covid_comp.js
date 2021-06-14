d3.json('https://pomber.github.io/covid19/timeseries.json').then(data=>{

  var margin = {top: 50, right: 500, bottom: 50, left: 75},
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight * .5;

  var n = data['China'].length;

  var xScale = d3.scaleLinear()
    .domain([0, n+10])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([0, 3000000])
    .range([height, 0]);

  var svg = d3.select("#cases").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale));

  // China
  var countries = [
    ["China", "#06a94d"],
    ["Italy", "#1167b1"],
    ["US", "#ffab00"],
    ["Korea, South", "black"],
    ["Spain", "brown"]
  ];

  for (c in countries) {

    var country = countries[c][0];
    var color = countries[c][1];

    var line = d3.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d, i) { return yScale(d.confirmed); })
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data[country])
      .attr("class", "line")
      .style("stroke", color)
      .attr("d", line);

    /*
      svg.append("text")
  		.attr("x", (width + margin.left + margin.right - 50))
      .attr("y", yScale(data[country][n - 1].confirmed))
  		.style("fill", color)
  		.text(country);
    */



    var update = data[country][n - 1].date;
    document.getElementById("getDate").innerHTML = update;

  };


});
