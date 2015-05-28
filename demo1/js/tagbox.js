jQuery(function() {
  // Load tag list and setup autocomplete
  $.getJSON("data/tags.json", function(data) {
    jQuery("#filters").autocomplete({
      source: data.tags,
      minLength: 0,
    })
    .focus(function () {
      // Show suggestion box on focus
      $(this).autocomplete("search");
    });
  });
});
