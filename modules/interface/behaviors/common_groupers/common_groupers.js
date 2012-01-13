// $Id: common_groupers.js,v 1.1 2009/09/15 03:38:45 techsoldaten Exp $
/**
 * common-groupers.js
 * 
 * Adds selection and placement support for common groupers, like FIELDSETS.
 * 
 */
/*global Drupal, $, document, jQuery, regions, x */
/**
 * Registers a selector for use in the authoring interface. This hook provides a common
 * method for adding new selectors to the drag and drop interface.
 *
 * returns an array, containing the CSS selector for each item to be added to the drag and drop.
 */
Drupal.common_groupers_register_global_selector = function(){
  // create an array of selector values
  var selectors = ["FIELDSET", ".filefield-ahah-wrapper"];
  // return these items
  return ( selectors );
};
/**
 * Registers an exclusion for use in the authoring interface. This hook provides a common
 * method for removing specific form elements from the drag and drop behavior. Some form elements, 
 * such as file upload fields, only operate properly based on their placement within other markup.
 * This hook it meant to ensure some elements always stay togehter.
 *
 * returns an array, containing the CSS selector for each item to be excluded from the drag and drop.
 */
Drupal.common_groupers_register_global_exclusion = function(){
  // create an array of selector values
  var exclusions = [".filefield-ahah-wrapper .form-item", ".filefield-ahah-wrapper .form-button-holder"];
  // return these items
  return ( exclusions );
};

/**
 * Registers a grouper. hook_register_grouper tells interface that a form element appears within a grouper
 * (or is a grouper itself) and that form elements placed within it are visible. It should return some 
 * text for display within the status bar on the panel of the authoring interface.
 *
 * This accomplishes two main tasks:
 *
 *  1) Registered groupers appear on the status bar in the node element heirarchy when
 *      a form item is selected. This helps users to understand the form element's placement
 *      within the form itself.
 *
 *  2) Registered groupers are saved in the placement path when storing an interface in the 
 *      database. This allows form elements to be placed in groupers.
 *
 * For this behavior, we are dealing with FIELDSETs. We need to perform a check to see if a given
 * form element is appearing in the fieldset. If the element is appearing in the fieldset, we are
 * going to return the id of the fieldset. This will be used in positioning the form element
 * when the interface is presented to users.
 *
 * The first argument for this function will always be passed in as an HTML element. This item
 * can be accessed through jquery using standard features.
 *
 */
Drupal.common_groupers_register_grouper = function(markup){
  if(markup.tagName == 'FIELDSET'){
    var element = $(markup);
    return 'FIELDSET.' + element.attr('id');
  }
  return false;
};

/**
 * Registers the callback for a grouper when being saved. This function operates independently of 
 * hook_register_grouper because it reports back a POSITION of a form element, not STATUS TEXT
 * for the panel display. It is used in storing the postition of an element relative to the original
 * form constructor, which will later be used in presenting the form to users. It should return
 * the unique identifier for the form element within the original form constructor array (not the 
 * entire identifier, i.e. 'author' not 'form.author').
 *
 * hook_register_grouper_save accomplishes 2 things:
 *
 *  1) Indicates the placement of a grouper within the form heirarchy. Registering the placement
 *      of a grouper allows it to be located within the display of an interface the same way as
 *      other form elements.
 *
 *  2) Registers the placement of other form elements within the grouper. This allows form elements
 *      to be placed within groupers, for interface to report this relationship back to Drupal, and 
 *      for form elements to be properly placed within the heirarchy.
 *
 * For this behavior, we are dealing with FIELDSETs. We need to report back the unique identifier for the 
 * fieldset to Drupal for all this to work. Interface automatically adds a unique id to each fieldset to provide 
 * a method for identifying them within the original form constructor.
 *
 * The first argument for this function will always be passed in as an HTML element.
 *
 */
Drupal.common_groupers_register_grouper_save = function(markup){
  if(markup.tagName == 'FIELDSET'){
    var element = $(markup);
    return element.attr('id');
  }
  return false;
};

