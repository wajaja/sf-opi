//open new thread form message in modal
//function to retrieve list of users from database; (username, firstname, and lastname)
function getUsers(){
    $.ajax({
        type:'get',
        url: 'http://127.0.0.1/opinion/web/app_dev.php/ff/users',
        success: function (data) {
            var users = data.users,
                options_array = new Array(),
                //loop trought users getting username and name
                i = 0;
                users.forEach(function(user){
                    var username = user.username,
                        key = i,
                        pic = user.pic_path,
                        name = user.firstname+' '+user.lastname,
                        option = {'id':i, 'pic':pic, 'username':username, 'name':name};
                        options_array.push(option);
                    i = i+1;
                });
            var options = options_array;
            //stock users array in html element tag
            $('.fri-stk-data').attr('data-users', JSON.stringify(options_array));
        },
        failure: function(Error){
            Error.bind();
        }
    });
}
//call getUsers Function
getUsers();

$(document).on('click', '#idx_create_nw_thd', function(e){
    e.preventDefault();

    /*disable or return false if another exist in the body
    */
    if($('.thread-form').find('.msg-dv-th').length){
        if($('.nw-thr-recip-b').css('display') === "block"){
            return false;
        }
    }

    var $this = $(this),
        closeBt = '',
        cancelBt = '';
        jQuery.ajax({
            type:'get',
            url:'http://127.0.0.1/opinion/web/app_dev.php/messages/create?id=create',
            beforeSend: function(){
                $("body").thread_modal({
                    modalTarget:'thread-modal',
                    text: '',
                    how: 'append',
                    open:'true',
                    animationDuration:'.9s',
                    beforeOpen: function(){
                        jQuery('.modal_thread').append(''+
                              '<div class="opinion_share_form_out thread_modal_out" ></div>'+
                              '<div class="thr-modal-container">'+
                                  '<a href="" id="thread-modal-close " class="thread-modal-close"><i class="fa fa-times "></i></a>'+
                                  '<div class="opinion_oshare_form_div thread_modal_div" style="animationDuration:5.9s">'+
                                    '<div class="loading_share loading_thread" ></div>'+
                                  '</div>'+
                              '</div>');
                    },     //end before function
                    afterOpen: function(){},
                    beforeClose: function(){console.log('beforeClose');},
                    afterClose: function(){console.log('afterClose');}
                });   //add message
            },
            dataType: "json",
            success:function(data){
            //append thread_form from server [json response]
            jQuery('.thread_modal_div').html(''+
                    '<div class="thModal" id="">'+
                        '<div class="nav-modal-thread" id="">'+data.thread+'</div>'+
                    '</div>'+
                    '');
        }
    });
    return false;
});
$(document).on('click', '.ibx-answering-btn', function(e){
    e.preventDefault();
    console.log('ibx-answering-btn');
    return false;
});
$(document).on('click', '.ibx-config', function(e){
    e.preventDefault();
    console.log('ibx-config');
    return false;
});
$(document).on('click', '#ibx_voc_msg_btn', function(e){
    e.preventDefault();
    console.log('ibx_voc_msg_btn');
    return false;
});

//detect something when we'll add a subject to an existing thread
$(document).on('click', '.add-ttl', function(e){
    e.preventDefault();
    if($('.nw-msg-recip').find('.lst').length > 0){
        console.log('recipient detected');
    }else{

    }
    $('.nw-thr-ttl-b').toggleClass('is-closed').slideToggle('slow');
    return false;
});

//get change event on the recipient div
$(document).on('DOMNodeInserted', '.nw-msg-recip', function(){
    var recip_pic_array = new Array();
     //get each recip url_pic push on array
    $('.selec-field').each(function(){
        var recip_pic = $(this).find('.selec-pic').data('pic-url');
        recip_pic_array.push(recip_pic);
    });
    //remove text content
    $('.ibx-thr-select-nm').text('');
    //appends each url_pic to recip selec
    recip_pic_array.forEach(function(recip_pic){
        $('.ibx-thr-select-nm').append('<img class="recip-img" src='+recip_pic+' id="_recip_img"/>');
    });
});
/*detect on remove some node of recipient username
 * then remove the user picture at the top of thread node
*/
$(document).on('DOMNodeRemoved', '.nw-msg-recip', function(){
    var recip_pic_array = new Array();
    $('.selec-field').each(function(){
        var recip_pic = $(this).find('.selec-pic').data('pic-url');
        recip_pic_array.push(recip_pic);
    });
    if($('.ibx-thr-select-nm').find('.recip-img').length==0){
         $('.ibx-thr-select-nm').text('No Selection'); //add text over recip content image
    }else{
        $('.ibx-thr-select-nm').text('');//delete text over recip content image
        recip_pic_array.forEach(function(recip_pic){
            $('.ibx-thr-select-nm').append('<img class="recip-img" src='+recip_pic+' id="_recip_img"/>');
        });
    }

});
