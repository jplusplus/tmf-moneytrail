var container = document.getElementById("main") 

function drawTreemap() {

    // remove previous container if it exists
    d3.select('#treemap-container').remove();

    var margin = {top: 40, right: 10, bottom: 10, left: 10},
          width = container.offsetWidth,
          height = container.offsetHeight;

    console.log([width, height]);

    var color = d3.scale.category20c();

    var scale = d3.scale.linear()
                        .domain([2000000, 10000000000])
                        .range([10, 200]);

    var treemap = d3.layout.treemap()
        .size([width, height])
        .sort(function comparator(a, b) { return b.amount - a.amount; })
        .value(function(d) { return scale(d.amount); });

    var div = d3.select("#main").append("div")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .attr("id", "treemap-container");

    d3.json('/data/mockdata-truncated-01.json', function (error, data) {
      var node = div.datum(data).selectAll(".node")
            .data(treemap.nodes)
          .enter().append("div")
            .attr("class", "node")
            .call(position)
            .style("background", function(d) { return color(d.title); });

        // remove root node
        node.filter(function(d) { return d.title == null; }).remove()

        node.append("span") /* titles inside spans */
          .text(function(d) { return d.title; });

        node.append("div") /* Info text */
          .attr("class", "tooltip")
          .append("p")
          .html(function(d) { return d.text ? marked(d.text) : null; });

        var subnodes = node.each( function(d) { 
          if (d.subnodes) { 
            n = d3.select(this).selectAll(".subnode")
                .data(d.subnodes)
              .enter().append("div")
                // FIXME: Get proper dimensions from the subnode's amount
                .style("width", "30px")
                .style("height", "30px")
                .attr("class", "subnode")
                .call(position)
                .style("background", function(s) { return color(s.title); });

            n.append("span") /* titles inside spans */
              .text(function(s) { return s.title; });
          } 
        });



        d3.selectAll("input").on("change", function change() {
          var value = this.value === "count"
              ? function() { return 1; }
              : function(d) { return scale(d.amount); };

          node
              .data(treemap.value(value).nodes)
            .transition()
              .duration(1500)
              .call(position);
        });
    });
}

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

drawTreemap();

d3.select(window).on('resize', resize); 

function resize() {
  width = container.clientWidth,
  height = container.clientHeight;
  console.log([width, height]);
  drawTreemap();
}

