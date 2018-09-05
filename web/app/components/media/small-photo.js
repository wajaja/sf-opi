var galleryUploader = new qq.FineUploader({
    element: document.getElementById('fine-uploader-gallery'),
    template: 'qq-template-gallery',
    request: {
        endpoint: Routing.generate('_uploader_upload_galleryimage'),
        params: {
            galleri: "{{ gallery.id }}"
        }
    },
    autoUpload: true,
    success: true,
    iframeSupport: {
        localBlankPagePath: ""
    },
  	cors: {
        expected: true 
    },
  	resume: {
        enabled: true
    },
  	deleteFile: {
  		forceConfirm: false,
        enabled: true,	
        method: "POST",	
        endpoint: Routing.generate('delete_gallery_image')
    },
    thumbnails: {
        // placeholders: {
        //     waitingPath: '/source/placeholders/waiting-generic.png',
        //     notAvailablePath: '/source/placeholders/not_available-generic.png'
        // }
    },
    // validation: {
    //     itemLimit: 5,
    //     sizeLimit: 15000000
    // },
    callbacks: {
    	onSubmitted: function(id, name) {
    		console.log('submit deletion');
    	},
    	onSubmitDelete: function(id) {
    		this.setDeleteFileParams({filename: this.getName(id)}, id);		//send filename as parameter on deleteSubmit
    	},
    	onDeleteComplete: function(id, xhr, isError) {
    		console.log(xhr.response);
    	},
        onComplete: function(id, name, response) {
            var previewLink = qq(this.getItemByFileId(id));//.getByClass('preview-link')[0];
        	console.log(previewLink);

            // if (response.success) {
            //     previewLink.setAttribute("href", response.tempLink)
            // }
        }
    }
    // debug: true
});

    // qq(document.getElementById("trigger-upload")).attach("click", function() {
    //     manualUploader.uploadStoredFiles();
    // });
$(document).on('click', '.btn-create-gal', function(e){
	e.preventDefault();
	CreateGallery.OpenModal();
});

//Save gallery images
$(document).on('click', '#save_gal', function(e) {
	e.preventDefault();
	var gal_form 	= $(this).parents('form'),
		gal_title	= gal_form.find('#gal_type_title').val(),
		formData 	= new FormData();
	formData.append('gallery_title', gal_title);
	console.log('title :' +gal_title);
    $.ajax({
        type: 'post',
        url: Routing.generate('gallery_create'),
        beforeSend: function () {
          	// loading div when the ajax request
            if (!gal_form.find('.ajax-loader-form').length) {
                gal_form.find('.gal-ldr-save').html('<div class="ajax-loader-form" id=""></div>');
            }
        },
       data: formData,
       contentType: false,
       processData: false,
       success: function (data) {
           // loading div when the ajax request
           if (glForm.find('.ajax-loader-form').length) {
               glForm.find('.gal-ldr-save').html('');
               //glForm.addClass("minOpac");
           }
           console.log(data);
          galleryUploader.reset(); 
       },
       failure: function () {}
   });
   return false;
});

