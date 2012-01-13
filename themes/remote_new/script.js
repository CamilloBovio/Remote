/*--------------------------------------------------------------------------------------------*/
//   PRELOADER SCRIPT
/*--------------------------------------------------------------------------------------------*/

var QueryLoader = {
	/*
	 * QueryLoader		Preload your site before displaying it!
	 * Author:			Gaya Kessler
	 * Date:			23-09-09
	 * URL:				http://www.gayadesign.com
	 * Version:			1.0
	 * 
	 * A simple jQuery powered preloader to load every image on the page and in the CSS
	 * before displaying the page to the user.
	 */
	
	overlay: "",
	loadBar: "",
	preloader: "",
	items: new Array(),
	doneStatus: 0,
	doneNow: 0,
	selectorPreload: "body",
	ieLoadFixTime: 2000,  // originale = 2000
	ieTimeout: "",
		
	init: function() {
		if (navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/) == "MSIE 6.0,6.0") {
			//break if IE6			
			return false;
		}
		if (QueryLoader.selectorPreload == "body") {
			QueryLoader.spawnLoader();
			QueryLoader.getImages(QueryLoader.selectorPreload);
			QueryLoader.createPreloading();
		} else {
			$(document).ready(function() {
				QueryLoader.spawnLoader();
				QueryLoader.getImages(QueryLoader.selectorPreload);
				QueryLoader.createPreloading();
			});
		}
		
		//help IE drown if it is trying to die :)
		QueryLoader.ieTimeout = setTimeout("QueryLoader.ieLoadFix()", QueryLoader.ieLoadFixTime);
	},
	
	ieLoadFix: function() {
		var ie = navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/);
		if (ie[0].match("MSIE")) {
			while ((100 / QueryLoader.doneStatus) * QueryLoader.doneNow < 100) {
				QueryLoader.imgCallback();
			}
		}
	},
	
	imgCallback: function() {
		QueryLoader.doneNow ++;
		QueryLoader.animateLoader();
	},
	
	getImages: function(selector) {
		var everything = $(selector).find("*:not(script)").each(function() {
			var url = "";
			
			if ($(this).css("background-image") != "none") {
				var url = $(this).css("background-image");
			} else if (typeof($(this).attr("src")) != "undefined" && $(this).attr("tagName").toLowerCase() == "img") {
				var url = $(this).attr("src");
			}
			
			url = url.replace("url(\"", "");
			url = url.replace("url(", "");
			url = url.replace("\")", "");
			url = url.replace(")", "");
			
			if (url.length > 0) {
				QueryLoader.items.push(url);
			}
		});
	},
	
	createPreloading: function() {
		QueryLoader.preloader = $("<div></div>").appendTo(QueryLoader.selectorPreload);
		$(QueryLoader.preloader).css({
			height: 	"0px",
			width:		"0px",
			overflow:	"hidden"
		});
		
		var length = QueryLoader.items.length; 
		QueryLoader.doneStatus = length;
		
		for (var i = 0; i < length; i++) {
			var imgLoad = $("<img></img>");
			$(imgLoad).attr("src", QueryLoader.items[i]);
			$(imgLoad).unbind("load");
			$(imgLoad).bind("load", function() {
				QueryLoader.imgCallback();
			});
			$(imgLoad).appendTo($(QueryLoader.preloader));
		}
	},

	spawnLoader: function() {
		if (QueryLoader.selectorPreload == "body") {
			var height = $(window).height();
			var width = $(window).width();
			var position = "fixed";
		} else {
			var height = $(QueryLoader.selectorPreload).outerHeight();
			var width = $(QueryLoader.selectorPreload).outerWidth();
			var position = "absolute";
		}
		var left = $(QueryLoader.selectorPreload).offset()['left'];
		var top = $(QueryLoader.selectorPreload).offset()['top'];
		
		QueryLoader.overlay = $("<div></div>").appendTo($(QueryLoader.selectorPreload));
		$(QueryLoader.overlay).addClass("QOverlay");
		$(QueryLoader.overlay).css({
			position: position,
			top: top,
			left: left,
			width: width + "px",
			height: height + "px",
			background: "#111111 url(themes/remote_new/img/logo_preloader.png) no-repeat 50% 35%" //Logo Remote
		});

		QueryLoader.loadBar = $("<div></div>").appendTo($(QueryLoader.overlay));
		$(QueryLoader.loadBar).addClass("QLoader");
		
		$(QueryLoader.loadBar).css({
			position: "absolute",
			top: "85%",
			width: "0%"
		});
	},
	
	animateLoader: function() {
		var perc = (100 / QueryLoader.doneStatus) * QueryLoader.doneNow;
		if (perc > 99) {
			$(QueryLoader.loadBar).stop().animate({
				width: perc + "%"
			}, 500, "linear", function() { 
				QueryLoader.doneLoad();
			});
		} else {
			$(QueryLoader.loadBar).stop().animate({
				width: perc + "%"
			}, 500, "linear", function() { });
		}
	},
	
	doneLoad: function() {
		//prevent IE from calling the fix
		clearTimeout(QueryLoader.ieTimeout);
		


		//determine the height of the preloader for the effect
		if (QueryLoader.selectorPreload == "body") {
			var height = $(window).height();  //RIGA COMMENTATA
		} else {
			var height = $(QueryLoader.selectorPreload).outerHeight();
		}

		
		//The end animation, adjust to your likings
		$(QueryLoader.loadBar).animate({
			height: 1 + "px",
			//top: 0, //RIGA COMMENTATA
		}, 500, "linear", function() {
			$(QueryLoader.overlay).fadeOut(600);
			$(QueryLoader.preloader).remove();
		});
	}
}


 /*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

// Speed of the automatic slideshow
var slideshowSpeed = 10000;

// Variable to store the images we need to set as background
// which also includes some text and url's.
var photos = [
	{
		"title" : "Stairs",
		"image" : "background_img0.jpg",
		"url" : "http://www.sxc.hu/photo/1271909",
		"firstline" : "Going on",
		"secondline" : "vacation?"
	},	{
		"title" : "Stairs",
		"image" : "background_img1.jpg",
		"url" : "http://www.sxc.hu/photo/1271909",
		"firstline" : "Going on",
		"secondline" : "vacation?"
	}, {
		"title" : "Office Appartments",
		"image" : "background_img2.jpg",
		"url" : "http://www.sxc.hu/photo/1265695",
		"firstline" : "Or still busy at",
		"secondline" : "work?"
	}, {
		"title" : "Mountainbiking",
		"image" : "background_img3.jpg",
		"url" : "http://www.sxc.hu/photo/1221065",
		"firstline" : "Get out and be",
		"secondline" : "active"
	}, {
		"title" : "Office Appartments",
		"image" : "background_img4.jpg",
		"url" : "http://www.sxc.hu/photo/1265695",
		"firstline" : "Or still busy at",
		"secondline" : "work?"
	}, {
		"title" : "Mountainbiking",
		"image" : "background_img5.jpg",
		"url" : "http://www.sxc.hu/photo/1221065",
		"firstline" : "Get out and be",
		"secondline" : "active"
	}, {
		"title" : "Mountainbiking",
		"image" : "background_img6.jpg",
		"url" : "http://www.sxc.hu/photo/1221065",
		"firstline" : "Get out and be",
		"secondline" : "active"
	}, {
		"title" : "Mountainbiking",
		"image" : "background_img7.jpg",
		"url" : "http://www.sxc.hu/photo/1221065",
		"firstline" : "Get out and be",
		"secondline" : "active"
	}, {
		"title" : "Mountainbiking",
		"image" : "background_img8.jpg",
		"url" : "http://www.sxc.hu/photo/1221065",
		"firstline" : "Get out and be",
		"secondline" : "active"
	}, {
		"title" : "Mountainbiking",
		"image" : "background_img9.jpg",
		"url" : "http://www.sxc.hu/photo/1221065",
		"firstline" : "Get out and be",
		"secondline" : "active"
	}
];


/*--------------------------------------------------------------------------------------------*/
//   SVUOTAMENTO DEL VALUE NEL CONTACT FORM
/*--------------------------------------------------------------------------------------------*/


