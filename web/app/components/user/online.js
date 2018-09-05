//best position for online container
	var width = $("#hm_rgth_dv_b").width();

	console.log(width);
	$("#online_a").css({"width": width, "display": "block"});

$('.oln-hd-ct').on('click', function(e){
	e.preventDefault();
	var oln_bd = $(this).parents('.online-b').find('.oln-bd');
	if(oln_bd.css('display') === 'block'){
		oln_bd.css('display', 'none');
	}else{
		oln_bd.css('display', 'block');
	}
	return false;
})

// Chatbox.focus(function(){
//     $(this).val(($(this).val()==searchBoxText)? '' : $(this).val());
// }).blur(function(){
//     $(this).val(($(this).val()=='')? searchBoxText : $(this).val());
// }).keyup(function(e){
//     var code = (e.keyCode ? e.keyCode : e.which);
//     if(code==13){
//         $('.fixedContent').append("<div class='userwrap'><span class='user'>"+user+"</span><span class='messages'>"+$(this).val()+"</span></div>");
//         event.preventDefault();
//
//         $(".fixedContent").scrollTop($(".fixedContent").height());
//         $(this).val('');
//     }
//
// });

$(document).on('click', '.oln-usr-dv', function(e){
	e.preventDefault();
	var chat_div = $('.cht-dv-a');					//get chat box node
		$('.cht-dv').append(chat_div);				//append the content to global chat div
		var toggle = true,							//by default body is set to display block
			name = $(this).data('firstname')+' '+$(this).data('lastname'),
			username= $(this).find('.oln-usr-lk-nm').attr('href'),
			//user_id = $(this).find('.oln-usr-lk-nm').attr('href'),
			searchBoxText= "Type here...",
			fixIntv,
			fixedBubblesize = $('.cht-bd-bubble').outerHeight()+'px',
			Bubble = $(".cht-bd-bubble"), // cache parent div
			Chatbox = $(".userinput"), // cache header div
			Footer = $(".cht-dv-foo"); // cache header div
			console.log(name);
		$('.cht-foo-nm').text(name);
		Footer.click(function(){
			console.log('foooooterrrr is clicked') ;
		    toggle = (!toggle) ? true : false;
		    if(toggle){
		        Bubble.css('display', 'block');
		    }else{
		        Bubble.css('display', 'none');
		    }
		});

	return false;
})
