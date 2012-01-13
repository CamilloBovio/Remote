/*--------------------------------------------------------------------------------------------*/
//   SVUOTAMENTO DEL VALUE
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