$(document).ready(function(){

	var name = $("#edit-submitted-name");
	var email = $("#edit-submitted-email");
	var message = $("#edit-submitted-message");

	name.click(function(){
		name.attr('value','');
	});

	email.click(function(){
		email.attr('value','');
	});

	message.click(function(){
		message.attr('value','');
	});

});

/*--------------------------------------------------------------------------------------------*/
//   SLIDE TOGGLE CONTACT LINKS
/*--------------------------------------------------------------------------------------------*/

$(document).ready(function(){   


	//SLIDE TOGGLE REMOTE LINKS
	var holder = $(this);
	var trigger_remote = holder.find(".toggle_remote").css({ cursor: "pointer" });
	var target_remote = holder.find(".links_remote").hide();

	trigger_remote.click(function() {
		target_remote.slideToggle("fast");
		return false;
	});


	//SLIDE TOGGLE SAM LINKS
	var holder = $(this);
	var trigger_sam = holder.find(".toggle_sam").css({ cursor: "pointer" });
	var target_sam = holder.find(".links_sam").hide();

	trigger_sam.click(function() {
		target_sam.slideToggle("fast");
		return false;
	});


	//SLIDE TOGGLE CHRISTIAN LINKS
	var holder = $(this);
	var trigger_christian = holder.find(".toggle_christian").css({ cursor: "pointer" });
	var target_christian = holder.find(".links_christian").hide();

	trigger_christian.click(function() {
		target_christian.slideToggle("fast");
		return false;
	});

});

