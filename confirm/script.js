 $(document).ready(function(){
 	
	
	// LINKS OPACITY HOVER AND OUT ***************************************************
	
	$('#close_window').mouseover(function(){	
		$(this).animate({
			opacity: '.5'
		},150);		
	});
	
	$('#close_window').mouseout(function(){
		$(this).animate({
			opacity: '1'
		},150);
	});
	
 });