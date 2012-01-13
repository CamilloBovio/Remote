<?php
// $Id: blank.tpl.php,v 1.1 2009/09/15 03:34:56 techsoldaten Exp $
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

    <?php if ($mission): print '<div id="mission">'. $mission .'</div>'; endif; ?>
    <?php if ($tabs): print '<div id="tabs-wrapper">'; endif; ?>
    <?php if ($title): print '<h2'. ($tabs ? ' class="with-tabs"' : '') .'>'. $title .'</h2>'; endif; ?>
    <?php if ($tabs): print '<ul class="tabs primary">'. $tabs .'</ul></div>'; endif; ?>
    <?php if ($tabs2): print '<ul class="tabs secondary">'. $tabs2 .'</ul>'; endif; ?>
    <?php if ($show_messages && $messages): print $messages; endif; ?>
    <?php if ($help): ?><?php print $help; ?><?php endif; ?>
    <?php print $content ?>
    <?php print $feed_icons ?>
    <?php print $closure ?>

  </body>
</html>
