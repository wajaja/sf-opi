$(document).on('click', '.thr-elem', function(e){
	e.preventDefault();
	if($(this).attr('data-thr-id') === $(this).find('.thr-b-part ').attr('data-thr-id')){
		var thread_id = $(this).attr('data-thr-id');
		$.ajax({
			type:'get',
			url:'http://127.0.0.1/opinion/web/app_dev.php/messages/thread/'+$(this).attr('data-thr-id'),
			beforeSend: function(){
				//append loading gif when the server load data from database
				if(!$('.ibx-pg-nw').find('.ibx-loading-thr').length){
					$('.ibx-pg-nw').append(''+
						'<div class="ibx-loading-thr" ></div>'+
					'');
				}				
			},
			dataType: "json",
			success:function(data){
			//append thread_view and form from server [json response]
				$('.ibx-pg-nw').html(''+
					'<div class="" id="">'+data.thread+'</div>'+
				'');
			}
		});
		return false;
	}else{
		//return error
	}
	//open the thread by handling this id
	return false;
});

//add focus class when an element is focused
$('.thr-b-part').focus(function(){
	$(this).addClass('ibx-thr-focus');
});
$('.thr-b-part').blur(function(){
	$(this).removeClass('ibx-thr-focus');
});

//display inline-block or none for opt-date container
$('.thr-b-part').on('mouseover', function(){
	$(this).find('.thr-lst-msg-dte').css("display", "inline-block");
	$(this).find('.mrk-is-rd').css("display", "inline-block");
}).on('mouseout', function(){
	$(this).find('.thr-lst-msg-dte').css("display", "none");
	$(this).find('.mrk-is-rd').css("display", "none");
});

//mark its read by participant
$('.mrk-is-rd').on('click', function(e){
	e.preventDefault();
	var $this = $(this);
	if($(this).find('.read-mark').hasClass('fa-square-o')){
		//read mark is not read
		var thread_id = $(this).parents('.thr-b-part').attr('data-thr-id');
		$.ajax({
			type:'POST',
			url:'http://127.0.0.1/opinion/web/app_dev.php/messages/unread/'+thread_id,
			beforeSend: function(){
				$this.find('.read-mark').removeClass('fa-square-o');
				$this.find('.read-mark').addClass('fa-square');
			},
			dataType: "json",
			success:function(data){
				console.log(data.response.status);
			}
		});
		return false;
	}else{
		//mark is read by participant
		var thread_id = $(this).parents('.thr-b-part').attr('data-thr-id');
		$.ajax({
			type:'POST',
			url:'http://127.0.0.1/opinion/web/app_dev.php/messages/read/'+thread_id,
			beforeSend: function(){
				$this.find('.read-mark').removeClass('fa-square');
				$this.find('.read-mark').addClass('fa-square-o');
			},
			dataType: "json",
			success:function(data){
				console.log(data.response.status);
			}
		});
		return false;
	}
});

//delete thread link
$('.dlt-thr-fr-lst').on('click', function(e){
	e.preventDefault();
	var thread_id = $(this).parents('.thr-b-part').attr('data-thr-id');
	$('.abr-del-thr').attr("data-thr-id", thread_id);
	$('.confir-del-thr').attr("data-thr-id", thread_id);
	$('.dlt-modal-cont').attr("data-thr-id", thread_id);
	$('#thr_del_dialog').modal('show');					//show modal
	return false;

});

//relative to delete button on the thread list
$(document).on("click", ".confir-del-thr", function (e) {
	e.preventDefault();
	var $this = $(this);
	if($(this).parents('.dlt-modal-cont').attr('data-thr-id') === $(this).attr('data-thr-id')){
		var thread_id = $(this).parents('.dlt-modal-cont').attr('data-thr-id');
		$.ajax({
		   type:'POST',
		   url:'http://127.0.0.1/opinion/web/app_dev.php/messages/delete/'+thread_id,
		   beforeSend: function(){
			   if(!$this.parents('#thr_del_dialog').find('.modal-load-del-thr').length){
				   $this.parents('#thr_del_dialog').find('.modal-load-thr-sp').append('<span class="modal-load-del-thr"  style=""></span>')
			   }
		   },
		   dataType: "json",
		   success:function(data){
			   //remove modal
		   		$('.thr-elem').each(function(index, element){
					if($(element).attr('data-thr-id') === data.response.thread_id){
						$(element).remove();
					}
				})
			   $this.parents('#thr_del_dialog').find('.modal-load-thr-sp').html('<i class="fa fa-check" aria-hidden="true"></i>');
			   $this.parents('#thr_del_dialog').modal('hide');
		   }
		});
	}
	return false;
});
