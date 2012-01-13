// $Id: interface-panel.js,v 1.1 2009/09/15 03:38:45 techsoldaten Exp $
/**
 * panel.js
 * 
 * Provides common functions for the interface details panel.
 * 
 */
/*global Drupal, $, document, jQuery, regions, x */
/* defining all of these variables for debugging purposes */
var item_name, this_item, i, fn_check, check, action_check, action_select, custom, element, full_path, holder, option, parent, position, registered, results, select, temp, valid, x, test;

/**
 * @defgroup interface_panel_core Core havaviors for the panel.
 */
/**
 * Cancels editing of an interface.
 */
Drupal.interface_cancel_interface = function(){
  // indicate that the information has been saved
  $('#interface_status_bar').text('Cancelling changes...');
  // TODO: check for unsuccessful saves.
  document.location = Drupal.settings.basePath + 'admin/build/interface';
  return false;
};
/**
 * Displays details about the form item in the status bar. Used to show the placement of form items.
 */
Drupal.interface_form_items_details = function(event){
  event.stopPropagation();
  Drupal.form_item_details(this);
  return false;
};

/**
 * @defgroup interface_panel_save Methods for saving interfaces.
 *
 * This group includes the functions that save the interface, collect information from custom behaviors,
 * and store information about the state of the interface to be passed back to Drupal.
 */
/**
 * Once an interface has been saved, this function responds by relocating the user back to the main interface screen.
 * 
 * @ingroup interface_panel_save
 */
function interface_save_success(a,f,o){
  // indicate that the information has been saved
  $('#interface_status_bar').text('Saving Interface... Interface saved!');
  // console.log(a);
  // TODO: check for unsuccessful saves.
  document.location = Drupal.settings.basePath + 'admin/build/interface';
  return false;
}

/**
 * Commits changes to the interface to Drupal. This function loops through all form elements to 
 * find their placement within the region heirarchy. It creates a serialized array of all elements
 * relative to others and stores it in the placement form element prior to submitting.
 * 
 * @ingroup interface_panel_save
 */
