  // $Id: dragndrop.js,v 1.1 2009/09/15 03:38:45 techsoldaten Exp $

/**
 * dragndrop.js
 * 
 * Drag and drop manipulation for form elements in the interface module.
 * 
 * Allows users to drag form elements and place them within regions through
 * an interface theme.
 * 
 */
/*global Drupal, $, document, jQuery */
Drupal.behaviors.dragndrop = function(context) {
  
  // turn off form submit behaviors in the form being authored
  Drupal.neuter_forms();
  
  // initialize dragging behavior
  Drupal.init_drags();
  
};
/**
 * sets up submit buttons for dragging and removes the submit action from forms.
 *
 */
Drupal.neuter_forms = function() {
  
  // surround all form buttons with a .form-item. this will allow submit buttons
  // to be dragged.
  $(':submit', Drupal.settings.interface_author_limit).each(function(){
      var check = $(this).attr('id');
      var string = '<div id="' + check + '" class="form-button-holder"></div>';
      $(this).wrap(string);
    });
  
  // remove the submit action from the form being authored. this form does not need to 
  // submit while it is being authored.
  $('.form-submit', Drupal.settings.interface_author_limit).click(function(){
    return false;
  });
  
  return false;  
};
/**
 * Initializes dragging behavior throughout interface.
 *
 */
Drupal.init_drags = function(){
  
  // initialize draggable items
  // select only the form items in the node form that is being edited
  Drupal.settings.form_item_string = Drupal.settings.interface_selectors.join(',');
  Drupal.settings.form_item_exclude_string = Drupal.settings.interface_exclusions.join(',');
  
  // register all draggable form items.
  Drupal.settings.form_items = $(
    Drupal.settings.form_item_string, 
    Drupal.settings.interface_author_limit).not(
      // $(Drupal.settings.interface_exclusions)
      $(Drupal.settings.form_item_exclude_string)
    );
 
  // make all form items toggle a class on hover
  Drupal.settings.form_items.hover(
    Drupal.interface_item_hover,
    function(){
      $(this).removeClass('interface-element-over');
    }
  );
  
  // make all form items draggable
  Drupal.settings.form_items.draggable({
    cursor: 'pointer',
    revert: 'invalid',
    /* snap: 'true', */
    start: Drupal.start_drag,
    stop: Drupal.stop_drag,
    scroll: true
  }).disableSelection();
  
  // make all the form items droppable
//  Drupal.settings.form_items.droppable(
//    {
//    	accept: Drupal.settings.form_item_string,
//    	activeClass: 'interface-region-droppable',
//    	hoverClass: 'interface-region-hover',
//    	tolerance: 'pointer',
//    	over: Drupal.show_marker_element,
//    	out: Drupal.remove_marker,
//    	drop: Drupal.drop_element
//    }
//  );
  
  // make all regions droppable
  var regions = Drupal.settings.regions;
  for (var region in regions){
    $('.' + regions[region]).droppable(
      {
      	accept: Drupal.settings.form_item_string,
      	activeClass: 'interface-region-droppable',
      	hoverClass: 'interface-region-hover',
      	tolerance: 'pointer',
      	over: Drupal.show_marker_region,
      	out: Drupal.remove_marker,
      	drop: Drupal.drop_region,
        greedy : true
      }
    );
  }
  
  // initialize drop targets
  Drupal.init_drops();
  
  return false;
};

// initialize the drops
Drupal.init_drops = function(){
  $(Drupal.settings.form_items/*, Drupal.settings.interface_author_limit*/).droppable({
  // Drupal.settings.form_items.droppable({
  	accept: Drupal.settings.form_item_string,
  	// accept: Drupal.settings.form_items,
  	activeClass: 'drop-active',
  	hoverClass: 'drop-hover',
  	tolerance: 'pointer',
    greedy : true,
  	over: Drupal.show_marker,
  	out: Drupal.remove_marker,
    drop: Drupal.drop_element
  });
  return;
};


// controls behavior when a form element is hovering over something else
Drupal.interface_item_hover = function(){
  // change the display of an element when it is being hovered
  $(this).addClass('interface-element-over');
  
  // button holder code - hit will happen on submit buttons sometimes
//  if($(this).parents('.form-button-holder')){
//    $(this).parents('.form-button-holder').addClass('interface-element-over');
//  }
};

// adds the item maker to a region
Drupal.show_marker_region  = function (event, ui){
  $('#drop-marker').remove();
  $('<div id="drop-marker"></div>').appendTo($(this));
  return;
};

// display a marker element within the interface code, to allow people to see
// where something is about to be dropped
Drupal.show_marker = function (event, ui){
  $('#drop-marker').remove();
  // $('<div id="drop-marker"></div>').before($(this));
  $('<div id="drop-marker"></div>')/*.css('height', ui.draggable.height() + 'px')*/.insertBefore($(this));
  return;
};

// display a marker element within the interface code, to allow people to see
// where something is about to be dropped
// this one is for form elements. it is expected that, over time, different behavior will be 
// required for form elements and regions.
Drupal.show_marker_element  = function (event, ui){
  // make sure there is no marker
  $('#drop-marker').remove();
  // display the marker
  $('<div id="drop-marker"></div>').insertAfter($(this));
  return;
};

// remove a marker from the screen
Drupal.remove_marker = function (event, ui){
  $('#drop-marker').remove();
  return;
};

// places a form element inside a region
Drupal.drop_region = function (event, ui) {  
  // replace the current drop marker with the appropriate region element
  $('#drop-marker').replaceWith(ui.draggable);
  
  // hide the draggable element
  ui.draggable.css('left', '0px');
  ui.draggable.css('top', '0px');
  
  // reinit all the drop areas
  Drupal.init_drops();
  
  return;
};
// places a form element after another form element
Drupal.drop_element = function (event, ui){
  // replace the drop marker
  $('#drop-marker').replaceWith(ui.draggable);
  
  // reset the draggable element
//  ui.draggable.css('position', 'relative');
  ui.draggable.css('left', '0px');
  ui.draggable.css('top', '0px');
  
  // reinitialize all the drop areas
  Drupal.init_drops();
  
  return;
};

// begin dragging a form element
Drupal.start_drag = function (event, ui) {
  $(this).toggleClass('interface-element-dragging');
  return;
};
// stop dragging a form element
// all this controls is the styles associated with the element
Drupal.stop_drag = function (event, ui) {
  $(this).toggleClass('interface-element-dragging');
  if ($.browser.msie && $.browser.version < 7) {
    $(this).css('filter', '');
  }
  return;
};

