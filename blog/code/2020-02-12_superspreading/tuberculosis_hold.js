var local_path = "blog/code/2020-02-12_superspreading/tuberculosis_network.json";
var online_path = "https://raw.githubusercontent.com/j-berg/j-berg.github.io/main/blog/code/2020-02-12_superspreading/tuberculosis_network.json"

d3.json(online_path).then(data => {

  var width = 675;
  var height = window.innerHeight * 0.8;
  var start = 90;
  var end = 160;
  var timeTransition = 8000;

  var x = d3.scaleLinear()
    .domain([start, end])
    .range([90, width - 200])
    .clamp(true);

  const links = data.links;
  const nodes = data.nodes;

  var svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width * .99 + 30)
    .attr("height", height - 160)
    .call(d3.zoom().on("zoom", function() {
      svg.attr("transform", d3.event.transform)
    }))
    .on("dblclick.zoom", null)
    .append("g");

  const forceX = d3.forceX(width / 2).strength(0.015)
  const forceY = d3.forceY(height / 2).strength(0.015)

  simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
      .id(d => d.id)
      .distance(100)
      .strength(1))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(width / 2, height / 2))

  simulation.alphaTarget(0.01).alphaMin(0.1).velocityDecay(0.70)

  svg.append("defs").selectAll("marker")
    .data(["end"])
    .enter()
    .append("marker")
    .attr("id", function(d) {
      return d;
    })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15.7)
    .attr("refY", -0.18)
    .attr("markerWidth", 8)
    .attr("markerHeight", 12)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0, -5L10, 0L0, 5");

  var link = svg.append("g").selectAll("path")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("marker-end", function(d) {
      return "url(#end)";
    });

  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  var circle = node
    .append("circle")
    .attr("r", 6)

  var text = node
    .append("text")
    .html(d => "<tspan dx='16' y='0.31em' style='font-weight: bold;'>" + d.id + "</tspan>");

  simulation.on("tick", tick);

  var cell = node
    .append("path")
    .attr("class", "cell");

  // Add slider bar
  var slider = d3
    .select("#bar")
    .append("svg")
    .attr("width", width - 200)
    .attr("height", 50)
    .attr("overflow", "visible")
    .style("margin-top", "15px")
    .style("margin-left", "45px");

  slider.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + 50 + "," + height / 2 + ")")

  slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(d3.drag()
      .on("start.interrupt", function() {
        slider.interrupt();
      })
      .on("start drag", function() {
        hue(x.invert(d3.event.x));
      }));

  slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d;
    });

  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 17);

  var label = slider.append("text")
    .attr("class", "label")
    .text(start)
    .attr("transform", "translate(" + start + ",7)")

  slider.transition() // Gratuitous intro!
    .duration(timeTransition)
    .tween("hue", function() {
      var i = d3.interpolate(start, end);
      return function(t) {
        hue(i(t));
      };
    });

  var playButton = d3.select("#play-button");

  // Draw curved edges
  function tick() {

    link.attr("d", linkArc);
    circle.attr("transform", transform);
    text.attr("transform", transform);

  };

  function linkArc(d) {
    var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  }

  function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }

  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0.05).alphaMin(0.06).velocityDecay(0.70);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }

  playButton.on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {

      slider.transition() // Gratuitous intro!
        .duration(0)
        .tween("hue", function() {
          var i = d3.interpolate(x.invert(handle.attr("cx")), x.invert(handle.attr("cx")));
          return function(t) {
            hue(i(t));
          };
        });

      button.text("Play");

    } else {

      // If button at end, start it back from the beginning
      if (x.invert(handle.attr("cx")) > end - 1) {
        starter = start
      } else {
        starter = x.invert(handle.attr("cx"))
      }

      slider.transition() // Gratuitous intro!
        .duration(timeTransition - (1000 * end / x.invert(handle.attr("cx"))))
        .tween("hue", function() {
          var i = d3.interpolate(starter, end);
          return function(t) {
            hue(i(t));
          };
        });

      button.text("Pause");
    }

  })

  function hue(h) {
    handle
      .attr("cx", x(h));
    label
      .text(Math.round(h))
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + x(h) + ",7)")

    node.each(function(d) {

      if (d.time < h) {
        d3.select(this)
          .select("circle")
          .style("fill", "rgba(214, 69, 65, 1)")
          .style("stroke", "black")
      } else {
        d3.select(this)
          .select("circle")
          .style("fill", "white")
          .style("stroke", "black")
      }

    })

    // If slide takes it to the end, reset button
    if (h > end - 0.01) {

      d3.select("#play-button").text("Play");
    }
  }

})
