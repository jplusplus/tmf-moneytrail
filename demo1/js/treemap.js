var container = document.getElementById("main")

var scale = d3.scale.linear()
                    .domain([40000000, 10000000000])
                    //.range([40, 10000]); // proportional values
                    .range([200, 10000]);
var margin = {top: 40, right: 10, bottom: 10, left: 10};
var width = container.offsetWidth < 800 ? container.offsetWidth : 800;
var height = container.offsetHeight;

var color = d3.scale.category20c();

// HELPER FUNCTIONS

// Get language from GET params, if specified, otherwise default to English
// https://stackoverflow.com/a/21210643
var queryDict = {}
location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
var lang = "en"
if (queryDict.lang) { 
  lang = queryDict.lang; 
}

// Set location of data file based on language
var datafile = "./data/data.json"
if (lang == "fr") {
  datafile = "./data/data-fr.json";
}
if (lang == "de") {
  datafile = "./data/data-de.json";
}

function formatAmount(amount) {
    // Stub function to return properly formatted amounts
    if (amount / 1000000 > 1) {
      return Math.round(amount / 1000000) + " million €"
    } else {
      return amount + " €";
    }
}

function getNodeById(node_obj, id) {
  // Gets a node by its id number, node_obj is a D3 selection containing all nodes
  result = node_obj.filter(function(n) { return n.id == id })[0][0];
  return result;
}

function getSubnodeDims(subnode, nodes) {
  // Calculates dimensions (width and height) for a single subnode based on its amount.
  node = getNodeById(nodes, subnode['parent']);
  // console.log("subnode: ", subnode.title, subnode.amount);
  // console.log("parent: ", node.__data__.title, node.__data__.amount);
  parent_w = node.offsetWidth;
  parent_h = node.offsetHeight;
  ratio = subnode.amount / node.__data__.amount;
  // console.log("ratio: ", ratio);
  if (parent_w > parent_h) {
    // horizontal node
    subnode_h = Math.round(parent_h - 10);
    subnode_w = Math.round(parent_w * ratio);
    if (subnode_w < 20) { subnode_w = 20; }
  }
  else {
    // vertical node
    subnode_w = Math.round(parent_w - 10);
    subnode_h = Math.round(parent_h * ratio);
    if (subnode_h < 20) { subnode_h = 20; }
  }
  // console.log(subnode.title + " dims: " + subnode_w + "x" + subnode_h)
  return [subnode_w, subnode_h];
}

function getModalContent(node) {
    // Generate the HTML to be placed inside a node's modal dialog.
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
    return contents;
}

function position() {
  // Called on every element redraw to determine its position
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}


// Set up the treemap
var treemap = d3.layout.treemap()
    .size([width, height])
    .ratio(0.8)
    .sticky(true)
    .sort(function comparator(a, b) { return b.amount - a.amount; })
    .value(function(d) { return scale(d.amount); });
    

function drawTreemap() {
    // Main draw function. Gets called on each redraw.

    width = container.offsetWidth < 800 ? container.offsetWidth : 800;
    height = container.offsetHeight;
    console.log(width, height);
    treemap.size([width, height]);

    // Remove existing containers
    d3.select('#treemap-container').remove();
    d3.select('#modals-container').remove();

    // Add the treemap container div
    var div = d3.select("#main").append("div")
        .style("position", "relative")
        .style("width", width + "px")
        .style("height", height + "px")
        //.style("width", (width + margin.left + margin.right) + "px")
        //.style("height", (height + margin.top + margin.bottom) + "px")
        .attr("id", "treemap-container");
    // Add the modals container div
    var modals = d3.select("body").append("div")
        .attr("id", "modals-container");

    // Populate the treemap
    d3.json(datafile, function (error, data) {
      var node = div.datum(data).selectAll(".node")
            .data(treemap.nodes)
          .enter().append("div")
            .attr("class", "node")
            .attr("data-reveal-id", function(d) { return "modal-" + d.id; })
            .call(position)
            .style("background", function(d) { return d.color; });

      // Hide the root node
      node.filter(function(d) { return d.title == "root"; }).style("display", "none").style("visibility", "hidden");
      // Each node div contains a node-contents div, which itself
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

      // Create the hidden dialog divs
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

      // Add the subnodes to the treemap
      var subnodes = node.each( function(d) {
        // Only care about nodes that have children
        if (d.subnodes) {
          n = d3.select(this).select(".node-contents").selectAll(".subnode")
              .data(d.subnodes)
            .enter().append("div")
              .style("width", function(d) { return getSubnodeDims(d, node)[0] + "px"; })
              .style("height", function(d) { return getSubnodeDims(d, node)[1] + "px"; })
              .attr("class", "subnode")
              .attr("data-reveal-id", function(d) { return "modal-" + d.id; })
              .call(position)

          // Add their titles and amounts
          contents = n.append("p")
            .attr("class", "subnode-details");
          contents.append("span")
            .attr("class", "subnode-amount")
            .text(function(s) { return formatAmount(s.amount); });
          contents.append("span")
            .attr("class", "subnode-title")
            .text(function(s) { return s.title; });

          // Attach the dialogs to each subnode
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
      // hack for bottom alignment
      // node.select(".node-contents").append("span")
      //    .attr("class", "after")

      // Redistribute treemap elements on data change
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

// Redraw on resize
d3.select(window).on('resize', resize);

function resize() {
  width = container.clientWidth,
  height = container.clientHeight;
  drawTreemap();
}

