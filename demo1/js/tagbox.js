 jQuery(function() {

   // Load tag list
   $.getJSON("data/tags.json", function(data) {
     jQuery("#filters").autocomplete({
       source: data.tags,
       minLength: 0,
     })
     .focus(function () {
       $(this).autocomplete("search");
     });
   });
});
