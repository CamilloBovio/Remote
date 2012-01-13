// $Id: tabbable.js,v 1.1 2009/09/15 03:38:45 techsoldaten Exp $
/**
 * tabbable.js
 * 
 * Implements tabs within interfaces. There are some common terms to understand:
 * 
 * - tabbable_region - the entire tab controller, the tabs, the content associated with tabs, etc.
 * - tabbable_tabset - the set of tabs within the tab region, the actual items someone clicks on independent
 *   of the content.
 * - tab - a tab someone can click on. exists independently of the content contained within.
 * - tabbable_content - a region for holding content associated with tabs in the tab set
 * - tabbable_item - a self-contained piece of content associated with a tab. becomes visible when someone 
 *   clicks on the associated tab.
 * 
 */
/*global Drupal, $, document, jQuery, regions, x, window */
/**
 * @defgroup tabbable_core Initialization functions and core hooks used in tabbable.
 */
/**
 * Initializes tabbable.
 *
 * @ingroup tabbable_core
 */
Drupal.behaviors.tabbable = function(context) {
  // to start, there should be a function to associate tab behavior with existing tabs
  Drupal.tabbable_actions_init_tabs();
  Drupal.tabbable_init_tab_drag_drop();
  Drupal.tabbable_tab_details();
  return false;
};
/**
 * hook_register_global_selector
 *
 * @ingroup tabbable_core
 */
Drupal.tabbable_register_global_selector = function(){
  // create an array of selector values
  var selectors = [".tabbable", ".tabbable_tab"];
  // return these items
  return ( selectors );
};

/**
 * hook_register_global_exclusion
 *
 * @ingroup tabbable_core
 */
Drupal.tabbable_register_global_exclusion = function(){
  // create an array of selector values
  var exclusions = [ ".tabbable_tabset" ];
  // return these items
  return ( exclusions );
};
/**
 * hook_register_actions
 *
 * @ingroup tabbable_core
 */
Drupal.tabbable_register_actions = function(element) {
  
  // by default, set the return value to false.
  var actions = false;
  
  // so, we are going to check if the form element can be made into a tab.
  // to start, only pass back actions for form items, just to distinguish from other stuff
  // adding fieldset support
  if(element.hasClass('form-item') || element[0].tagName == 'FIELDSET'){
    actions = [];
    if(element.parents('.tabbable').length === 0){
      actions.tabbable_make_tabset = 'Create New Tabset';
    }
  }
  
  // tab sets - need to be able to remove a tab set from the interface.
  if(element.hasClass('tabbable_link')){
    actions = [];
    actions.tabbable_remove_tabset = 'Remove Tab';
  }
  
  return actions;
};
/**
 * hook_register_grouper
 *
 * @ingroup tabbable_core
 */
Drupal.tabbable_register_grouper = function(markup){
  if($(markup).hasClass('tabbable')){
    return 'Tab Region';
  }
  if($(markup).hasClass('tabbable_tabset')){
    return 'Tab Set';
  }
  if($(markup).hasClass('tabbable_tab') || $(markup).hasClass('tabbable_item')){
    return 'Tab';
  }
  return false;
};
/**
 * Dragging behaviors for tab sets.
 *
 * @ingroup tabbable_core
 */
Drupal.tabbable_init_tab_drag_drop = function(){

  // get all tab sets in the interface and make them draggable
  var tabbable = $('.tabbable');
  
  // make tab sets draggable
  tabbable.draggable({
    cursor: 'pointer',
    revert: 'invalid',
    snap: 'true',
    start: Drupal.tabbable_start_drag,
    stop: Drupal.tabbable_stop_drag,
  	hoverClass: 'interface-region-hover'
  });
    
  // tabsets is the drop target. users will need to drop an item into the tab set itself 
  // in order for it to register as a new tab
  var tabsets = $('.tabbable_tabset');
  
  tabsets.droppable({
  	accept: Drupal.settings.form_item_string,
  	activeClass: 'interface-region-droppable',
  	hoverClass: 'tabbable_tabset_highlight',
  	tolerance: 'pointer',
  	drop: Drupal.tabbable_create_tab
  });
  
  return false;
};
/**
 *
 */
Drupal.tabbable_start_drag = function(){
  
  // make tabsets non-droppable while dragging a tab region. prevents problems with dropping tabsets into themselves.
  $(this).toggleClass('interface-element-dragging');
  var tabsets = $('.tabbable_tabset');
  tabsets.droppable('disable');
  
  return false;
};
/**
 *
 */
Drupal.tabbable_stop_drag = function (event, ui) {
  $(this).toggleClass('interface-element-dragging');
  var tabsets = $('.tabbable_tabset');
  tabsets.droppable('enable');
  return;
};

/**
 * hook_register_grouper_save
 *
 * @ingroup tabbable_core
 */