Drupal.interface_save = function(){
  
  // to start with, put some information into the status bar
  $('#interface_status_bar').text('Saving Interface... Collecting information about the interface');
    
  // placement is the main object used to store the placement of elements within the region structure
  // elements will be stored in placement in the following form:
  //   [ path.in.form.constructor ]|[ placement.within.regions ]
  var placement = [];
  
  // interface_form_elems contains a set of hidden fields, each of which contains the name of form 
  // elements contained in the node form. We are going to loop through them in order to find the names
  // of items in the node form, and return their placement relative to regions and other form elements.
  //
  // TODO: add relative placement, i.e. order within the parent placement
  $('.interface_form_elems').children().each(function(){
    
    // every form element is referenced in hidden fields in the form of 
    //  interface_[ element name ]. Remove the first 10 characters to get the name of an 
    // actual form element with a name that can be referenced within the form.
    var item_name = '#' + $(this).attr('name').substr(10);
    
    // console.log(item_name + ' - ' + $(item_name, '#node-form').length);
    
    // once we have the name of a form element, find it using the id attribute within the node form.
    var elems = $(item_name, Drupal.settings.interface_author_limit).parents().map(function(){
      
      var this_item = $(this);
      
      // Return the form tag. Since interface only modifies node forms (for the present), we can 
      // identify them using the id. Return the name of the tag itself, instead of the id.
      if(this_item.attr('id') == 'node-form'){
        // return this.tagName;
      }
      
      // Regions will always have an rid associated with them. This non-standard form element 
      // attribute will never pass a valid XML reference, but serves our needs nicely. This attribute
      // will tell us where to place form elements within the region heirarchy.
      if(this_item.attr('rid')){
        return this_item.attr('rid');
      }
      
      // Add groupers to the placement of elements.
      // loop around all installed modules to see if a grouper_register exists. if so, pass it information 
      // about the current element to see if there is a match. 
      var i, fn_check, check;
      for (i in Drupal.settings.interface_behaviors){
        
        fn_check = 'Drupal.' + Drupal.settings.interface_behaviors[i] + '_register_grouper_save';
        if(jQuery.isFunction(eval(fn_check))){
          check = eval(fn_check + "(this)");
          if(check){
            return check;
          }
        }
      }
      
      
      // otherwise, if we don't 'like' the item, we just ignore it
      return;
      
    }).get().reverse().join('.');
    
    if(elems.length > 0){
      // console.log(item_name + ' - ' + elems.length + ' - ' + elems + ' - ' + item_name);
      // add in the element id to the path
      var full_path = elems + '.' + item_name;
      $(this).attr('full_path', full_path);
    }
    
  });

  // get the placement of all form elements
  placement = $('.interface_form_elems').children().map(
    function(){
      if($(this).attr('full_path')){
        // positioning: find the placement of each form element relative to it's parent. this will be used
        // to assign a weight to each form element when rendering the form. each parent must be either a valid
        // region used in the template, or a valid selector registered within a behavior using 
        // hook_register_global_selector. 
        // get the name of the item as it will appear in the authoring form, and return a reference
        // to it for further processing
        var item_name = '#' + $(this).attr('name').substr(10);
        var element = $(item_name, Drupal.settings.interface_author_limit);
        
        // find a valid parent for the element. see note above about what is valid.
        // valid = Drupal.settings.regions.concat(Drupal.settings.interface_selectors);
        // first, check to see if the item is contained in a grouper. if it is not, it must be contained in a
        // form region
        var valid = Drupal.settings.interface_selectors;
        for (var i = 0; i < valid.length; i++){
          if(valid[i] == '.form-item'){
            valid.splice(i, 1);
          }
        }
        valid = valid.join(',');
        var check = element.parents(valid).not('.form-item,LABEL,.fieldset-wrapper');
        
        // if the element is not contained in a grouper, it's parent must be a region
        if(check.length === 0){
          var temp = [];
          for (var x in Drupal.settings.regions){
            temp[x] = '.' + Drupal.settings.regions[x];
          }
          valid = temp.join(',');
          check = element.parents(valid);
          // if(check.length > 0){
            // console.log(check.length);
          // }
        }
        
        // at this point, we should have a valid parent in the check variable.
        // get the index of the element. The following should work for any element directly contained 
        // within a grouper or region, without additional markup surrounding it
        
        // ignore hidden elements
        if(element.attr('type') != 'hidden'){
          // console.log(element[0]);
          var parent_node = element.parents(Drupal.settings.form_item_string)[0], holder;
          if(parent_node){
            holder = $(parent_node).parent();
          } else {
            parent_node = element[0];
            holder = $(parent_node).parent();
          }
          var position = holder.children().index(parent_node);

          // console.log(); // need to find the parent's position
          // console.log(parent);
          // console.log(position);
          // console.log('-----------------');
        }
        
        return $(this).attr('full_path') + '||' + $(this).attr('value') + '||' + position;
      }
      return;
    }
  ).get();

  // now, check all custom behaviors to see if there is a save function associated with it. 
  // change the status bar to indicate we are now checking behaviors
  $('#interface_status_bar').text('Saving Interface... Collecting information from custom behaviors');
  
  // create an array to store data from custom behaviors
  var custom = {};
  
  // loop through the behaviors to see what is there...
  // each behavior will need to create a value to pass back to Drupal
  for (var test in Drupal.settings.interface_behaviors){
    var fn_check = 'Drupal.' + Drupal.settings.interface_behaviors[test] + '_save';
    if(jQuery.isFunction(eval(fn_check))){
      var check = eval(fn_check + "(this)");
      if(check){
        eval('custom.' + Drupal.settings.interface_behaviors[test] + ' = check');
        break;
      }
    }
  }
  
  // change the status bar to indicate we are now saving form information
  $('#interface_status_bar').text('Saving Interface... Storing interface configuration');
  
  // store the form data to pass back to Drupal. include the plugin data as a JSON 
  // string to parse on the Drupal side.
  $('#edit-positioning', '#interface-main-controls').attr('value', placement);
  var results = Drupal.toJson(custom);
  $('#edit-interface-behaviors-custom', '#interface-main-controls').val(results);
  //console.log($('#edit-interface-behaviors-custom', '#interface-main-controls').val());

  return false;
};

/**
 * restores the default panel for submitting the form
 */
Drupal.interface_panel_restore_default = function(event){
  
  // toggle the forms
  $('#interface_region_form').hide();
  $('#interface_element_form').hide();
  $('#interface_settings_screen').hide();
  $('#interface_context_form').show();
  $('#interface_default_button').hide();
  
  // change the status
  $('#interface_selected').html('FORM');

  if (typeof event != 'undefined' && $(event.target).parents(Drupal.settings.interface_author_limit).length > 0) {
    return false;
  }
};

