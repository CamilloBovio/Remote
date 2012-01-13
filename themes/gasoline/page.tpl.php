<?php
// $Id: page.tpl.php,v 1.18.2.1 2009/04/30 00:13:31 goba Exp $
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">
  <head>

    <title><?php print $head_title ?></title>
    <?php print $head ?>
    <?php print $styles ?>
    <?php print $scripts ?>
    
</head>
<body>
	
	<div id="wrap">
		
		<?php $image = "themes/gasoline/img/send-your-demo.png"; 
		$width = 520; 
		$height = 214; 
		echo '<img src="'.$image.'" style=width:"' . $width . 'px;height:' . $height . 'px;">'; ?>

	<?php print $content; ?>
	<div id="avvertenze">
	<p>*Required fields <br /> GASOLINE RECORDS will use your personal data in accordance with the Italian Dec.Leg. 196/03 </p>
	</div><!--avvertenze-->

	<?php print $closure; ?>

	</div><!-- END WRAP -->
</body>
</html>
