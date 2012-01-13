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
	
<!--TOP PAGE********************************************************************************************************-->

		<div id="top_slider">
			<div id="headerimg1" class="headerimg"></div>
		</div> <!--END TOP_SLIDER-->




<!--WRAP************************************************************************************************************-->

	<div id="wrap">

		<div id="navbar">
			<div id="logo">				
				<?php $image = "../themes/remote_new/img/logo.png"; 
				$width = 140; 
				$height = 31; 
				echo '<img src="'.$image.'" style=width:"' . $width . 'px;height:' . $height . 'px;">'; ?>
			</div> <!--END LOGO-->

		</div><!--END NAVBAR-->


		<div class="block_content">			

			<?php print $content; ?>

		</div> <!--END FEATURED-->
		


	</div><!--END WRAP-->

	<?php print $closure; ?>

</body>
</html>
