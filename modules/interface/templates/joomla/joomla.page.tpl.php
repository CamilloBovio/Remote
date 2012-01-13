<?php
// $Id: joomla.page.tpl.php,v 1.1 2009/09/15 03:38:45 techsoldaten Exp $
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">
  <head>
    <title><?php print $head_title ?></title>
    <?php print $head ?>
    <?php print $styles ?>
    <?php print $scripts ?>
    <!--[if lt IE 7]>
      <?php print phptemplate_get_ie_styles(); ?>
    <![endif]-->
  </head>
  <body<?php print phptemplate_body_class($left, $right); ?>>
  <!-- wrapper //-->
  <div id="wrapper">
    <div id="header">
      <div id="joomla"><img alt="Joomla! Logo" src="<?php print base_path() . drupal_get_path('module', 'interface') ?>/templates/joomla/images/transparent.gif" height="37" width="270"/></div>
    </div>
  </div>
  <!-- menubar //-->
  <div id="menubar">
    <?php if (isset($primary_links)) : ?>
      <?php print theme('links', $primary_links, array('class' => 'links primary-links')) ?>
    <?php endif; ?>
  </div>
  <!-- lower menubar //-->
  <div id="menubar_lower">
    <div class="pathway">
      <?php print $breadcrumb; ?>
    </div>
    <div class="menudottedline">
    </div>
  </div>
  <div class="centermain" align="center">
    <div class="main">
      <div class="adminheading">
        <?php if ($title): print '<h2'. ($tabs ? ' class="with-tabs"' : '') .'>'. $title .'</h2>'; endif; ?>
      </div>
      <?php print $content ?>
    </div>
  </div>

  <div id="footer"><?php print $footer_message . $footer ?></div>
  <?php print $closure ?>

  <!-- Layout -->
  <?php if ($tabs): print '<div id="tabs-wrapper" class="clear-block">'; endif; ?>
  <?php if ($tabs): print '<ul class="tabs primary">'. $tabs .'</ul></div>'; endif; ?>
  <?php if ($tabs2): print '<ul class="tabs secondary">'. $tabs2 .'</ul>'; endif; ?>
  <?php if ($show_messages && $messages): print $messages; endif; ?>
  <?php print $help; ?>

  </body>
</html>
