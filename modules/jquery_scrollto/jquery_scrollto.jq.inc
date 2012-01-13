<?php

/**
 * Implementation of hook_jq().
 * http://drupal.org/project/jq
 */
function jquery_scrollto_jq($op, $plugin = NULL) {
  if ($op == 'info') {
    $path = drupal_get_path('module', 'jquery_scrollto');
    return array(
      'scrollTo' => array(
        'name' => t('ScrollTo'),
        'description' => t('The jquery scrollTo plugin'),
        'version' => '1.0',
        'url' => 'http://plugins.jquery.com/project/ScrollTo',
        'files' => array(
          'js' => array(
            $path .'/jquery/jquery.scrollTo-min.js',                    
          ),
          'css' => NULL,
        ),
        'invocation' => NULL,
      ),
    );
  }
}