Drupal.interface_settings_return = function(){
  
  // console.log('returning from settings...');
  
  // change the name of the interface context within the form
  // where is the damn field?
  $('#edit-interface-context', '#interface-main-controls').val($('#edit-interface-naming', '#interface-settings-form').val());
  
  // change the display name of the context
  $('.context_value > EM').text($('#edit-interface-naming', '#interface-settings-form').val());
  
  
  
  // then restore the defaults
  Drupal.interface_panel_restore_default();  
  
  return false;
};

// reports details about the form element back to the interface panel
Drupal.form_item_details = function(item){
  
  // hide the default form
  $('#interface_context_form').hide();
  
  // update the path of the element being viewed
  Drupal.interface_panel_status_update($(item));
  
  // display the element form
  Drupal.interface_panel_display_element_form($(item));
  
  // associate any actions with the item
  Drupal.interface_get_associated_actions($(item));
  
  return;
};

/**
 * searches all installed behaviors to get registered actions for the selected form element
 */
Drupal.interface_get_associated_actions = function (element){

  var check = false;
  
  Drupal.settings.selected_item = element;
    
  // create an array for storing actions
  var actions = {};
  
  // loop through each behavior to see if there are registered actions. 
  // if there are, pass the selected form element into the registration hook
  // to see if it applies to the selected element
  for (var i in Drupal.settings.interface_behaviors){
    
    var item = 'Drupal.' + Drupal.settings.interface_behaviors[i] + '_register_actions';
    
    if(jQuery.isFunction(eval(item))){
      registered = eval(item + "(element)");
      if(registered){
        for(var j in registered) {
          check = true;
          actions[j] = registered[j];
        }
      }
    }
  }
  
  // create the select box
  var action_select = '<option value="na" selected>Choose an action...</option>';
    
  for(var iii in actions) {
    var action_check = true;
    var option = '<option value="' + iii +  '">' + actions[iii] + '</option>';
    action_select = action_select + option;
  }
  
  var select = '<select id="action_select">' + action_select + '</select>';
  
  if(check){
    // actions = action_select.wrap('<select id="action_select"></select>');
    $('.interface_element_actions').html(select);
    $('#action_select').change(Drupal.interface_trigger_action);
    $('#action_select').click(function (event) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    })
  } else {
    $('.interface_element_actions').html('This item has no actions associated with it.');
  }
  
  return check;
  
};


Drupal.interface_trigger_action = function(){
  if(this[this.selectedIndex].value != 'na'){
    eval('Drupal.' + this[this.selectedIndex].value + '()');
  }
  return false;
};

// controls the display of the element form for matched elements
Drupal.interface_panel_display_element_form = function(item){
  
  $('#interface_element_form').show();
  
  // get the label and the description from the form item and place them here
  
  if(item.children('LABEL').length > 0){
    $('#interface_element_label > span.el_data', '#interface_element_form').html(item.children('LABEL').text());
  } else {
    $('#interface_element_label > span.el_data', '#interface_element_form').html('No Label');
  }
  if(item.children('LABEL > .form-required').length > 0){
    $('#interface_element_required > span.el_data', '#interface_element_form').html('Yes');
  } else {
    $('#interface_element_required > span.el_data', '#interface_element_form').html('No');
  }
  if(item.children('.description').length > 0){
    $('#interface_element_description > span.el_data', '#interface_element_form').html(item.children('.description').text());
  } else {
    $('#interface_element_description > span.el_data', '#interface_element_form').html('None Provided');
  }
  
  return;
};

// update the status bar in the interface panel
Drupal.interface_panel_status_update = function(item){
  
  // get parents of the current items and assign them to a map
  var elems = $(item).parents().map(function(){
    
    var this_item = $(this);
    
    // this gets the form and ends the processing
    if(this_item.attr('id') == 'node-form'){
      return this.tagName;
    }
    // Returns a region.
    if(this_item.attr('rid')){
      return this_item.attr('rid');
    }
    
    // Grouper logic to detect unique identifiers for non-standard form elements and markup
    // defined by behaviors. This is intended to allow the detection of items within
    // other pieces of markup, for instance, a form item in a field set. 
    // 
    // Groupers are registered within behaviors using a simple hook, defined as such:
    //    [ behavior name ]_register_grouper
    // ... where the markup for the item is passed in for evaluation. Each hook will evaluate
    // the markup on it's own to determine what to pass back to the element. Each hook can register
    // multiple checks for items, and should return false when no match is found.
    // 
    // Example of a grouper: tab sets, where form elements can be placed into one or more tabs. 
    // A tab set could return a check for the container for the tabs, the tab element itself, as 
    // well as any other markup necessary for the proper operation of the component.
    //
    // Logic for this feature is to run through a set of potential function names to see if they exist, 
    // defined by the set of behaviors associated with the template for the form. Again, return false
    // from the hook whenever the item is being ignored.
    //
    for (var i in Drupal.settings.interface_behaviors){
      var fn_check = 'Drupal.' + Drupal.settings.interface_behaviors[i] + '_register_grouper';
      if(jQuery.isFunction(eval(fn_check))){
        var check = eval(fn_check + "(this)");
        if(check){
          return check;
        }
      }
    }
    
    // If we don't 'like' the item, we ignore it.
    
    return;
    
  }).get().reverse().join(' > ');
  
  if(item.attr('id')){
    elems = elems + ' > ' + item.attr('id');
  } else {
    elems = elems + ' > ' + item.get(0).tagName;
  }

  // update the status for the item
  $('#interface_selected').html(elems);
  $('#interface_default_button').css('display', 'inline');

  return;
};


