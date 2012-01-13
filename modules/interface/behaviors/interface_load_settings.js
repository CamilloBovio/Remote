// $Id: interface_load_settings.js,v 1.1 2009/09/15 03:38:45 techsoldaten Exp $
/**
 * interface_load_settings.js
 * 
 * Triggers a number of initialization scripts contained within behaviors. Ensures various selectors are 
 * in place at the beginning of an authoring session.
 * 
 */
/*global Drupal, $, document, jQuery, regions, x */
Drupal.behaviors.interface_load_settings = function(context) {
  // Load drag and drop selectors from behaviors. Every selector will be placed
  // 
// no need to load them, all function in Drupal.behaviors are fired automatically
//  Drupal.behaviors.interface_register_selectors();
  
  // load selector exclusions. this will be used to exclude items from the drag and drop behavior.
//  Drupal.behaviors.interface_register_selection_exclusions();
  
  // Load drop targets from behaviors. Drop targets can include any grouper.
  // Drupal.behaviors.interface_register_selectors();
  
};

/**
 *  Loop around each loaded behavior to see if there is an init function for selectors.
 *
 *  All behaviors wishing to automatically register selectors should implement the hook 
 *    Drupal.[ behavior name ]_register_global_selector
 *  ... where behavior name is replaced with the name of the behavior. This hook should 
 *  return a list of valid css selectors for use in determining the form elements that are
 *  available for placement within an interface.
 *
 */
Drupal.behaviors.interface_register_selectors = function(){
  for (var urk in Drupal.settings.interface_behaviors){
    var item = 'Drupal.' + Drupal.settings.interface_behaviors[urk] + '_register_global_selector';
    if(jQuery.isFunction(eval(item))){
      var selectors = eval(item + "()");
      for (var sel_idx in selectors){
        Drupal.settings.interface_selectors[Drupal.settings.interface_selectors.length] = selectors[sel_idx];
      }
    }
  }
  return;
};

/**
 *  Loop around each loaded behavior to see if there is an init function for selector
 *  exclusions. A selector exclusion is an item that will be removed from a selector
 *  using a not statement. These SEs can include complex selectors that include child 
 *  elements such as .form-item > .form_item. Each SE will be implemented individually.
 *  
 *  All behaviors wishing to automatically register SEs should implement the hook 
 *    Drupal.[ behavior name ]_register_global_exclusion
 *  ... where behavior name is replaced with the name of the behavior. This hook should 
 *  return a list of valid css selectors for use in determining the form elements that are
 *  excluded from placement within an interface.
 */
Drupal.behaviors.interface_register_selection_exclusions = function(){
  for (var bhvidx in Drupal.settings.interface_behaviors){
    var item = 'Drupal.' + Drupal.settings.interface_behaviors[bhvidx] + '_register_global_exclusion';
    if(jQuery.isFunction(eval(item))){
      var exclusions = eval(item + "()");
      for (var row in exclusions){
        Drupal.settings.interface_exclusions[Drupal.settings.interface_exclusions.length] = exclusions[row];
      }
    }
  }
  return;
};
