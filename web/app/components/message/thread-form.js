//for fineUploader   //for post  //Ajout de Endpoint Par Cedrick Ngeja le 14.09
var threadUploader = new qq.FineUploader({
	debug: true,
        element: $('#fine-uploader-thread')[0], template: 'qq-template-thread',
	request: {endpoint: "/opinion/web/app_dev.php/_uploader/gallerythread/upload"},
	autoUpload: true, success: true,
	iframeSupport: {localBlankPagePath: ""	},
	cors: {	expected: true },
	resume: {enabled: true},
	deleteFile: {enabled: true,
        method: "POST",	endpoint: ""},
	validation: {itemLimit: 5, sizeLimit: 15000000, allowedExtensions: ['jpeg', 'jpg', 'gif', 'png']}
});
//
//$( ".link-doc-upload").click(function(e) {
//    e.preventDefault();
//    $(this).nextAll().trigger( "click" );
//    return false;
//});
/*jslint unparam: true */
/*global window, $ */
$(function () {
    'use strict';
   var path = "/opinion/web/app_dev.php/_uploader/gallerymsgdoc/upload";
    // Change this to the location of your server-side upload handler:
    $('#document').fileupload({
        url: path,
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        done: function (e, data) {
            var attach = $('.documents-container').find('.doc-item').last().find('.doc-nm');
            $.each(data.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(attach);
            });
        },
        progress: function (e, data) {
            $('.documents-container').append(''+
                    '<div class="doc-item">'+
                        '<div class="doc-nm"></div>'+
                        '<div id="progress" class="progress">'+
                            '<div class="progress-bar progress-bar-success"></div>'+
                        '</div>'+
                    '</div>'+
                    '');
            var progress = parseInt(data.loaded / data.total * 100, 10);
            var attachBar = $('.documents-container').find('.doc-item').last().find('.doc-nm');
            $('#progress .progress-bar').last().css(
                'width',
                progress + '%'
            );
            if(progress==100){
                console.log('deja rempli');
            }else{
                console.log('toujour en evolution...');
            }
        }
    });
});

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

            var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

              $('.nw-msg-recip').selectize({
                  persist: false,
                  maxItems: null,
                  valueField: 'username',
                  labelField: 'name',
                  searchField: ['name', 'username'],
                  options: options,
                  render: {
                      item: function(item, escape) {
                          return '<div class="selec-field">' +
                              (item.name ? '<span class="selec-name">' + escape(item.name) + '</span><br/>' : '') +
                              (item.pic ? '<span class="selec-pic" data-pic-url='+escape(item.pic)+'></span>':'') +
                          '</div>';
                      },
                      option: function(item, escape) {
                          var label = item.name || item.username;
                          var caption = item.name ? item.username : null;
                          return '<div class="selec-sugg">' +
                              '<span class="label">' + escape(label) + '</span><br/>' +
                              (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                          '</div>';
                      }
                  },
                  createFilter: function(input) {
                      var match, regex;

                      // username@address.com
                      regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
                      match = input.match(regex);
                      if (match) return !this.options.hasOwnProperty(match[0]);

                      // name <username@address.com>
                      regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
                      match = input.match(regex);
                      if (match) return !this.options.hasOwnProperty(match[2]);

                      return false;
                  },
                  create: function(input) {
                      if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
                          return {username: input};
                      }
                      var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
                      if (match) {
                          return {
                              username : match[2],
                              name  : $.trim(match[1])
                          };
                      }
                      alert('Invalid username address.');
                      return false;
                  },
                      hideSelected: true,
              openOnFocus: false
              });
            return true;
        },
        failure: function(Error){
            Error.bind();
        }
    });
}

if(getUsers()){
    console.log($('.fri-stk-data').attr('data-users'));	//get Users list);
}	//get Users list)