Drupal.tabbable_register_grouper_save = function(markup){
  
  // this function needs to return placement information used in putting items 
  // within tabsets when the form is constructed.
  if($(markup).hasClass('tabbable_item')){
    var element = $(markup);
    // need to go 2 parents up
    if (markup.offsetParent && markup.offsetParent.id != '') {
      return markup.offsetParent.id + '.tab_content.' + element.attr('name');
    }
    else{
      return element[0].parentNode.offsetParent.id + '.tab_content.' + element.attr('name');
    }
  }
  return false;  
};

/**
 * hook_save
 *
 * @ingroup tabbable_core
 */
Drupal.tabbable_save = function(item){
  
  var data = {};
  
  // get a list of all tabbable regions
  var regions = $('.tabbable', Drupal.settings.interface_author_limit).map(function(){
    var region_data = {};
    
    // get an id for the item. this will be used to generate tab regions on the drupal side.
    // this id will also serve as the key for the object
    var this_region = $(this);
    region_data.id = this_region.attr('id');
    
    // we need to know the parent
    region_data.parent_region = $(this.parentNode).attr('rid');
    // console.log(region_data['parent_region']);

    // get the tab items in the tabset and return the name attribute of the enclosed link.
    var items = this_region.children('.tabbable_tabset').children().map(function(){
      var this_item = $(this);
      var item_data = {};
      item_data.name = this_item.children('A').attr('name');
      item_data.text = this_item.children('A').text();
      return item_data;
    }).get();
    region_data.element = items;
    
    // return all the data about the region
    return region_data;
  }).get();
  
  // this should be all the information we need. it is possible we will need to assign a name 
  // to each tabset as well.
  
  data.regions = regions;
  // define our type
  data.behaviour_type = 'tabbable';
  
  // console.log(data);  
  
  return data;
};

/**
 * @defgroup tabbable_create Methods for creating and modifying tab regions
 *
 * These functions create tab regions, allow users to add tabs to tab sets, and control the content 
 * within tab content areas.
 */
/**
 * Creates a tabbable tab set for the first time. Wraps the selected element in a tabbable region, adds a tab
 * set to the element, and creates a tab in the tab set with the element's name.
 *
 * @ingroup tabbable_create
 */
Drupal.tabbable_make_tabset = function(){
  
  // get a name for the tab. use the label as a guide.
  var text = Drupal.tabbable_get_text(Drupal.settings.selected_item);
  var tab_name = 'tab_0'; // name attribute for the tab and the tab content

  // place the item in a content holder
  var tab_region_name = Drupal.tabbable_get_region_name();
  var content = Drupal.settings.selected_item.wrap('<div id="' + tab_region_name + '" class="tabbable"></div>');
  
  // insert the content
  content = content.wrap('<div class="tabbable_content"></div>');
  content = content.wrap('<div class="tabbable_item active" name="' + tab_name + '"></div>');

  // insert the tab set
  text = "<a href='#' name='" + tab_name + "' class='tabbable_link'>" + text + "</a>";
  var tab = "<div class='tabbable_tab active'>" + text + '</tab>';
  var tabset = "<div class='tabbable_tabset'>" + tab + "</div>";
  content.parents('.tabbable').prepend(tabset);
  
  // initialize all tabbable regions in the node form
  Drupal.tabbable_init_tab_drag_drop();
  
  // this just resets the form item to ensure we have the right options
  Drupal.settings.selected_item.click();
  
  // associate the tabbing action with tabs
  Drupal.tabbable_actions_init_tabs();
  
  // associate detail behavior with tabs. allows tabs to be displayed in the status bar on the panel.
  Drupal.tabbable_tab_details();
  
  return false;
  
};
/**
 * Creates a new tab. Drop action for tabsets.
 *
 * @ingroup tabbable_create
 */
Drupal.tabbable_create_tab = function(event, ui){
  
  // get a name for the tab. use the label as a guide.
  var text = Drupal.tabbable_get_text(ui.draggable);
  var tab_name = 'tab_' + $(this).children().length;
  
  // insert the tab set
  text = "<a href='#' name='" + tab_name + "' class='tabbable_link'>" + text + "</a>";
  var tab = "<div class='tabbable_tab active'>" + text + '</tab>';
  var new_tab = $(this).append(tab);
  
  // create a new tab content item. place the dragged item here.
  $(this).parents('.tabbable').children('.tabbable_content').append(ui.draggable);
  ui.draggable.wrap('<div class="tabbable_item active" name="' + tab_name + '"></div>');
  
  // associate click behaviors with the tabs
  Drupal.tabbable_actions_init_tabs();
  
  // associate detail behavior with tabs. allows tabs to be displayed in the status bar on the panel.
  Drupal.tabbable_tab_details();
  
  // click on the new tab, to activate it
  var tab_count = $(this).children().length;
  $(this).children().eq((tab_count - 1)).children().click();
  
  return false;
};

/**
 * Allows a user to rename a tab in the interface.
 *
 * @ingroup tabbable_create
 */
