<?php
// $Id: interface.admin.inc,v 1.1 2009/09/15 03:34:56 techsoldaten Exp $

/**
 * @file
 * A number of administrative tools for managing interfaces.
 */

/**
 * Displays a list of all installed themes.
 */
function interface_themes() {
  // Cycle through the templates directory and find all installed templates.
  $output .= t('<p>The following themes are currently installed and available for defining new interfaces. Interface themes allow you to control the regions for placing form elements, and come with pre-installed behaviors.</p>');
  $themes = _interface_theme_data(); // Scan the installation theme .info files and their engines.

  $header = array(t('Name'), t('Description'), t('Installed behaviors'));
  foreach ($themes as $row => $item) {
    $beh = implode(', ', array_keys($item->info['behaviors']));
    $rows[] = array(
      $item->info['name'],
      $item->info['description'],
      $beh,
    );
  }

  $output .= theme('table', $header, $rows);
  return $output;
}

/**
 * Allows users to create, edit and delete interfaces.
 */
function interface_select() {
  // @todo create list for content types currently contained within the system.

  // get a list of all interfaces currently installed in the system.
  $templates = db_query("SELECT DISTINCT template, content_type, interface_context FROM {interface_template} ORDER BY content_type ASC");

  $header = array(t('Content type'), t('Interface'), t('Context'), t('Operations'));
  // create a list of installed templates to show the user what is installed currently
  while ($item = db_fetch_object($templates)) {
    $rows[] = array(
      $item->content_type,
      $item->template,
      $item->interface_context,
      l(t('Edit'), 'admin/build/interface/edit/' . $item->content_type . '/' . $item->template . '/' . $item->interface_context) . ' | ' .
        l(t('Delete'), 'admin/build/interface/delete/' . $item->content_type . '/' . $item->template . '/' . $item->interface_context),
    );
  }

  if (count($rows) > 0) {
    $output = theme('table', $header, $rows);
  }
  else {
    // @todo display text for no results here.
  }

  // display the form for creating new interfaces.
  drupal_add_js(drupal_get_path('module', 'interface') .'/behaviors/interface_utils.js', 'module');
  $output .= drupal_get_form('interface_admin_add_interface');
  return $output;
}

/**
 * Creates the form for creating new interfaces.
 */
function interface_admin_add_interface(&$form_state, $edit = array()) {
  // Present a list of all content types.
  // Display the default interface associated with each.
  $node_types = menu_get_item('node/add');
  $node_content = system_admin_menu_block($node_types);

  foreach ($node_content as $row => $item) {
    // get the name of the content type, compare it to the list of ones that already exist.
    // if there is a match, skip it, otherwise place an array element for the form.
    $check = unserialize($item['access_arguments']);
    $this_type = $check[1];
    $copts[$this_type] = $item['title'];
  }

  // get a list of all installed themes
  $get_themes = _interface_theme_data();
  foreach ($get_themes as $row => $item) {
    $themes[$row] = $item->info['name'];
  }

  // Present the form for a new interface if there are content types without one.
  // @todo Change this to support more than one interface per content type.
  if (count($copts) > 0) {
    $form['new_int'] = array(
      '#title'        => t('Create new interface'),
      '#type'         => 'fieldset',
    );
    $form['new_int']['type'] = array(
      '#description'  => t('Select a content type to author a new interface.'),
      '#options'      => $copts,
      '#title'        => t('Content type'),
      '#type'         => 'select',
    );
    $form['new_int']['theme'] = array(
      '#description'  => t('Select a theme to apply to the interface.'),
      '#options'      => $themes,
      '#title'        => t('Theme'),
      '#type'         => 'select',
    );
    $form['new_int']['interface_context'] = array(
      '#default_value' => 'Default',
      '#description'  => t('Provide a name for the context of the interface. Context names may only contain letters, numbers and underscores. Use \'Default\' to provide a context for the node add form.'),
      '#title'        => t('Interface context'),
      '#type'         => 'textfield',
    );
    $form['new_int']['submit'] = array(
      '#type'         => 'submit',
      '#value'        => 'Create new interface',
    );
  }
  else {
    $form['new_int'] = array(
      '#type'         => 'fieldset',
      '#title'        => t('Create new interface'),
    );
    $form['new_int']['message'] = array(
      '#type'         => 'markup',
      '#value'        => t('Interfaces have been created for all content types.'),
    );
  }

  return $form;
}

/**
 * #submit handler for the add interface form.
 */
function interface_admin_add_interface_submit($form, &$form_state) {
  $form_state['redirect'] = 'admin/build/interface/edit/'. $form_state['values']['type'] .'/'. $form_state['values']['theme'] .'/'. $form_state['values']['interface_context'];
}

/**
 * @todo This function needs to be documented.
 */
function _interface_theme_data() {
  static $themes_info = array();

  if (empty($themes_info)) {
    $files = array();
    $dir = drupal_get_path('module', 'interface') .'/templates';
    $themes = array_merge($files, file_scan_directory($dir, '\.info$', array('.', '..', 'CVS'), 0, TRUE, 'name', 1));

    foreach ($themes as $key => $theme) {
      $themes[$key]->info = drupal_parse_info_file($theme->filename);
    }

    $themes_info = $themes;
  }

  return $themes_info;
}

/**
 * Menu callback: confirm deletion of an interface.
 */
function interface_delete_confirm(&$form_state, $content_type, $theme = '', $interface_context = '') {
  $form['type'] = array(
    '#type'   => 'value',
    '#value'  => $content_type,
  );
  $form['interface_context'] = array(
    '#type'   => 'value',
    '#value'  => $interface_context,
  );
  $form['template'] = array(
    '#type'   => 'value',
    '#value'  => $theme,
  );
  return confirm_form($form,
    t('Are you sure you want to delete the interface %context for %title?', array('%title' => $content_type, '%context' => $interface_context)),
    isset($_GET['destination']) ? $_GET['destination'] : 'node/'. $node->nid,
    t('This action cannot be undone.'),
    t('Delete'),
    t('Cancel')
  );
}

/**
 * #submit handler for interface_delete_confirm().
 */
function interface_delete_confirm_submit($form, &$form_state) {
  if ($form_state['values']['confirm']) {
    interface_delete($form_state['values']['type'], $form_state['values']['template'], $form_state['values']['interface_context']);
  }

  $form_state['redirect'] = 'admin/build/interface';
}

/**
 * Delete an interface.
 */
function interface_delete($type, $template, $interface_context) {
  db_query("DELETE FROM {interface_template} WHERE content_type = '%s' AND interface_context = '%s' AND template = '%s'", $type, $interface_context, $template);

  // launch the delete hook for all installed behaviors.
  $template_data = interface_get_template($template);

  foreach ($template_data['info']['behaviors'] as $key => $row) {
    $behavior_name = $key . '_interface_delete_behavior';
    if (function_exists($behavior_name)) {
      $behavior_name($type, $template, $interface_context);
    }
  }

  watchdog('interface', 'Interface for content type @type has been deleted.', array('@type' => $type, '@context' => $interface_context));
  drupal_set_message(t('Interface @context for content type @type has been deleted.', array('@type' => $type, '@context' => $interface_context)));
}