// created an textarea dynamic height
$(document).one('focus.textarea', '.autoExpand-message', function(){
          var savedValue = this.value;
          this.value = '';
          this.baseScrollHeight = this.scrollHeight;
          this.value = savedValue;
  }).on('input.textarea', '.autoExpand-message', function(){
          var minRows = this.getAttribute('data-min-rows-message')|0, rows;
          this.rows = minRows;
// console.log(this.scrollHeight , this.baseScrollHeight);
          rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
          this.rows = minRows + rows;
  });

  //manage scrolling massage container
  var height = 0;
  $('.ibx-pg-nw-bd .msg-dv-th').each(function(i, value){
      //add all height value for each message div
      height +=parseInt($(this).height());
  });
  height +='';
  $('.ibx-pg-nw-bd').animate({scrollTop : height});

  //manage submit by handle submit event
  $(document).on('submit', 'form.thread-form', function(e){
      e.preventDefault();
      var form = $(this);
      //no thread
      if(!form.find('.msg-dv-th').length){
          if(form.find('#thread_message_recipients').val()!== ''){
              var newThreadForm = new FormData(this);    //new thread form handler
                  newThreadForm.append('thread_id', '');
              form.find('.msg-container').append(''+
                  '<div class="msg-dv-th self-msg">'+
                      '<span class="thr-msg-lft">'+
                          '<a href='+ form.find('.thr-idtf').attr('data-cur-username') +' class="a-msg-sdr">'+
                              '<img src='+ form.find('.thr-idtf').attr('data-cur-pic')  +' style="width:40px; height: 40px;" />'+
                          '</a>'+
                      '</span>'+
                      '<span class="thr-msg-rght">'+
                          '<span class="sp-msg-sdr">'+
                              '<a href='+ form.find('.thr-idtf').attr('data-cur-username')  +' class="a-msg-sdr">'+form.find('.thr-idtf').attr('data-cur-first')+' '+form.find('.thr-idtf').attr('data-cur-last') +'</a>'+
                              '<span href="#" class="msg-tp-rght">'+
                                  '<span href="#" class="msg-date">instant</span>'+
                                  '<a href="#" class="msg-config"><i class="fa fa-cog" aria-hidden="true"></i></a>'+
                              '</span>'+
                          '</span>'+
                          '<span class="sp-msg-bdy ">'+ form.find('.nw-msg-bod').val() +'</span>'+
                          '<span class="sp-msg-img"></span>'+
                          '<span class="sp-msg-doc"></span>'+
                      '</span>'+
                  '</div>'+
                  '');

              jQuery.ajax({
                  url: 'http://127.0.0.1/opinion/web/app_dev.php/messages/create?id=create',
                  type: 'POST',
                  data: newThreadForm,
                  async: true,
                  contentType:false,
                  processData: false,
                  beforeSend: function(){
                      //manage scrolling massage container
                     var height = 0;
                     $('.ibx-pg-nw-bd .msg-dv-th').each(function(i, value){
                         height +=parseInt($(this).height());  //add all height value for each message div
                     });
                     height +='';
                     $('.ibx-pg-nw-bd').animate({scrollTop : height});
                      //if not image to upload
                      $('.qq-thumbnail-selector').each(function(index, element){
                        if( typeof $(element).attr('src') === 'undefined'){
                            //append data without the loading gif
                        }else{
                           //image existing
                            if(!form.find('.loading-note').length){
                                    form.find('.sp-msg-img').last().append('<span class="loading-note img-up"></span>');
                            }
                        }
                      });
					 	//reset uploader
                    threadUploader.reset();
                    form.find('#thread_message_subject').val('');
                    form.find('#thread_message_body').val('');
                  },
                  success: function(data){
                     if(data.response.status === true){
                        form.find('.nw-thr-recip-b').css("display", "none");		//remove recipients
                        //set threadId value to message_container
                        form.find('#_msg_container').attr('data-thr-id', data.response.threadId);
                        form.find('#_thr_idtf').attr('data-thr-id', data.response.threadId);
                        form.find('#thread_message__token').val(data.response.token);	//new token value for threadForm
                        //add images
                        if(data.response.images.length){
                            form.find('.sp-msg-img').last().html('');					//remove loading gig
                            data.response.images.forEach(function(element, index){
                                form.find('.sp-msg-img').last().append(''+
                                    '<a href='+element.id+' class="lk-msg-img" id='+index+'>'+
                                        '<img src='+element.webPath+' class="imageComment"/>'+
                                    '</a>'+
                                '');
                           });
                        }
                        //manage scrolling massage container
                        var height = 0;
                        $('.ibx-pg-nw-bd .msg-dv-th').each(function(i, value){
                                 height +=parseInt($(this).height());  //add all height value for each message div
                        });
                        height +='';
                        $('.ibx-pg-nw-bd').animate({scrollTop : height});
                    }
              	}
          	});
          }else{
              console.log('selectionner le destinateur');
         }
      }else{
          //thread exist
          if(form.find('.thr-idtf').attr('data-thr-id') === form.find('.msg-container').attr('data-thr-id')){
              //reply form handler
              var body = form.find('.nw-msg-bod').val(),
                  thread_id = form.find('.msg-container').attr('data-thr-id'),
                  newThreadForm = new FormData(this);
                  newThreadForm.append('thread_id', thread_id);

                  form.find('.msg-container').append(''+
                     '<div class="msg-dv-th self-msg">'+
                          '<span class="thr-msg-lft">'+
                              '<a href='+ form.find('.thr-idtf').attr('data-cur-username') +' class="a-msg-sdr">'+
                                  '<img src='+ form.find('.thr-idtf').attr('data-cur-pic')  +' style="width:40px; height: 40px;" />'+
                              '</a>'+
                          '</span>'+
                          '<span class="thr-msg-rght">'+
                              '<span class="sp-msg-sdr">'+
                                  '<a href='+ form.find('.thr-idtf').attr('data-cur-username')  +' class="a-msg-sdr">'+form.find('.thr-idtf').attr('data-cur-first') +' '+ form.find('.thr-idtf').attr('data-cur-last') +'</a>'+
                                  '<span href="#" class="msg-tp-rght">'+
                                      '<span href="#" class="msg-date">instant</span>'+
                                      '<a href="#" class="msg-config"><i class="fa fa-cog" aria-hidden="true"></i></a>'+
                                  '</span>'+
                              '</span>'+
                              '<span class="sp-msg-bdy ">'+ form.find('.nw-msg-bod').val() +'</span>'+
                              '<span class="sp-msg-img"></span>'+
                              '<span class="sp-msg-doc"></span>'+
                          '</span>'+
                      '</div>'+
                      '');

              $.ajax({
				url: 'http://127.0.0.1/opinion/web/app_dev.php/messages/create?id=create',
				type: 'POST',
				data: newThreadForm,
				async: true,
				contentType:false,
				processData: false,
	            beforeSend: function(){
                      //manage scrolling massage container
                     var height = 0;
                     $('.ibx-pg-nw-bd .msg-dv-th').each(function(i, value){
                         //add all height value for each message div
                         height +=parseInt($(this).height());
                     });
                     height +='';
                     $('.ibx-pg-nw-bd').animate({scrollTop : height});
                      //if not image to upload
                      $('.qq-thumbnail-selector').each(function(index, element){
                          	if( typeof $(element).attr('src') === 'undefined'){
                              //append data without the loading gif
                          	}else{
							   if(!form.find('.loading-note').length){
									form.find('.sp-msg-img').last().append('<span class="loading-note img-up"></span>');
								}
                          	}
                      });
					// when the form is submitted we reset the textarea field
				    threadUploader.reset();		//reset uploader
					form.find('#thread_message_subject').val('');
                    form.find('#thread_message_body').val('');
                 },
                success: function(data){
                     if(data.response.status === true){
						// form.find('.nw-thr-recip-b').css("display", "none");		//remove recipients
                       form.find('#thread_message__token').val(data.response.token);
					   if(data.response.images.length){
							form.find('.sp-msg-img').last().html('');
							data.response.images.forEach(function(element, index){
							form.find('.sp-msg-img').last().append(''+
										   '<a href='+element.id+' class="lk-msg-img" id='+index+'>'+
											   '<img src='+element.webPath+' class="img-msg-vw"/>'+
										   '</a>'+
								   '');
						    });
					   	}
						//manage scrolling massage container
					   var height = 0;
					   $('.ibx-pg-nw-bd .msg-dv-th').each(function(i, value){
							height +=parseInt($(this).height());  //add all height value for each message div
					   });
					   height +='';
					   $('.ibx-pg-nw-bd').animate({scrollTop : height});
                    }
              	}
          	});
          }else{
              alert('error');
          }
      }
      return false;
  });
