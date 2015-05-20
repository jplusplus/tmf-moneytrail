var container = document.getElementById("main") 

// create hashes from strings
// from https://stackoverflow.com/a/7616484
String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
      if (this.length == 0) return hash;
        for (i = 0, len = this.length; i < len; i++) {
              chr   = this.charCodeAt(i);
                  hash  = ((hash << 5) - hash) + chr;
                      hash |= 0; // Convert to 32bit integer
                        }
          return hash;
};

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

    var modals = d3.select("body").append("div")
        .attr("id", "modals-container");

    d3.json('/data/mockdata-truncated-01.json', function (error, data) {
      var node = div.datum(data).selectAll(".node")
            .data(treemap.nodes)
          .enter().append("div")
            .attr("class", "node")
            .attr("data-reveal-id", function(d) { return "modal-" + Math.abs(d.title.hashCode()); })
            .call(position)
            .style("background", function(d) { return color(d.title); });


        // remove root node
        node.filter(function(d) { return d.title == "root"; }).remove()

        // the node div contains a node-contents div, which itself
        // contains the title, amount and subnodes
        contents = node.append("div")
          .attr("class", "node-contents"); 
        contents.append("span") // title
          .text(function(d) { return d.title; });

      var dialog = modals.datum(data).selectAll(".reveal-modal")
            .data(treemap.nodes)
          .enter().append("div") // Modal dialog (see Foundation Reveal docs)
          .attr("id", function(d) { return "modal-" + Math.abs(d.title.hashCode()); })
          .attr("class", "reveal-modal")
          .attr("data-reveal", "foo")
          .attr("aria-labelledby", "modalTitle")
          .attr("aria-hidden", "true")
          .attr("role", "dialog")
          .html(function(d) { return d.text ? marked(d.text) + '<a class="close-reveal-modal" aria-label="Close">&#215;</a>' : null; });

        var subnodes = node.each( function(d) { 
          if (d.subnodes) { 
            n = d3.select(this).select(".node-contents").selectAll(".subnode")
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

