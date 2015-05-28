 jQuery(function() {

   // Load tag list
   //

   var names = "";
   $.getJSON( "data/tags.json", function( data ) {  
     names = data.tags;
   });

   // Autocomplete setup, most comes straight from the jQuery UI accent example
   var accentMap = {
     "á": "a",
     "ö": "o"
   };
   var normalize = function( term ) {
     var ret = "";
     for ( var i = 0; i < term.length; i++ ) {
       ret += accentMap[ term.charAt(i) ] || term.charAt(i);
     }
     return ret;
   };
   jQuery( "#filters" ).autocomplete({
     // init
     source: function( request, response ) {
       var matcher = new RegExp( jQuery.ui.autocomplete.escapeRegex( request.term ), "i" );
       response( jQuery.grep( names, function( value ) {
         value = value.label || value.value || value;
         return matcher.test( value ) || matcher.test( normalize( value ) );
       }) );
     }
   });
 });