//Post gallery images
$(document).on('click', '#post_gal', function(e) {
	e.preventDefault();
	var gal_form 	= $(this).parents('form'),
		gal_title	= gal_form.find('#gal_type_title').val(),
		formData 	= new FormData();
	formData.append('gallery_title', gal_title);
	console.log('title :' +gal_title);
    $.ajax({
        type: 'post',
        url: Routing.generate('gallery_create'),
        beforeSend: function () {
          	// loading div when the ajax request
            if (!gal_form.find('.ajax-loader-form').length) {
                gal_form.find('.gal-ldr-pst').html('<div class="ajax-loader-form" id=""></div>');
            }
        },
       data: formData,
       contentType: false,
       processData: false,
       success: function (data) {
       		var newsOject = new NewsObject();
           // loading div when the ajax request
           if (glForm.find('.ajax-loader-form').length) {
               glForm.find('.gal-ldr-pst').html('');
               //glForm.addClass("minOpac");
           }
           console.log(data);
           newsOject.prependPost(data);
          //  cancel modal style 
          var $body           = $('body');
          //     $form_out       = $body.find('.gl-frm-out'),
          //     $form           = $body.find('.gl-frm-a');
          // $form_out.removeClass('out-active');
          // $form.removeClass('out-active');

          var gallery             = data.response.gallery,
              date                = gallery.updated ? gallery.updateAt : gallery.createdAt,
              image_HTML          = '',
              nb_img              = 0,
              doc                 = document,
              images              = gallery.images,
              title 			  = gallery.title,
              commentForm_HTML    = data.response.commentForm;

          galleryUploader.reset(); 
           
           //images container
           if (images.length === 0){ }
           else if (images.length === 1){
               image_HTML += '<div class ="pst-dv-one-img" data-pst-id='+ post.id +' data-imgs-id="">';
               images.forEach(function(image, index){
                   image_HTML +=   '<a href="" class="pst-img-lk" data-img-id='+image.id+' id=>'+
                                       '<img src='+ image.webPath +' class="pst-jst-oe-img" data-img-id='+ image.id +'/>'+
                                   '</a>';
                   });
               image_HTML += '</div>';
           }
           else if(images.length === 2){
               image_HTML += '<div class ="pst-dv-two-img" data-pst-id='+ post.id +' data-imgs-id="">';
               images.forEach(function(image, index){
                   image_HTML +=    '<a href="" class="pst-img-lk" data-img-id='+image.id+' >'+
                                       '<img src='+ image.webPath +' class="pst-jst-to-img" data-img-id='+image.id+'/>'+
                                   '</a>';                                                                               
               });
               image_HTML += '</div>';
           }
           else if (images.length > 2) {
               nb_img = images.length - 3;
               image_HTML += '<div class ="pst-dv-pls-img" data-pst-id='+ post.id +' data-imgs-id="">';
               images.forEach(function(image, index){
                   if (index === 0){
                       image_HTML +=   '<a href="" class="pst-img-lk first" data-img-id='+ image.id +' >'+
                                           '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
                                       '</a>';
                   }
                   else if (index === 1){
                       image_HTML += '<div class="pst-dv-pls-img-lft">'+
                                       '<a href="" class="pst-img-lk scond" data-img-id='+ image.id +' >'+
                                           '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
                                       '</a>';
                   }
                   else if (index === 2){
                       image_HTML +=  '<div class ="pst-dv-thir-img" data-pst-id='+ post.id +'>'+
                                           '<a href="" class="pst-img-lk thir" data-img-id='+ image.id +'>'+
                                               '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
                                           '</a>'+
                                           '<a href="" class="see-mr-pst-img '+ (nb_img ? '' : 'none-see-mr-img')+'" data-pst-id='+ post.id +'>'+
                                               '<i class="fa fa-plus" aria-hidden="true"></i>'+
                                               '<span class="nb-img-txt">'+ nb_img +'</span>'+
                                           '</a>'+
                                       '</div>';     
                   }                    
               });
               image_HTML += '</div>';
           }else{
               
           }            
           //prepend the new post to news list
           $('div#_nws_dv_b').prepend('<div class ="pst-c new-pst" >'+
               '<div class="pst-edt-out"></div>'+
               '<div class ="pst-d" >'+
                   '<div class ="pst-e" id="_pst_e">'+
                       '<div class ="pst-f" >'+
                           '<div class ="pst-g" id="_pst_g" data-pst-id='+post.id+' data-auth-id='+post.author.id+'>'+
                               '<div class ="pst-h" >'+
                                   '<div class ="pst-i" >'+
                                       '<div class ="pst-j" id="_pst_j" data-pst-id='+post.id+'>'+
                                           '<div class ="pst-ctnr" >'+
                                               '<div class ="pst-ctnr-tp" >'+
                                                   '<div class ="lft-pst-ctnr-tp" data-aut-arr="">'+
                                                       '<div class ="pst-dv-pic" data-aut-id="{{post.author.id}}">'+
                                                           '<a href='+post.author.username+' class="pst-aut-pic-lk" >'+
                                                               '<img src='+post.author.profilPic+' id="user-profile" class ="pst-aut-pic"  />'+
                                                           '</a>'+
                                                       '</div>'+                             
                                                   '</div>'+                                                    
                                                   '<div class="rght-pst-ctnr-tp">'+
                                                       '<div class="rght-pst-dv-aut" data-usr-id='+post.author.id+'>'+
                                                           '<a class ="pst-aut-nm" href='+post.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
                                                           '<a href="" class="pst-aut-pub">@'+post.author.username+'</a>'+
                                                       '</div>'+
                                                       '<div class ="pst-dv-dte" data-dte-cmp="">'+                                                            
                                                           '<span class="pst-dte">'+date.time.minute+'</span>'+
                                                       '</div>'+
                                                   '</div>'+
                                                   '<div class ="rght-pst-ctnr-tp-abs">'+
                                                       '<div class ="pst-opt" data-pst-id='+ post.id +'>'+
                                                           '<a href="" class="pst-opt-lk" data-pst-id='+ post.id +' data-auth-id='+ post.author.id +'><i class="fa fa-chevron-down" aria-hidden="true"></i></a>'+
                                                       '</div>'+
                                                   '</div>'+
                                               '</div>'+
                                               '<div class="pst-ctnr-mdl">'+                                                                                                   
                                                   '<div class="rght-pst-ctnr-mdl" >'+
                                                       '<div class ="rght-pst-ctnr-mdl-a">'+
                                                           '<div class ="pst-dv-txt-ctn">'+
                                                               '<div id="postContent" class ="postContent" >'+ post.content +'</div>'+
                                                           '</div>'+
                                                           '<div class ="pst-dv-img-ctn">'+
                                                               '<div class ="pst-dv-img-ctn-a">'+
                                                                   '<div class ="pst-dv-img-ctn-b">'+
                                                                       '<div class ="pst-dv-img">'+
                                                                           image_HTML +
                                                                       '</div>'+
                                                                   '</div>'+
                                                               '</div>'+
                                                           '</div>'+
                                                       '</div>'+
                                                   '</div>'+
                                               '</div>'+
                                           '</div>'+
                                       '</div>'+
                                   '</div>'+
                               '</div>'+
                               '<div class="fooPost" >'+
                                   '<div class ="fooPost-a">'+
                                       '<div class ="fooPost-b" >'+
                                           '<div class ="fooPost-c" >'+
                                               '<div id="postQuestionDiv" class ="postQuestionDiv" data-pst-id='+ post.id +'>'+
                                                   '<a href="" class="postQuestion-icon-form" id="postQuestion-icon-form" data-form-question="" data-pst-id='+ post.id +'>'+
                                                       '<span class="glyphicon glyphicon-question-sign"></span>'+
                                                   '</a>'+
                                                   '<span class="pst-qst-noti" data-qst-id=""></span>'+
                                                   '<span class="pst-qst-nb" data-qst-nb=""></span>'+
                                               '</div>'+
                                               '<div id="postShareDiv" class ="postShareDiv" data-pst-id='+ post.id +'>'+
                                                   '<a href="" class="postShare-icon-form" data-pst-id='+ post.id +' id="postShare-icon-form" >'+
                                                       '<i class="fa fa-share-alt"></i>'+
                                                   '</a>'+
                                                   '<span class="pst-shr-nb"></span>'+
                                               '</div>'+
                                               '<div id="comment" class ="pCommentDiv" >'+
                                                   '<a href="" class ="linkPcomment" ><i class="fa fa-comment"></i></a>'+
                                                   '<span class="pst-cmts-nb"></span>'+
                                               '</div>'+
                                               '<div id="_plke_dv" class="plikeDiv" data-pst-id='+ post.id +'>'+
                                                   '<span class="sp-like-icn-ctnr">'+
                                                       '<a class ="linkPlike" rel="linkPlike" href="" >'+
                                                           '<i class="fa fa-thumbs-o-up like-sty"></i>'+
                                                       '</a>'+
                                                   '</span>'+
                                                   '<span class="hide-rat pst-like-rat-ctnr"></span>'+
                                                   '<span class="sp-like-mr-i">'+
                                                       '<a href="" class="lk-graph-plike" data-rat="" data-ttl-rat="" data-pst-id='+ post.id +'></a>'+
                                                       '<span name="nbPlikes" class="nbPlikes" data-lkr-nb=""></span>'+
                                                   '</span>'+
                                               '</div>'+
                                           '</div>'+
                                       '</div>'+
                                   '</div>'+
                                   '<div class ="postDetail">'+
                                       '<div class ="" style="width: auto; overflow: visible; background-color: #f6f7f8 ">'+
                                           '<div class ="" style="display: block">'+
                                               '<span></span><a href=""></a>'+
                                               '<span></span>'+
                                           '</div>'+
                                       '</div>'+
                                   '</div>'+
                                   '<div class="pst-cmt-ctnr">'+
                                       '<div class="pst-cmt-ctnr-a">'+
                                           '<div class="containerComments" >'+
                                               '<div class ="gComment" >'+
                                               '</div>'+
                                           '</div>'+
                                       '</div>'+
                                   '</div>'+
                                   '<div class ="pst-cmt-frm">'+
                                       '<div class ="pst-cmt-frm-a">'+
                                           '<div class ="pst-cmt-frm-b">'+
                                               '<div class ="pst-cmt-frm-ctnr" id="" data-pst-id='+ post.id +' data-pst-val='+ post.id +'>'+
                                                  commentForm_HTML+
                                               '</div>'+
                                           '</div>'+
                                       '</div>'+
                                   '</div>'+
                               '</div>'+
                           '</div>'+
                       '</div>'+
                   '</div>'+
               '</div>'+
           '</div>');
           //animate opacity after prepreding data to news div container 
           var news_container = document.getElementById('_nws_dv_b'),
               post_container = news_container.querySelector(".new-pst");
               window.getComputedStyle(post_container).opacity;
               post_container.className += ' appended';

          $(document).ready(function(e){
            var areas = document.querySelectorAll('.div-textareaComment');
            for(var i = 0; i < areas.length; i++ ){
                makeCommentEpandingArea(areas[i]);
            }    
          });
       },
       failure: function () {}
   });
   return false;
});