// activate the highlighting on each region for placing elements in the interface
Drupal.display_regions = function(){
  var regions = Drupal.settings.regions;
  for (var x in regions){
    $('.' + regions[x]).toggleClass('interface-region-active');
  }
  return;
};

// activate the highlighting on each form element
Drupal.display_form_elements = function(){
  var form_item_string = Drupal.settings.interface_selectors.join(',');
  var form_items = $(form_item_string, Drupal.settings.interface_author_limit);
  form_items.toggleClass('interface-element-active');
  return;
};

Drupal.behaviors.panel = function (context) {

  // make the panel resizable
	$("#interface_controls").appendTo('body').resizable({
    handles: 'n',
    maxHeight: 500,
    stop : function () {
      $('body').css('padding-bottom', $("#interface_controls").height() + 'px');
      if (jQuery.browser.msie && jQuery.browser.version < 7)
        this.style.setExpression('top', "eval(document.compatMode && document.compatMode=='CSS1Compat') ? documentElement.scrollTop +(documentElement.clientHeight-this.clientHeight) - 1 : document.body.scrollTop +(document.body.clientHeight-this.clientHeight) - 1");
    }
  });
  $('body').css('padding-bottom', $("#interface_controls").height() + 'px');
  
  // initialize some controls on the panel for viewing regions and form elements
  $('#edit-region-handler', '#interface-main-controls').click(Drupal.display_regions);
  $('#edit-form-element-handler').click(Drupal.display_form_elements);
  
  // form elements used in the theme
  var form_item_string = Drupal.settings.interface_selectors.join(',');
  var form_items = $(form_item_string, Drupal.settings.interface_author_limit);
  
  // going to try setting a width to auto for all draggable items
  $(form_items).css('width', 'auto');
  
  // click events for form elements
  form_items.click(Drupal.interface_form_items_details);

  // when clicking away from an item, go back to the default form
  // for editing interface
  $('BODY').click(Drupal.interface_panel_restore_default);

  // the submit handler...
  $('.interface_admin_left_panel > #edit-save-interface').click(Drupal.interface_save);
  
  // the cancel handler...
  $('.interface_admin_left_panel > #edit-cancel').click(Drupal.interface_cancel_interface);
  
  // the context handler...
  $('.interface_admin_left_panel > #edit-context').click(Drupal.interface_edit_context);
  
  // the settings handler...
  $('#edit-done', '#interface-settings-form').click(Drupal.interface_settings_return);

  // make sure the settings screen does not reset the editing panel
  $('#interface_settings_screen').click(function () { 
    return false; 
  });
  
  // ajaxForm settings for the save form
  var interface_main_options = { 
      url:       	    Drupal.settings.basePath + '?q=interface/save', 
      success:        interface_save_success,  // post-submit callback 
      resetForm:      false // reset the form after successful submit 
  };

  // associate AJAXform with the main control submission form
  $('#interface-main-controls').submit(function () {
    $(this).ajaxSubmit(interface_main_options); 
    return false;
  });
    
  $('.form-submit:not(#edit-context)', '#interface-main-controls').click(function() {       
     $('#interface-main-controls').submit(); 
    return false;
  });
       
};

/**
 * This function makes the context editing panel appear.
 */
Drupal.interface_edit_context = function (){
  
  // toggle the forms
  $('#interface_region_form').hide();
  $('#interface_element_form').hide();
  $('#interface_context_form').hide();
  $('#interface_settings_screen').show();
  
  // change the status
  $('#interface_selected').html('FORM Settings');
  
  return false;
};