Drupal.interface_rename_tab = function(){
  
  // need to replace the text of the tab with a field for editing it.

  // temporarily disable the text changing behavior while we edit it
  $(this).unbind('dblclick',Drupal.interface_rename_tab);
  
  var default_text = $(this).text();
  var tab_name = $(this).attr('name');
  var edit = '<form id="tabbable_changeit">';
  edit += '<input id="tabbable_edit" type="text" />';
  edit += '<input id="tabbable_name" type="hidden" value="' + tab_name + '" />';
  edit += '</form>';
  
  $(this).replaceWith(edit);
  $('#tabbable_edit').attr('value', default_text);
  $('#tabbable_edit').focus();
  
  $(this).unbind('dblclick',Drupal.interface_rename_tab);
  $('#tabbable_edit').bind('mouseout',Drupal.interface_new_tab_name);
  
  // make the return key register a save for tab name changes
  $(window).keydown(Drupal.tabbable_catch_return);
  
  return false;
  
};

Drupal.tabbable_catch_return = function(event){
  // catches returns and makes them execute a tab save
  switch (event.keyCode) {
    case 13:
      Drupal.interface_new_tab_name();
    break;
    default:
      return event.keyCode;
  }
  return false;
};

Drupal.interface_new_tab_name = function(){
  
  var value = $('#tabbable_edit').attr('value');
  var tab_name = $('#tabbable_name').attr('value');
  var link = "<a href='#' name='" + tab_name + "' class='tabbable_link'>" + value + "</a>";
  
  $('#tabbable_changeit').replaceWith(link);
  $(this).unbind('mouseout',Drupal.interface_new_tab_name);
  $(window).unbind('keydown',Drupal.tabbable_catch_return);
  
  // associate the tabbing action with tabs
  Drupal.tabbable_actions_init_tabs();
  
  // reset all the tabs
  Drupal.tabbable_tab_details();
  
  return false;
};

/**
 * @defgroup tabbable_remove Functions for removing tab regions from the interface.
 */
/** 
 * Removes a tab set from the page. Preserves all form elements contained within the tab set by looping through 
 * them and placing them within the markup of the page. This should only fire on a tab item within a tab set.
 *
 * @ingroup tabbable_remove
 */
Drupal.tabbable_remove_tabset = function(){
  
  // find the tab set the form element resides in. each form element will have one unique tab parent
  // console.log($(Drupal.settings.selected_item).attr('name'));
  var this_tab = $(Drupal.settings.selected_item);
  
  // okay, to start with, get the content out of the content region for the item and place it below the tab set
  var tab_region = this_tab.parents('.tabbable');
  
  // where is content_name coming from?
  var content_name = Drupal.settings.selected_item.attr('name');
  
  var content = this_tab.parents('.tabbable').children('.tabbable_content').find('.tabbable_item[name=' + content_name + ']');
  tab_region.after(content.children());
  content.remove();
  // content.remove();
  
  // console.log(tab_region.children('.tabbable_tabset').length + ' tabs');
  
  // get the next tab, so we can click it once this one is removed
  var next_tab = this_tab.parent().next().children('.tabbable_link');
  if(next_tab.length === 0){
    next_tab = this_tab.parent().prev().children('.tabbable_link');
  }

  // remove the element, and kill the tab set if there are no tabs left  
  if(tab_region.children('.tabbable_tabset').children().length == 1){
    // remove the tab region
    tab_region.remove();
  } else {
    // remove the tab item
    this_tab.parent().remove();
  }
  
  next_tab.click();
  
  // this sometimes casues form elements to lose events associated with them
  // need to reinitialize all form elements to compensate
  
  return false;
};
/**
 * @defgroup tabbable_util Utilities for integrating tabbable with the interface panel.
 *
 * Group for handling various tasks making tabbable work with the interface panel.
 */
/**
 * displays details of tabs in the panel status bar.
 *
 * @ingroup tabbable_util
 */
Drupal.tabbable_tab_details = function(){
  
  // allows users to switch tabs
  $(".tabbable_link").unbind('click',Drupal.interface_form_items_details);
  $(".tabbable_link").click(Drupal.interface_form_items_details);
  
  // allows users to rename tabs
  $(".tabbable_link").unbind('dblclick',Drupal.interface_rename_tab);
  $(".tabbable_link").dblclick(Drupal.interface_rename_tab);
  
  return false;
};
/**
 * Gets the name of the tab. Uses LABEL and LEGEND to create the name. Gives preference to LEGEND.
 *
 * @ingroup tabbable_util
 */
Drupal.tabbable_get_text = function(el){
  var text = '';
  if(el.find('LEGEND').length > 0){
    text = el.find('LEGEND');
    text = text.text();
  } else if (el.find('LABEL').length > 0) {
    text = el.find('LABEL');
    text = text.text();
  } else {
  }
  text = text.replace(':', '');
  text = text.replace('*', '');
  return text;
};
/**
 * Creates a unique id for a tab region. Checks the dom to see what other tab_regions exist, then
 * loops around an iterator to create a unique name.
 *
 * @ingroup tabbable_util
 */
Drupal.tabbable_get_region_name = function(){
  var region_name = '';
  var counter = 0;
  while (region_name == ''){
    var check = 'tab_region_' + counter;
    if($('#' + check).length === 0){
      region_name = check;
    }
    counter++;
  }
  // console.log(region_name);
  return region_name;
};

