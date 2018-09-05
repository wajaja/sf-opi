//jQuery('div.u_sugg_co').load("http://127.0.0.1/opinion/web/app_dev.php/suggest/user/less");
// setInterval(function(){
// 	jQuery('div.u_sugg_co').load("http://127.0.0.1/opinion/web/app_dev.php/suggest/user/less");
// }, 1125000);
jQuery(document).on('click', '.h-sugg-remove', function(e){
	e.preventDefault();
	jQuery(this).parents('.u-sugg-el').remove();

	console.log('retirer');
	return false;
});
//add ajax suggested user to friend list
jQuery(document).on('click', '.add-u-sugg', function(e){
    e.preventDefault();
    var user_id = $(this).parents('.u-sugg-el').attr('data-sugg-id'),
        parent = $(this).parents('.sugg-add-sp');
    if(jQuery(this).find('.fa-user-plus').length==1){
        jQuery.ajax({
            url: 'http://127.0.0.1/opinion/web/app_dev.php/add/'+user_id,
            type: 'POST',
            async: true,
            beforeSend: function(){
                if(!parent.find('.loading-invit-cfr').lenght){
                    parent.append('<span class="loading-invit-cfr"  style=""></span>');
                }    
            },
            success: function(data){
                if(data.response.status === true){
                    //add check icon if success and abord link
                    parent.html(''+
                        '<span class="u-sugg-scs-sp">Sending<i class="fa fa-check" style="color:green" aria-hidden="true"></i></span>'+
                        '<a href="#" class="delete-invitation" data-invit-dlt='+data.response.id+'>abord</a>');
                }else{
                     parent.append('<span class="u-sugg-scs-sp" style="color:red"> Error </span>');
                }
            },
            contentType:false,
            processData: false
        });
    }
    return false;
});
// add Friend from user suggestion list in body
$(document).on('click', '.sugg-btn-cfm-fri', function(){
    var target_id = $(this).parents('.sugg-cfm-sp').attr('data-trgt'),
        invitation_id = $(this).parents('.sugg-cfm-sp').attr('data-sugg-invit'),
        id = $(this).attr('data-btn-invit'),
        parent = $(this).parents('.inf-u-sugg-ct');
    //validate data by an if statement
    if($(this).attr('data-btn-invit')=== parent.attr('data-sugg-invit')){
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1/opinion/web/app_dev.php/confirm/friend/'+id,
            datatype: 'json',
            data: { invitation_id:invitation_id, user_id:target_id},
            beforeSend: function(){
                if(!parent.find('.loading-invit-cfr').lenght){
                    parent.append('<span class="loading-invit-cfr" style="bottom:5px"></span>');
                }    
            },
            success: function(data){
                if(data.response === true){
                    //add check icon if success
                    parent.html('<span class="u-sugg-scs-sp">Friend <i class="fa fa-check" style="color:green" aria-hidden="true"></i></span>');      
                }else{
                    parent.append('<span> Error </span>');
                }
            },
            error: function(xhr, status, error){
                var err = eval("("+xhr.responseText+")");
                console.log(err.Message);
            }
        });
    }
    return false;
});

//delete the invitation from all document
$(document).on('click', '.delete-invitation', function(e){
    e.preventDefault();
    
    var invitation_id = $(this).attr('data-invit-dlt'),
        parent,
        inbody;
        
    /* for all out navbar notification,
     * ex:home suggestion */ 
    if($(this).parents('.u-sugg-el').length){
        parent = $(this).parents('.inf-u-sugg-ct');
        inbody = true;
    }
    //for navbar note 
//    if($(this).parents('.invit-r-c-ct').length){
//        parent = $(this).parents('.invit-r-c-ct');
//        inbody = false; 
//    }

    $.ajax({
        type: 'post',
        url: 'http://127.0.0.1/opinion/web/app_dev.php/invitation/delete/'+invitation_id,
        datatype: 'json',
        data: { invitation_id:invitation_id},
        beforeSend: function(){
            if(!parent.find('.loading-invit-cfr').lenght){
                parent.append('<span class="loading-invit-cfr" style="bottom:5px"></span>');
            }    
        },
        success: function(data){
            if(data.response.status === true){                
                if(inbody === true){                    
                    console.log('here its work');
                    //add check icon if success
                    parent.html(''+
                        '<span data-trgt='+data.response.userId+' class="sugg-add-sp">'+
                            '<button data-sugg-usrid='+data.response.userId+' data-username='+data.response.username+'  class="add-u-sugg">'+
                                'Add <i class="fa fa-user-plus"></i>'+
                            '</button>'+
                        '</span>'+
                            '');      
                }else{
                    parent.append('<span style="color:red" > Error </span>');
                }
            }else{
                //remove the invitation
                parent.parents('.u-sugg-el').remove();
            }                
        },
        error: function(xhr, status, error){
            var err = eval("("+xhr.responseText+")");
            console.log(err.Message);
        }
    });
    return false;
});
//confirm as follower || add as follower 
$(document).on('click', '.sugg-btn-cfm-flw', function(e){
    e.preventDefault();
    var target_id = $(this).parents('.sugg-cfm-sp').attr('data-trgt'),
        invitation_id = $(this).parents('.sugg-cfm-sp').attr('data-sugg-invit'),
        id = $(this).attr('data-btn-invit'),
        parent = $(this).parents('.sugg-cfm-sp');
    //validate data by an if statement
    if($(this).attr('data-btn-invit')=== parent.attr('data-sugg-invit')){
        console.log('egale');
    }
    $.ajax({
        type: 'post',
        url: 'http://127.0.0.1/opinion/web/app_dev.php/confirm/follower/'+id,
        datatype: 'json',
        data: { invitation_id:invitation_id, userid:target_id},
        beforeSend: function(){
            if(!parent.find('.loading-invit-cfr').lenght){
                parent.append('<span class="loading-invit-cfr style="bottom:5px"></span>');
            }
        },
        success: function(data){
            if(data.response.status === true){
                //add check icon if success
                parent.html('<span class="u-sugg-scs-sp nv-invit-scss">Suivi <i class="fa fa-check" style="color:green" aria-hidden="true"></i></span>');      
            }else{
                parent.append('<span style="color:red> Error </span>');
            }
        },
        error: function(xhr, status, error){
            var err = eval("("+xhr.responseText+")");
            console.log(err.Message);
        }
    });
    return false;
});