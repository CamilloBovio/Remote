// $Id: interface_utils.js,v 1.1 2009/09/15 03:38:45 techsoldaten Exp $
/**
 * interface_utils.js
 * 
 * Provides some functions for dealing with common interface tasks
 * 
 */
/*global Drupal, $, document, jQuery, regions, x */
Drupal.behaviors.utils = function(context) {
  return;
  /**
   * Ensures the interface add form submits to the right place
   */
  if($('#interface-admin-add-interface').length > 0){
    $('#interface-admin-add-interface').submit(function(){
      this.action = this.action + '/' + $('#edit-type').val() + '/' + $('#edit-theme').val() + '/' + $('#edit-interface-context').val();
    });
  }
};

/**
 * Move summary split button with body field
 */
Drupal.behaviors.splitSummaryfix = function (context) {
  var $summary = $('.teaser-checkbox');
  // we have body field and split button
  if ($summary.length > 0) {
    $summary.prependTo("#edit-body-wrapper");
  }
}

if (!Drupal.toJson) {
  Drupal.toJson = function(v) {
    switch (typeof v) {
      case 'boolean':
        return v == true ? 'true' : 'false';
      case 'number':
        return v;
      case 'string':
        return '"'+ v +'"';
      case 'object':
        var output = "{";
        for(i in v) {
          output = output + '"' + i + '"' + ":" + this.toJson(v[i]) + ",";
        }
        if (output.substring(output.length -1) == ',') {
          output = output.substring(0, output.length - 1);
        }
        output = output + "}";
        return output;
      default:
        return 'null';
    }
  }
}