/*--------------------------------------------------------------------------------------------*/
//   LINKS OPACITY
/*--------------------------------------------------------------------------------------------*/

 $(document).ready(function(){
 	

	$('.block_content a').hover(function(){
		$(this).find('img').stop().animate({opacity : 0.7},200);
	}, function() {
		$(this).find('img').stop().animate({opacity : 1},200);
	});


/*--------------------------------------------------------------------------------------------*/
//   SCROLL BUTTONS PAGE
/*--------------------------------------------------------------------------------------------*/

	function scrollWin(anc){  
    target = $(anc);  
    $('html, body').animate({  
        scrollTop: target.offset().top  
    }, 1000);  
	}

	$(".news").click(function() {  
        scrollWin("#news_section");  
    });

	$(".music").click(function() {  
        scrollWin("#music_section");  
    });
    
    $(".biography").click(function() {  
        scrollWin("#biography_section");  
    });
    
    $(".gallery").click(function() {  
        scrollWin("#gallery_section");  
    });

    $(".gasoline").click(function() {  
        scrollWin("#gasoline_section");  
    });
    
    $(".contact").click(function() {  
        scrollWin("#contact_section");  
    });
    
    $("#scroller").click(function() {  
        scrollWin("#top_section");  
    });
    
    
    
    
    

    // SCRIPT PER LO SFONDO CHE CAMBIA IMMAGINE!!!!!!!


    var activeContainer = 1;	
	var currentImg = 0;
	var animating = false;
	var navigate = function(direction) {
		// Check if no animation is running. If it is, prevent the action
		if(animating) {
			return;
		}
		
		// Check which current image we need to show
		if(direction == "next") {
			currentImg++;
			if(currentImg == photos.length + 1) {
				currentImg = 1;
			}
		} else {
			currentImg--;
			if(currentImg == 0) {
				currentImg = photos.length;
			}
		}
		
		// Check which container we need to use
		var currentContainer = activeContainer;
		if(activeContainer == 1) {
			activeContainer = 2;
		} else {
			activeContainer = 1;
		}
		
		showImage(photos[currentImg - 1], currentContainer, activeContainer);
		
	};
	
	var currentZindex = -1;
	var showImage = function(photoObject, currentContainer, activeContainer) {
		animating = true;
		
		// Make sure the new container is always on the background
		currentZindex--;
		
		// Set the background image of the new active container
		$("#headerimg" + activeContainer).css({
			"background-image" : "url(images/" + photoObject.image + ")",
			"display" : "block",
			"z-index" : currentZindex
		});
		
		// Hide the header text
		$("#headertxt").css({"display" : "none"});
		
		// Set the new header text
		$("#firstline").html(photoObject.firstline);
		$("#secondline")
			.attr("href", photoObject.url)
			.html(photoObject.secondline);
		$("#pictureduri")
			.attr("href", photoObject.url)
			.html(photoObject.title);
		
		
		// Fade out the current container
		// and display the header text when animation is complete
		$("#headerimg" + currentContainer).fadeOut(function() {
			setTimeout(function() {
				$("#headertxt").css({"display" : "block"});
				animating = false;
			}, 500);  //Originale 500
		});
	};
	
	var stopAnimation = function() {
		// Change the background image to "play"
		$("#control").css({ "background-image" : "url(images/btn_play.png)" });
		
		// Clear the interval
		clearInterval(interval);
	};
	
	// We should statically set the first image
	navigate("next");
	
	// Start playing the animation
	interval = setInterval(function() {
		navigate("next");
	}, slideshowSpeed);
      

 });



