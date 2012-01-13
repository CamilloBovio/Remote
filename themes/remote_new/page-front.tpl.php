<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">
<head>

    <title><?php print $head_title ?></title>
    <?php print $head ?>
    <?php print $styles ?>
    <?php print $scripts ?>

</script>
    
</head>
<body>
	

<!--PAGE LOADER*****************************************************************************************************-->

	<script type="text/javascript">
		QueryLoader.init();
	</script>


<!--TOP PAGE********************************************************************************************************-->
		
		<!-- Top for TOP SLIDER!!!-->

		<div id="top_section">

		</div> <!--END TOP_SLIDER-->

		<!-- jQuery handles to place the header background images -->
		<div id="header">
	<!-- jQuery handles to place the header background images -->
			<div id="headerimgs">
				<div id="headerimg1" class="headerimg"></div>
				<div id="headerimg2" class="headerimg"></div>
			</div>
		</div>


<!--WRAP************************************************************************************************************-->

	<div id="wrap">

		<div id="navbar">
			<div id="logo">
				
				
				<?php 
/*
				$image = "themes/remote_new/img/logo.png"; 
				$width = 140; 
				$height = 31; 
*/				
				echo '<img src="themes/remote_new/img/logo.png" style="width:140px; height: 31px;" alt="Remote logo"/>'; 
				
				?>
			</div> <!--END LOGO-->
			<div id="menu">
				<ul>
					<li class="news"><div>News</div></li>
					<li class="music"><div >Music</div></li>
					<li class="biography"><div>Biography</div></li>
					<li class="gallery"><div>Gallery</div></li>
					<li class="gasoline"><div>Gasoline</div></li>
					<li class="contact"><div>Contact</div></li>
				</ul>
			</div> <!--END MENU-->
		</div><!--END NAVBAR-->

		<!--<div id="gasoline"><?php print $gasoline ;?></div> -->


		<div class="block_content">
			<div class="title_block" id="title_featured">   </div><!--END BLOCK TITLE FEATURED-->
			<?php print $content; ?>
			<?php print $featured; ?>
		</div> <!--END FEATURED-->
		

		

		<div class="block_content" id="news_section">
			
			<div class="title_block" id="title_news"> </div><!--END BLOCK TITLE NEWS-->

			<div id="news_block"> <?php print $news; ?> </div> <!--END NEWS BLOCK-->

			<div id="feedback_block"> <?php print $feedback; ?> </div><!--END FEEDBACK BLOCK-->
			
			<div id="event_block"> <!--<h1>Next event</h1>--><?php print $events; ?> </div> <!--END NEWS BLOCK-->

		</div> <!--END NEWS EVENTS-->	
		

		
		
		<div class="block_content" id="music_section">
			<div class="title_block" id="title_music"> </div><!--END BLOCK TITLE MUSIC-->
			
			<div id="music_block"> <?php print $music; ?> </div> <!--END MUSIC BLOCK-->

			<div id="release_block"> <h1>Release</h1> <?php print $release; ?> </div> <!--END RELEASE BLOCK-->

			<div id="stores_block"> <?php print $stores; ?> </div> <!--END STORES BLOCK-->

		</div> <!--END MUSIC-->
		

		
		<div class="block_content" id="biography_section">
			<div class="title_block" id="title_biography"> </div><!--END BLOCK TITLE MUSIC-->
			<?php print $biography; ?>
		</div> <!--END BIOGRAPHY-->
		

		
		
		<div class="block_content" id="gallery_section">
			<div class="title_block" id="title_gallery"> </div><!--END BLOCK TITLE GALLERY-->
			<?php print $gallery; ?>
		</div> <!--END GALLERY-->




		<div class="block_content" id="gasoline_section">
			<div class="title_block" id="title_gasoline"> </div><!--END BLOCK TITLE GASOLINE-->

				<div id="gasoline_img"> <?php print $gasoline_img; ?> </div><!--END FORM-->
				<div id="gasoline_content"> <?php print $gasoline_content; ?> </div>

			
			
		</div> <!--END GASOLINE-->




		<div class="block_content" id="contact_section">
			<div class="title_block" id="title_contact"> </div><!--END BLOCK TITLE CONTACT-->

			<div id="links_block">

				<div class="all_links"> <?php print $links_remote; ?> </div> <!--Remote links--> <!--END ALL LINKS-->

				<div id="artist_links">  
					<div id="sam_links"> <?php print $links_sam; ?> </div><!--END SAM LINKS-->
					<div id="christian_links"> <?php print $links_christian; ?> </div><!--END SAM LINKS-->

					<div id="other_links"> <?php print $links_other; ?> </div><!--END OTHER LINKS-->

				</div> <!--END ARTIST-->
				
				 
			</div><!--END LINKS BLOCK-->
			
			<div id="contact_block"> 
				<h1>Contact form</h1>
				<?php print $contact; ?>
				<div id="avvertenze">
					<p>*Required fields <br /> Remote will use your personal data in accordance with the Italian Dec.Leg. 196/03 </p>
				</div><!--END AVVERTENZE--> 
			</div><!--END CONTACT BLOCK-->

		</div> <!--END BLOCK CONTACT-->

		<div class="block_content">

			<div id="footer">

				<div id="footer_menu">
				<ul>
					<li class="news"><div>News</div></li>
					<li class="music"><div >Music</div></li>
					<li class="biography"><div>Biography</div></li>
					<li class="gallery"><div>Gallery</div></li>
					<li class="gasoline"><div>Gasoline</div></li>
					<li class="contact"><div>Contact</div></li>
				</ul>
				</div> <!--END MENU-->
			
			<div id="firma">
				<?php print $footer; ?>
			</div><!--END FIRMA-->
			</div>

		</div> <!--END FOOTER-->


		<div id="scroller"><img src="themes/remote_new/img/btn/scroll_top.jpg"></img></div>

	</div><!--END WRAP-->

	<?php print $closure; ?>


</body>
</html>
