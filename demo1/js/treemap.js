var container = document.getElementById("main")


// HELPER FUNCTIONS

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

function getRandomInt(min, max) {
    // https://stackoverflow.com/a/1527820
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatAmount(amount) {
    return amount + " €";
}

// VIZ-SPECIFIC FUNCTIONS

function getModalContent(node) {
    contents = "";
    contents += '<h2>' + node.title + '</h2>';
    contents += '<h3>' + node.amount + '€</h3>';
    contents += '<ul class="tags">';
    // FIXME: Subnodes should inherit the parent node's tags
    if (node.tags) {
      for (i = 0; i < node.tags.length; ++i) {
        contents += '<li>' + node.tags[i] + '</li>';
      }
    }
    contents += '</ul>';
    contents += marked(node.text);
    contents += '<a class="close-reveal-modal" aria-label="Close">&#215;</a>';
    return contents
}

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

function drawTreemap() {
    // remove previous container if it exists
    d3.select('#treemap-container').remove();

    var margin = {top: 40, right: 10, bottom: 10, left: 10};
    var width = container.offsetWidth < 800 ? container.offsetWidth : 800;
    var height = container.offsetHeight;

    var color = d3.scale.category20c();
    var scale = d3.scale.linear()
                        .domain([3000000, 10000000000])
                        .range([7, 200]);

    var treemap = d3.layout.treemap()
        .size([width, height])
        .ratio(2)
        .sort(function comparator(a, b) { return b.amount - a.amount; })
        .value(function(d) { return scale(d.amount); });

    var div = d3.select("#main").append("div")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .attr("id", "treemap-container");

    var modals = d3.select("body").append("div")
        .attr("id", "modals-container");

    d3.json('./data/data.json', function (error, data) {
      var node = div.datum(data).selectAll(".node")
            .data(treemap.nodes)
          .enter().append("div")
            .attr("class", "node")
            .attr("data-reveal-id", function(d) { return "modal-" + d.id; })
            .call(position)
            .style("background", function(d) { return color(d.title); });


        // hide root node
        node.filter(function(d) { return d.title == "root"; }).style("display", "none").style("visibility", "hidden");

        // the node div contains a node-contents div, which itself
        // contains the title, amount and subnodes
        contents = node.append("div")
          .attr("class", "node-contents");
        contents_text = contents.append("p")
	  .attr("class", "node-details")
        contents_text.append("span") // amount
          .attr("class", "node-amount")
          .text(function(d) { return formatAmount(d.amount); });
        contents_text.append("span") // title
          .attr("class", "node-title")
          .text(function(d) { return d.title; });

      var dialog = modals.datum(data).selectAll(".reveal-modal")
            .data(treemap.nodes)
          .enter().append("div") // Modal dialog (see Foundation Reveal docs)
          .attr("id", function(d) { return "modal-" + d.id; })
          .attr("class", "reveal-modal")
          .attr("data-reveal", "foo")
          .attr("aria-labelledby", "modalTitle")
          .attr("aria-hidden", "true")
          .attr("role", "dialog")
          .html(function(d) { return d.text ? getModalContent(d) : null; });

        var subnodes = node.each( function(d) {
          if (d.subnodes) {
            n = d3.select(this).select(".node-contents").selectAll(".subnode")
                .data(d.subnodes)
              .enter().append("div")
                // FIXME: Get proper dimensions from the subnode's amount
                .style("width", function(d) { return getRandomInt(20, 150) + "px"; })
                .style("height", function(d) { return getRandomInt(20, 150) + "px"; })
                .attr("class", "subnode")
                .attr("data-reveal-id", function(d) { return "modal-" + d.id; })
                .call(position)
                .style("background", function(s) { return color(s.title); });

            n.append("span") /* titles inside spans */
              .text(function(s) { return s.title; });

            jQuery.each(d.subnodes, function(i) {
              s = d.subnodes[i];
              dialog.append("div")
                .attr("id", function(x) { return "modal-" + s.id; })
                .attr("class", "reveal-modal")
                .attr("data-reveal", "foo")
                .attr("aria-labelledby", "modalTitle")
                .attr("aria-hidden", "true")
                .attr("role", "dialog")
                .html(function(x) { return s.text ? getModalContent(s) : null; });
              });
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

drawTreemap();

<<<<<<< HEAD
// redraw on resize
d3.select(window).on('resize', resize); 
=======
d3.select(window).on('resize', resize);
>>>>>>> 48d8b8a111bdadf502d1e978ba44ac072c942623

function resize() {
  width = container.clientWidth,
  height = container.clientHeight;
  console.log([width, height]);
  drawTreemap();
}

