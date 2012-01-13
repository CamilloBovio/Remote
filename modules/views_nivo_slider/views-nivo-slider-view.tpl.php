<?php
// $Id: views-nivo-slider-view.tpl.php,v 1.1.2.1 2010/04/12 19:31:10 pedrofaria Exp $ 
/**
 * @file
 *  Views Nivo Slider theme wrapper.
 *
 * @ingroup views_templates
 */
?>
<div id="<?php print $views_nivo_slider_id ?>" class="views-nivo-slider clear-block"> 
  <?php foreach ($rows as $row): ?>
    <?php print $row?>
  <?php endforeach; ?>
</div>
