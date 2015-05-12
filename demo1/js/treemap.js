
var margin = {top: 40, right: 10, bottom: 10, left: 10},
//    width = 600 - margin.left - margin.right,
//    height = 1000 - margin.top - margin.bottom;
      width = document.getElementById("main").clientWidth,
      height = document.getElementById("main").clientHeight;

var color = d3.scale.category20c();

var scale = d3.scale.linear()
                    .domain([2000000, 10000000000])
                    .range([10, 200]);

var treemap = d3.layout.treemap()
    .size([width, height])
    //.sticky(true)
    .sort(function comparator(a, b) { return b.amount - a.amount; })
    .value(function(d) { return scale(d.amount); });

var div = d3.select("#main").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

d3.json('/data/mockdata-truncated-01.json', function (error, data) {
  var node = div.datum(data).selectAll(".node")
        .data(treemap.nodes)
      .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) { return d.children ? null : color(d.title); })
        .append("span") /* titles inside a span */
            .text(function(d) { return d.children ? null : d.title;});

    var subnodes = node.each( function(d) { 
      if (d.subnodes) { 
        n = d3.select(this).selectAll(".subnode")
            .data(d.subnodes)
          .enter().append("div")

            .style("position", "relative")
            .style("width", "30px")
            .style("height", "30px")
            .style("left", "5px")
            .style("top", "5px")

            .attr("class", "subnode")
            .call(position)
            .style("background", function(s) { return color(s.title); })
            .text(function(s) { return s.title; });
                  ;
        console.log(n);
        // n.subnodes.each( function(s) { console.log(s) });
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

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
