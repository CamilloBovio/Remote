// $Id: tabbable_actions.js,v 1.1 2009/09/15 03:38:45 techsoldaten Exp $
/**
 * tabbable_actions.js
 * 
 * Enables tabbing in an interface.
 * 
 */
/*global Drupal, $, document, jQuery, regions, x */
Drupal.behaviors.tabbable_actions = function(context) {
  // initialize dragging behavior
  Drupal.tabbable_actions_init_tabs();
};
/**
 * Allows tabbing behavior
 */
Drupal.tabbable_actions_init_tabs = function(){

  // remove previous click events
  // this is here so that, when we author a form, there is not a double click on the tab
  $(".tabbable_link").unbind('click',Drupal.tabbable_actions_tab_click);
  
  // associate click behavior with each tab item. clicking a tab item
  // should add the class active to that tab item, and remove it from all others
  $(".tabbable_link").click(Drupal.tabbable_actions_tab_click);

  return false;
};

Drupal.tabbable_actions_tab_click = function(){
  
  // this should remove the active class from all tabs, then add the active class to the selected tab
  var tabset = $(this).parents('.tabbable_tabset');
  var tabs = tabset.find('.tabbable_tab');
  tabs.removeClass('active');
  $(this).parent().addClass('active');
  
  // get the name attribute for the parent element. this will be used to find the tab content to display.
  var content_name = $(this).attr('name');
  
  $(this).parents('.tabbable').find('.tabbable_item').removeClass('active');
  $(this).parents('.tabbable').find('.tabbable_item[name=' + content_name + ']').addClass('active');
  
  return false;
  
};
