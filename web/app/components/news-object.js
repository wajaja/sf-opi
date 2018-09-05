function NewsObject() {
    var win             = window,
        doc             = document,
        $               = win.jQuery,
        winW            = win.innerWidth,
        winH            = win.innerHeight,
        newsContainer   = $('div#_nws_dv_b'),
        notifs_ids_arr  = [],
        posts_ids_arr  = [];

    function composeView(post, headHtml, bodyHtml, footHtml, callback) {
        var view = '<div class ="pst-c new-pst" >'+
                        '<div class="pst-edt-out"></div>'+
                        '<div class ="pst-d" >'+
                            '<div class ="pst-e">'+
                                '<div class="pst-gap-ctnr">'+
                                    '<div class="pst-edt-out">'+
                                    '</div>'+
                                '</div>'+
                                '<div class ="pst-f" >'+
                                    '<div class ="pst-g" id="_pst_g" data-pst-id='+post.id+' data-auth-id='+post.author.id+'>'+
                                        '<div class ="pst-h" >'+
                                           '<div class ="pst-i" >'+
                                               '<div class ="pst-j" id="_pst_j" data-pst-id='+post.id+'>'+
                                                   '<div class ="pst-ctnr" >'+
                                                      '<div class ="" >'+
                                                        headHtml +
                                                      '</div>'+
                                                      '<div class ="" >'+
                                                        bodyHtml +
                                                      '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        footHtml +
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                   '</div>';
        callback(view);
    }

    // function editorsView(editors, callback) {
    //     var editorsHtml  = '<div class="div-edtrs-ctnr">';
    //         editors.forEach(function(editor) {
    //             editorsHtml += '<div class ="pst-dv-pic" data-aut-id='+ editor.id +'>'+
    //                                '<a href='+editor.username+' class="pst-aut-pic-lk" >'+
    //                                    '<img src='+editor.profilPic+' id="user-profile" class ="pst-aut-pic"  />'+
    //                                '</a>'+
    //                            '</div>';
    //         });
    //         editorsHtml += '</div>';

    //     callback(editorsHtml);
    // }
    
    // function postHeadView(post, callback) {
    //     var time  = 0,
    //         month = post.createdAt.date.month,
    //         day = post.createdAt.date.day,
    //         hour = post.createdAt.time.hour,
    //         minute = post.createdAt.time.minute;

    //     if(month){
    //         time = month > 12 ? 'years ago' : month + 'month' ;
    //     } else if(day) {
    //         time = day > 1 ? day + 'days' : day + 'day' ;
    //     } else if(hour) {
    //         time = hour > 1 ? hour + 'hours' : hour + 'hour' ;
    //     } else if(minute) {
    //         time = minute > 1 ? minute + 'minutes' : minute + 'minute' ;
    //     } else {
    //         time = 'now';
    //     }
        
    //     if(post.editors.length > 0) {
    //         editorsView(post.editors, function(editorsHtml) {
    //             var view = '<div class ="pst-ctnr-tp multi-pst">'+
    //                             '<div class ="lft-pst-ctnr-tp" data-aut-arr="">'+
                                                               
    //                             '</div>'+                                                  
    //                             '<div class="rght-pst-ctnr-tp">'+
    //                                 editorsHtml +
    //                             '</div>'+
    //                            '<div class ="rght-pst-ctnr-tp-abs">'+
    //                               '<div class ="rght-pst-ctnr-tp-abs-a">'+
    //                                 '<div class ="pst-dv-dte" data-dte-cmp="">'+                                                            
    //                                   '<span class="pst-dte">'+post.createdAt.time.minute+'</span>'+
    //                                 '</div>'+
    //                                 '<div class ="pst-opt" data-pst-id='+ post.id +'>'+
    //                                   '<a href="" class="pst-opt-lk" data-pst-id='+ post.id +' data-auth-id='+ post.author.id +'><i class="fa fa-chevron-down" aria-hidden="true"></i></a>'+
    //                                 '</div>'+
    //                               '</div>'+
    //                            '</div>'+
    //                         '</div>';
    //           callback(view);
    //         })                               
    //     } else {
    //         var view = '<div class ="pst-ctnr-tp" >'+
    //                        '<div class ="lft-pst-ctnr-tp" data-aut-arr="">'+
    //                            '<div class ="pst-dv-pic" data-aut-id="{{post.author.id}}">'+
    //                                '<a href='+post.author.username+' class="pst-aut-pic-lk" >'+
    //                                    '<img src='+post.author.profilPic+' id="user-profile" class ="pst-aut-pic"  />'+
    //                                '</a>'+
    //                            '</div>'+                             
    //                        '</div>'+                                                    
    //                        '<div class="rght-pst-ctnr-tp">'+
    //                            '<div class="rght-pst-dv-aut" data-usr-id='+post.author.id+'>'+
    //                                '<a class ="pst-aut-nm" href='+post.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
    //                                '<a href="" class="pst-aut-pub">'+post.author.username+'</a>'+
    //                            '</div>'+
    //                        '</div>'+
    //                        '<div class ="rght-pst-ctnr-tp-abs">'+
    //                           '<div class ="rght-pst-ctnr-tp-abs-a">'+
    //                             '<div class ="pst-dv-dte" data-dte-cmp="">'+                                                            
    //                                '<span class="pst-dte">'+post.createdAt.time.minute+'</span>'+
    //                             '</div>'+
    //                             '<div class ="pst-opt" data-pst-id='+ post.id +'>'+
    //                                '<a href="" class="pst-opt-lk" data-pst-id='+ post.id +' data-auth-id='+ post.author.id +'><i class="fa fa-chevron-down" aria-hidden="true"></i></a>'+
    //                             '</div>'+
    //                           '</div>'+
    //                        '</div>'+
    //                    '</div>';
    //        callback(view);
    //     }
        
    // }

    // function postBodyView(post, callback) {
    //     var view = '<div class="pst-ctnr-mdl"><div class="rght-pst-ctnr-mdl" >'; 
    //     if(post.gaps > 1) {

    //     }else{
    //       if(post.editors.length ) {
    //         if(post.images) {
    //             imagesView(post, post.images, function(imagesHTML) {
    //                 view += '<div class ="multi-pst-ctnr-mdl-a">'+
    //                                '<div class ="multi-dv-txt-ctn">'+
    //                                     '<div class="multi-pst-dv-auth" data-usr-id='+post.author.id+'>'+
    //                                        '<a class ="pst-auth-nm-lk" href='+post.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
    //                                    '</div>'+
    //                                    '<div class ="multi-pst postContent" >'+ post.content +'</div>'+
    //                                '</div>'+
    //                                '<div class ="multi-pst-dv-img-ctn">'+
    //                                    '<div class ="multi-pst-dv-img-ctn-a">'+
    //                                        '<div class ="multi-pst-dv-img-ctn-b">'+
    //                                            '<div class ="multi-pst-dv-img">'+
    //                                                imagesHTML +
    //                                            '</div>'+
    //                                        '</div>'+
    //                                    '</div>'+
    //                                '</div>'+
    //                            '</div>';
    //             })
    //         } else {
    //             view += '<div class ="multi-pst-ctnr-mdl-a">'+
    //                        '<div class ="multi-dv-txt-ctn">'+
    //                             '<div class="multi-pst-dv-auth" data-usr-id='+post.author.id+'>'+
    //                                '<a class ="pst-auth-nm-lk" href='+post.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
    //                            '</div>'+
    //                            '<div class ="multi-pst postContent" >'+ post.content +'</div>'+
    //                        '</div>'+
    //                    '</div>';
    //         }

    //         post.allies.forEach(function(allie) {
    //             if(allie.images){
    //                 imagesView(post, allie.images, function(imagesHTML) {             
    //                     view += '<div class ="multi-pst-ctnr-mdl-a">'+
    //                                '<div class ="multi-dv-txt-ctn">'+
    //                                     '<div class="multi-pst-dv-auth" data-usr-id='+allie.author.id+'>'+
    //                                        '<a class ="pst-auth-nm-lk" href='+allie.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
    //                                    '</div>'+
    //                                    '<div class ="multi-pst postContent" >'+ allie.content +'</div>'+
    //                                '</div>'+
    //                                '<div class ="multi-pst-dv-img-ctn">'+
    //                                    '<div class ="multi-pst-dv-img-ctn-a">'+
    //                                        '<div class ="multi-pst-dv-img-ctn-b">'+
    //                                            '<div class ="multi-pst-dv-img">'+
    //                                                imagesHTML +
    //                                            '</div>'+
    //                                        '</div>'+
    //                                    '</div>'+
    //                                '</div>'+
    //                            '</div>';
    //                 });                                  
    //             } else {             
    //                 view += '<div class ="multi-pst-ctnr-mdl-a">'+
    //                            '<div class ="multi-dv-txt-ctn">'+
    //                                 '<div class="multi-pst-dv-auth" data-usr-id='+allie.author.id+'>'+
    //                                    '<a class ="pst-auth-nm-lk" href='+ allie.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
    //                                '</div>'+
    //                                '<div class ="multi-pst postContent" >'+ allie.content +'</div>'+
    //                            '</div>'+
    //                        '</div>';
    //             }                
    //         })



    //     view  += '</div></div>';
    //     callback(view);
    //     } else {
    //         if(post.images) {
    //             imagesView(post, post.images, function(imagesHTML) {
    //                 view += '<div class ="rght-pst-ctnr-mdl-a">'+
    //                             '<div class ="pst-dv-txt-ctn">'+
    //                                '<div id="postContent" class ="postContent" >'+ post.content +'</div>'+
    //                            '</div>'+
    //                            '<div class ="pst-dv-img-ctn">'+
    //                                '<div class ="pst-dv-img-ctn-a">'+
    //                                    '<div class ="pst-dv-img-ctn-b">'+
    //                                        '<div class ="pst-dv-img">'+
    //                                            imagesHTML +
    //                                        '</div>'+
    //                                    '</div>'+
    //                                '</div>'+
    //                            '</div>'+
    //                        '</div>';
    //             })
    //         } else {
    //             view += '<div class ="rght-pst-ctnr-mdl-a">'+
    //                             '<div class ="pst-dv-txt-ctn">'+
    //                                '<div id="postContent" class ="postContent" >'+ post.content +'</div>'+
    //                            '</div>'+
    //                        '</div>';
    //         }
    //     }       
    //   }
    //   view  += '</div></div>';
    //   callback(view);        
    // }


    // function postFootView(post, data, callback) {
    //     var view = '<div class="fooPost" >'+
    //                    '<div class ="fooPost-a">'+
    //                        '<div class ="fooPost-b" >'+
    //                            '<div class ="fooPost-c" >'+
    //                                '<div id="postQuestionDiv" class ="postQuestionDiv" data-pst-id='+ post.id +'>'+
    //                                    '<a href="" class="postQuestion-icon-form" data-form-question="" data-pst-id='+ post.id +'>'+
    //                                        '<span class="glyphicon glyphicon-question-sign"></span>'+
    //                                    '</a>'+
    //                                    '<span class="pst-qst-noti" data-qst-id=""></span>'+
    //                                    '<span class="pst-qst-nb" data-qst-nb=""></span>'+
    //                                '</div>'+
    //                                '<div id="postShareDiv" class ="postShareDiv" data-pst-id='+ post.id +'>'+
    //                                    '<a href="" class="postShare-icon-form" data-pst-id='+ post.id +' id="postShare-icon-form" >'+
    //                                        '<i class="fa fa-share-alt"></i>'+
    //                                    '</a>'+
    //                                    '<span class="pst-shr-nb"></span>'+
    //                                '</div>'+
    //                                '<div id="comment" class ="pCommentDiv" >'+
    //                                    '<a href="" class ="linkPcomment" ><i class="fa fa-comment"></i></a>'+
    //                                    '<span class="pst-cmts-nb"></span>'+
    //                                '</div>'+
    //                                '<div id="_plke_dv" class="plikeDiv" data-pst-id='+ post.id +'>'+
    //                                    '<span class="sp-like-icn-ctnr">'+
    //                                        '<a class ="linkPlike" rel="linkPlike" href="" >'+
    //                                            '<i class="fa fa-thumbs-o-up like-sty"></i>'+
    //                                        '</a>'+
    //                                    '</span>'+
    //                                    '<span class="hide-rat pst-like-rat-ctnr"></span>'+
    //                                    '<span class="sp-like-mr-i">'+
    //                                        '<a href="" class="lk-graph-plike" data-rat="" data-ttl-rat="" data-pst-id='+ post.id +'></a>'+
    //                                        '<span name="nbPlikes" class="nbPlikes" data-lkr-nb=""></span>'+
    //                                    '</span>'+
    //                                '</div>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>'+
    //                    '<div class ="postDetail">'+
    //                        '<div class ="" style="width: auto; overflow: visible; background-color: #f6f7f8 ">'+
    //                            '<div class ="" style="display: block">'+
    //                                '<span></span><a href=""></a>'+
    //                                '<span></span>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>'+
    //                    '<div class="pst-cmt-ctnr">'+
    //                        '<div class="pst-cmt-ctnr-a">'+
    //                            '<div class="containerComments" >'+
    //                                '<div class ="gComment" >'+
    //                                     data.response.commentsView +
    //                                '</div>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>'+
    //                    '<div class ="pst-cmt-frm">'+
    //                        '<div class ="pst-cmt-frm-a">'+
    //                            '<div class ="pst-cmt-frm-b">'+
    //                                '<div class ="pst-cmt-frm-ctnr" id="" data-pst-id='+ post.id +' data-pst-val='+ post.id +'>'+
    //                                   data.response.commentFormView +
    //                                '</div>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>'+
    //                '</div>';
    //     callback(view);
    // }

    // function opinionHeadView(post, callback) {
    //     var view = '<div class="pst-ctnr-tp multi-pst">';
    //     if(post.leftEditors.length || post.rightEditors.length) {

    //         view += '<div class ="lft-pst-ctnr-tp" data-aut-arr="">';
    //           if(post.leftEditors) {
    //               editorsView(post.leftEditors, function(editorsHtml) {
    //                   view += editorsHtml;
    //               });
    //           }            
    //           view += '<div class ="pst-dv-pic" data-aut-id='+post.author.id+'>'+
    //                      '<a href='+post.author.username+' class="pst-aut-pic-lk" >'+
    //                          '<img src='+post.author.profilPic+' id="user-profile" class ="pst-aut-pic"  />'+
    //                      '</a>'+
    //                  '</div>';
    //         view += '</div>';

    //         view += '<div class="rght-pst-ctnr-tp">';
    //           if(post.rightEditors) {
    //               editorsView(post.rightEditors, function(editorsHtml) {
    //                   view += editorsHtml;
    //               });
    //           }
    //         view += '</div>';
    //         view += '<div class ="rght-pst-ctnr-tp-abs">'+
    //                   '<div class ="rght-pst-ctnr-tp-abs-a">'+
    //                     '<div class="op-opt-info">'+
    //                         '<div class="order">'+ post.order +'</div>'+
    //                         '<div class="opi-logo">logo</div>'+
    //                     '</div>'+
    //                     '<div class ="pst-dv-dte" data-dte-cmp="">'+                                                            
    //                        '<span class="pst-dte">'+post.createdAt.time.minute+'</span>'+
    //                     '</div>'+                        
    //                     '<div class ="pst-opt" data-pst-id='+ post.id +'>'+
    //                        '<a href="" class="pst-opt-lk" data-pst-id='+ post.id +' data-auth-id='+ post.author.id +'><i class="fa fa-chevron-down" aria-hidden="true"></i></a>'+
    //                     '</div>'+
    //                   '</div>'+
    //                 '</div>';
    //         view += '</div>';
    //     view += '</div>';
    //     callback(view);                                     
    //     } else {
    //         var view = '<div class ="pst-ctnr-tp" >'+
    //                         '<div class ="lft-pst-ctnr-tp" data-aut-arr="">'+
    //                             '<div class ="pst-dv-pic" data-aut-id="{{post.author.id}}">'+
    //                                 '<a href='+post.author.username+' class="pst-aut-pic-lk" >'+
    //                                    '<img src='+post.author.profilPic+' id="user-profile" class ="pst-aut-pic"  />'+
    //                                 '</a>'+
    //                             '</div>'+                             
    //                         '</div>'+                                                    
    //                         '<div class="rght-pst-ctnr-tp">'+
    //                             '<div class="rght-pst-dv-aut" data-usr-id='+post.author.id+'>'+
    //                                 '<a class ="pst-aut-nm" href='+post.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
    //                                 '<a href="" class="pst-aut-pub">'+post.author.username+'</a>'+
    //                             '</div>'+
    //                         '</div>'+
    //                         '<div class ="rght-pst-ctnr-tp-abs">'+
    //                           '<div class ="rght-pst-ctnr-tp-abs-a">'+
    //                             '<div class="op-opt-info">'+
    //                                 '<div class="order">'+ post.order +'</div>'
    //                                 '<div class="opi-logo">logo</div>'+
    //                             '</div>'+
    //                             '<div class ="pst-dv-dte" data-dte-cmp="">'+                                                            
    //                                 '<span class="pst-dte">'+post.createdAt.time.minute+'</span>'+
    //                             '</div>'+
    //                             '<div class ="pst-opt" data-pst-id='+ post.id +'>'+
    //                                 '<a href="" class="pst-opt-lk" data-pst-id='+ post.id +' data-auth-id='+ post.author.id +'><i class="fa fa-chevron-down" aria-hidden="true"></i></a>'+
    //                             '</div>'+
    //                           '</div>'+
    //                         '</div>'+
    //                    '</div>';
    //       callback(view);
    //     }
        
    // }
    // function opinionBodyView(post, callback) {
    //     var view = '';
    //     if(post.images) {
    //         imagesView(post, post.images, function(imagesHTML) {
    //             view += '<div class ="rght-pst-ctnr-mdl-a">'+
    //                         '<div class ="pst-dv-txt-ctn">'+
    //                            '<div id="postContent" class ="postContent" >'+ post.content +'</div>'+
    //                        '</div>'+
    //                        '<div class ="pst-dv-img-ctn">'+
    //                            '<div class ="pst-dv-img-ctn-a">'+
    //                                '<div class ="pst-dv-img-ctn-b">'+
    //                                    '<div class ="pst-dv-img">'+
    //                                        imagesHTML +
    //                                    '</div>'+
    //                                '</div>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>';
    //         })
    //     } else {
    //         view += '<div class ="rght-pst-ctnr-mdl-a">'+
    //                         '<div class ="pst-dv-txt-ctn">'+
    //                            '<div id="postContent" class ="postContent" >'+ post.content +'</div>'+
    //                        '</div>'+
    //                    '</div>';
    //     }
    //     callback(view);
    // }
    // function opinionFootView(post, data, callback) {
    //     var view = '<div class="fooPost" >'+
    //                    '<div class ="fooPost-a">'+
    //                        '<div class ="fooPost-b" >'+
    //                            '<div class ="fooPost-c" >'+
    //                                '<div id="postQuestionDiv" class ="postQuestionDiv" data-pst-id='+ post.id +'>'+
    //                                    '<a href="" class="post-lft-icon-form" data-form-question="" data-pst-id='+ post.id +'>'+
    //                                        '<span class="glyphicon glyphicon-question-sign"></span>'+
    //                                    '</a>'+
    //                                    '<a href="" class="post-rght-icon-form" data-form-question="" data-pst-id='+ post.id +'>'+
    //                                        '<span class="glyphicon glyphicon-question-sign"></span>'+
    //                                    '</a>'+
    //                                    '<span class="pst-qst-noti" data-qst-id=""></span>'+
    //                                    '<span class="pst-qst-nb" data-qst-nb=""></span>'+
    //                                '</div>'+
    //                                '<div id="postShareDiv" class ="postShareDiv" data-pst-id='+ post.id +'>'+
    //                                    '<a href="" class="postShare-icon-form" data-pst-id='+ post.id +' id="postShare-icon-form" >'+
    //                                        '<i class="fa fa-share-alt"></i>'+
    //                                    '</a>'+
    //                                    '<span class="pst-shr-nb"></span>'+
    //                                '</div>'+
    //                                '<div id="comment" class ="pCommentDiv" >'+
    //                                    '<a href="" class ="linkPcomment" ><i class="fa fa-comment"></i></a>'+
    //                                    '<span class="pst-cmts-nb"></span>'+
    //                                '</div>'+
    //                                '<div id="_plke_dv" class="plikeDiv" data-pst-id='+ post.id +'>'+
    //                                    '<span class="sp-like-icn-ctnr">'+
    //                                        '<a class ="linkPlike" rel="linkPlike" href="" >'+
    //                                            '<i class="fa fa-thumbs-o-up like-sty"></i>'+
    //                                        '</a>'+
    //                                    '</span>'+
    //                                    '<span class="hide-rat pst-like-rat-ctnr"></span>'+
    //                                    '<span class="sp-like-mr-i">'+
    //                                        '<a href="" class="lk-graph-plike" data-rat="" data-ttl-rat="" data-pst-id='+ post.id +'></a>'+
    //                                        '<span name="nbPlikes" class="nbPlikes" data-lkr-nb=""></span>'+
    //                                    '</span>'+
    //                                '</div>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>'+
    //                    '<div class ="postDetail">'+
    //                        '<div class ="" style="width: auto; overflow: visible; background-color: #f6f7f8 ">'+
    //                            '<div class ="" style="display: block">'+
    //                                '<span></span><a href=""></a>'+
    //                                '<span></span>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>'+
    //                    '<div class="pst-cmt-ctnr">'+
    //                        '<div class="pst-cmt-ctnr-a">'+
    //                            '<div class="containerComments" >'+
    //                                '<div class ="gComment" >'+
    //                                     data.response.commentsView +
    //                                '</div>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>'+
    //                    '<div class ="pst-cmt-frm">'+
    //                        '<div class ="pst-cmt-frm-a">'+
    //                            '<div class ="pst-cmt-frm-b">'+
    //                                '<div class ="pst-cmt-frm-ctnr" id="" data-pst-id='+ post.id +' data-pst-val='+ post.id +'>'+
    //                                   data.response.commentFormView +
    //                                '</div>'+
    //                            '</div>'+
    //                        '</div>'+
    //                    '</div>'+
    //                '</div>';
    //     callback(view);
    // }

    // function galleryHeadView(post, callback) {
    //     var view = '<div class ="pst-ctnr-tp" >'+
    //                    '<div class ="lft-pst-ctnr-tp" data-aut-arr="">'+
    //                        '<div class ="pst-dv-pic" data-aut-id="{{post.author.id}}">'+
    //                            '<a href='+ post.author.username +' class="pst-aut-pic-lk" >'+
    //                                '<img src='+ post.author.profilPic +' id="user-profile" class ="pst-aut-pic"  />'+
    //                            '</a>'+
    //                        '</div>'+                             
    //                    '</div>'+                                                    
    //                    '<div class="rght-pst-ctnr-tp">'+
    //                        '<div class="rght-pst-dv-aut" data-usr-id='+post.author.id+'>'+
    //                            '<a class ="pst-aut-nm" href='+post.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
    //                            '<a href="" class="pst-aut-pub">'+post.author.username+'</a>'+
    //                        '</div>'+
    //                    '</div>'+
    //                    '<div class ="rght-pst-ctnr-tp-abs">'+
    //                       '<div class ="rght-pst-ctnr-tp-abs-a">'+
    //                         '<div class ="pst-dv-dte" data-dte-cmp="">'+                                                            
    //                            '<span class="pst-dte">'+post.createdAt.time.minute+'</span>'+
    //                         '</div>'+
    //                         '<div class ="pst-opt" data-pst-id='+ post.id +'>'+
    //                            '<a href="" class="pst-opt-lk" data-pst-id='+ post.id +' data-auth-id='+ post.author.id +'><i class="fa fa-chevron-down" aria-hidden="true"></i></a>'+
    //                         '</div>'+
    //                       '</div>'+
    //                    '</div>'+
    //                '</div>';
    //     callback(view);
    // }
    // function galleryBodyView(post, callback) {
    //     var images      = post.images,
    //         image_HTML  = '';
    //     if (images.length === 1) {
    //        image_HTML += '<div class ="pst-dv-one-img" data-pst-id='+ post.id +' data-imgs-id="">';
    //            images.forEach(function(image, index){
    //                image_HTML +=   '<a href="" class="pst-img-lk" data-img-id='+image.id+' id=>'+
    //                                    '<img src='+ image.webPath +' class="pst-jst-oe-img" data-img-id='+ image.id +'/>'+
    //                                '</a>';
    //                });
    //        image_HTML += '</div>';

    //     } else if(images.length === 2) {
    //        image_HTML += '<div class ="pst-dv-two-img" data-pst-id='+ post.id +' data-imgs-id="">';
    //            images.forEach(function(image, index){
    //                image_HTML +=    '<a href="" class="pst-img-lk" data-img-id='+image.id+' >'+
    //                                    '<img src='+ image.webPath +' class="pst-jst-to-img" data-img-id='+image.id+'/>'+
    //                                '</a>';                                                                               
    //            });
    //        image_HTML += '</div>';

    //     } else if (images.length == 3) {
    //        image_HTML += '<div class ="pst-dv-pls-img" data-pst-id='+ post.id +' data-imgs-id="">';
    //            images.forEach(function(image, index) {
    //                if (index === 0){
    //                    image_HTML +=   '<a href="" class="pst-img-lk first" data-img-id='+ image.id +' >'+
    //                                        '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                    '</a>';
    //                } else if (index === 1) {
    //                    image_HTML += '<div class="pst-dv-pls-img-lft">'+
    //                                    '<a href="" class="pst-img-lk scond" data-img-id='+ image.id +' >'+
    //                                        '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                    '</a>';
    //                } else if (index === 2) {
    //                    image_HTML +=  '<div class ="pst-dv-thir-img" data-pst-id='+ post.id +'>'+
    //                                        '<a href="" class="pst-img-lk thir" data-img-id='+ image.id +'>'+
    //                                            '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                        '</a>'+
    //                                        '<a href="" class="see-mr-pst-img '+ (nb_img ? '' : 'none-see-mr-img')+'" data-pst-id='+ post.id +'>'+
    //                                            '<i class="fa fa-plus" aria-hidden="true"></i>'+
    //                                            '<span class="nb-img-txt">'+ nb_img +'</span>'+
    //                                        '</a>'+
    //                                    '</div>';     
    //                }                    
    //            });
    //        image_HTML += '</div>';

    //     }else if (images.length > 3) {
    //        nb_img = images.length - 4;
    //        image_HTML += '<div class ="pst-dv-pls-img gal-imgs" data-pst-id='+ post.id +' data-imgs-id="">';
    //            images.forEach(function(image, index) {
    //                if (index === 0){
    //                    image_HTML +=   '<a href="" class="pst-img-lk gal-mor" data-img-id='+ image.id +' >'+
    //                                        '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                    '</a>';
    //                } else if (index === 1) {
    //                    image_HTML +=   '<a href="" class="pst-img-lk gal-mor" data-img-id='+ image.id +' >'+
    //                                        '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                    '</a>';
    //                } else if (index === 2) {
    //                    image_HTML +=   '<a href="" class="pst-img-lk gal-mor" data-img-id='+ image.id +' >'+
    //                                        '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                    '</a>';
    //                } else if (index === 3) {
    //                    image_HTML +=    '<a href="" class="pst-img-lk gal-mor" data-img-id='+ image.id +'>'+
    //                                         '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                     '</a>'+
    //                                     '<div class="see-mr-pst-img-dv">'+
    //                                         '<a href="" class="see-mr-pst-img '+ (nb_img ? '' : 'none-see-mr-img')+'" data-pst-id='+ post.id +'>'+
    //                                            '<i class="fa fa-plus" aria-hidden="true"></i>'+
    //                                            '<span class="nb-img-txt">'+ nb_img +'</span>'+
    //                                        '</a>'+
    //                                    '</div>';     
    //                }                    
    //            });
    //        image_HTML += '</div>';
    //     }else{
    //         image_HTML += 'no image'; 
    //     }
    //     callback(image_HTML);
    // }
    function commentedPostHeadView(post, comment, callback) {
        var view =  '<div class ="comted-div-a">'+
                        '<div class ="com-div-left" data-auth-id='+ comment.author.id +'>'+
                            '<a class ="com-profile-link-img">'+
                                '<img class="com-profile-img" src='+ comment.author.profilePic.cropPath +' />'+
                            '</a>'+
                        '</div>'+
                        '<div class ="com-div-right-a" data-cmt-id='+ comment.id +'>'+
                            '<div class ="com-head-name">'+
                                '<span class="com-sp-nm-ct">'+
                                    '<a href='+ comment.author.username +' class ="com-link-name usr-name-lk">'+
                                        '<span>'+ comment.author.name +'<span>'+
                                    '</a>'+
                                '</span>'+                        
                                '<span class ="contentComment" style="">'+
                                    '<span>'+ comment.content +'</span><br/>'+
                               '</span>'+
                            '</div>'+
                            '<div class ="com-img-container" >'+
                                '<àa href="" data-cmt-id='+ comment.id +' class="lk-cmt-img see-img-lk" >See Image</a>'+
                            '</div>'+
                        '</div>'+
                        '<div class ="comted-head-btm">'+
                            '<div data-cmt-id='+ comment.id +'>'+
                                '<span class="com-dv-dte"></span>'+
                                '<span class="op-dte" ></span>'+
                                '<span class ="com-head-time" >comment on :</span>'+   
                            '</div>'+
                        '</div>'+
                    '</div>';
        callback(view);
    }
    function commentedPostBodyView(post, callback) {
        var view = '<div class="comted-pst-ctnr"><div class="comted-pst-ctnr-a" >'; 
            view += '<div class ="multi-pst-ctnr-mdl-a">'+
                       '<div class ="multi-dv-txt-ctn">'+
                            '<div class="multi-pst-dv-auth" data-usr-id='+post.author.id+'>'+
                               '<a class ="pst-auth-nm-lk" href='+post.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
                           '</div>'+
                           '<div class ="multi-pst postContent" >'+ post.content +'</div>'+
                       '</div>'+
                   '</div>';         
        if(post.editors ) {            
            post.allies.forEach(function(allie) {            
                view += '<div class ="multi-pst-ctnr-mdl-a">'+
                           '<div class ="multi-dv-txt-ctn">'+
                                '<div class="multi-pst-dv-auth" data-usr-id='+allie.author.id+'>'+
                                   '<a class ="pst-auth-nm-lk" href='+ allie.author.username+' data-userurl='+post.author.username+'>'+ post.author.name +'</a>'+
                               '</div>'+
                               '<div class ="multi-pst postContent" >'+ allie.content +'</div>'+
                           '</div>'+
                       '</div>';               
            })
        }
        view  += '</div></div>';
        callback(view)
    }
    function commentedPostFootView(post, data, callback) {
        var view = '';
        view += '<div class ="fooPost-b" >'+
                   '<div class ="fooPost-c" >'+
                       '<div id="postQuestionDiv" class ="postQuestionDiv" data-pst-id='+ post.id +'>'+
                           '<a href="" class="postQuestion-icon-form" data-form-question="" data-pst-id='+ post.id +'>'+
                               'See in Detail'+
                           '</a>'+
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
               '</div>';
        callback(view);
    }

     function commentedOpinionHeadView(post, callback) {
         var view =  '<div class ="comted-div-a">'+
                        '<div class ="com-div-left" data-auth-id='+ comment.author.id +'>'+
                            '<a class ="com-profile-link-img">'+
                                '<img class="com-profile-img" src='+ comment.author.profilePic.cropPath +' />'+
                            '</a>'+
                        '</div>'+
                        '<div class ="com-div-right-a" data-cmt-id='+ comment.id +'>'+
                            '<div class ="com-head-name">'+
                                '<span class="com-sp-nm-ct">'+
                                    '<a href='+ comment.author.username +' class ="com-link-name usr-name-lk">'+
                                        '<span>'+ comment.author.name +'<span>'+
                                    '</a>'+
                                '</span>'+                        
                                '<span class ="contentComment" style="">'+
                                    '<span>'+ comment.content +'</span><br/>'+
                               '</span>'+
                            '</div>'+
                            '<div class ="com-img-container" >'+
                                '<a href="" data-cmt-id='+ comment.id +' class="lk-cmt-img see-img-lk" >See Image</a>'+
                            '</div>'+
                        '</div>'+
                        '<div class ="comted-head-btm">'+
                            '<div data-cmt-id='+ comment.id +'>'+
                                '<span class="com-dv-dte"></span>'+
                                '<span class="op-dte" ></span>'+
                                '<span class ="com-head-time" >comment on :</span>'+   
                            '</div>'+
                        '</div>'+
                    '</div>';
        callback(view);
    }
    function commentedOpinionBodyView(post, comment,  callback) {
        var view = '<div class="comted-pst-ctnr"><div class="comted-pst-ctnr-a" >';

        view += '<div class ="op-comted-side-ctnr">'+
                   '<div class ="multi-dv-txt-ctn">'+
                        '<div class="op-comted-side-rght-dv" data-usr-id='+comment.author.id+'>'+
                           '<a class ="pst-auth-nm-lk" href='+ comment.author.username+' data-userurl='+comment.author.username+'>'+
                                '<img src='+ comment.author.profilePic.cropPath +' class="comted-profpic-img"/>'+
                           '</a>'+
                       '</div>'+
                        '<div class="op-comted-side-lft-dv" data-usr-id='+comment.author.id+'>'+
                           '<a class ="pst-auth-nm-lk" href='+ comment.author.username+' data-userurl='+comment.author.username+'>'+ comment.author.name +'</a>'+
                            '<div class ="multi-pst postContent" >'+ comment.content +'</div>'+
                        '</div>'+
                   '</div>'+
               '</div>';

        view += '<div class ="op-comted-pst-ctnr">'+
                   '<div class ="multi-dv-txt-ctn">'+
                        '<div class="op-comted-side-rght-dv" data-usr-id='+ post.author.id+'>'+
                           '<a class ="pst-auth-nm-lk" href='+ post.author.username+' data-userurl='+ post.author.username+'>'+
                                '<img src='+ post.author.profilePic.cropPath +' class="comted-profpic-img"/>'+
                           '</a>'+
                       '</div>'+
                        '<div class="op-comted-side-lft-dv" data-usr-id='+ post.author.id+'>'+
                           '<a class ="pst-auth-nm-lk" href='+ post.author.username+' data-userurl='+ post.author.username+'>'+ post.author.name +'</a>'+
                            '<div class ="multi-pst postContent" >'+ post.content +'</div>'+
                        '</div>'+
                   '</div>'+
               '</div>';
        view  += '</div></div>';
        callback(view)
    }
    function commentedOpinionFootView(post, data, callback) {
        var view = '';
        view += '<div class ="fooPost-b" >'+
                   '<div class ="fooPost-c" >'+
                       '<div id="postQuestionDiv" class ="postQuestionDiv" data-pst-id='+ post.id +'>'+
                           '<a href="" class="postQuestion-icon-form" data-form-question="" data-pst-id='+ post.id +'>'+
                               'See in Detail'+
                           '</a>'+
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
               '</div>';
        callback(view);
    }

    function ratedHeadView(post, rate, callback) {
        var view =  '<div class ="comted-div-a">'+
                        '<div class ="com-div-left" data-auth-id='+ rate.author.id +'>'+
                            '<a class ="com-profile-link-img">'+
                                '<img class="com-profile-img" src='+ rate.author.profilePic.cropPath +' />'+
                            '</a>'+
                        '</div>'+
                        '<div class ="com-div-right-a" data-cmt-id='+ rate.id +'>'+
                            '<div class ="com-head-name">'+
                                '<span class="com-sp-nm-ct">'+
                                    '<a href='+ rate.author.username +' class ="com-link-name usr-name-lk">'+
                                        '<span>'+ rate.author.name +'<span>'+
                                    '</a>'+
                                '</span>'+                        
                                '<span class ="contentComment" style="">'+
                                    '<span>'+ rate.rate +'</span><br/>'+
                               '</span>'+
                            '</div>'+
                        '</div>'+
                        '<div class ="comted-head-btm">'+
                            '<div data-cmt-id='+ rate.id +'>'+
                                '<span class="com-dv-dte"></span>'+
                                '<span class="op-dte" ></span>'+
                                '<span class ="com-head-time" >comment on :</span>'+   
                            '</div>'+
                        '</div>'+
                    '</div>';
        callback(view);
    }
    function ratedBodyView(post, rate, callback) {
        if(post.images) {
            imagesView(post, post.images, function(imagesHTML) {
                view += '<div class ="rght-pst-ctnr-mdl-a">'+
                            '<div class ="pst-dv-txt-ctn">'+
                               '<div id="postContent" class ="postContent" >'+ post.content +'</div>'+
                           '</div>'+
                           '<div class ="pst-dv-img-ctn">'+
                               '<div class ="pst-dv-img-ctn-a">'+
                                   '<div class ="pst-dv-img-ctn-b">'+
                                       '<div class ="pst-dv-img">'+
                                           imagesHTML +
                                       '</div>'+
                                   '</div>'+
                               '</div>'+
                           '</div>'+
                       '</div>';
            })
        } else {
            view += '<div class ="rght-pst-ctnr-mdl-a">'+
                            '<div class ="pst-dv-txt-ctn">'+
                               '<div id="postContent" class ="postContent" >'+ post.content +'</div>'+
                           '</div>'+
                       '</div>';
        }
        callback(view);
    }
    function ratedFootView(post, data, callback) {
        var view = '';
        view += '<div class ="fooPost-b" >'+
                   '<div class ="fooPost-c" >'+
                       '<div id="postQuestionDiv" class ="postQuestionDiv" data-pst-id='+ post.id +'>'+
                           '<a href="" class="postQuestion-icon-form" data-form-question="" data-pst-id='+ post.id +'>'+
                               'See in Detail'+
                           '</a>'+
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
               '</div>';
        callback(view);
    }

    function likedHeadView(post, like, callback) {
        var view =  '<div class ="comted-div-a">'+
                        '<div class ="com-div-left" data-auth-id='+ like.author.id +'>'+
                            '<a class ="com-profile-link-img">'+
                                '<img class="com-profile-img" src='+ like.author.profilePic.cropPath +' />'+
                            '</a>'+
                        '</div>'+
                        '<div class ="com-div-right-a" data-cmt-id='+ like.id +'>'+
                            '<div class ="com-head-name">'+
                                '<span class="com-sp-nm-ct">'+
                                    '<a href='+ like.author.username +' class ="com-link-name usr-name-lk">'+
                                        '<span>'+ like.author.name +'<span>'+
                                    '</a>'+
                                '</span>'+                        
                                '<span class ="contentComment" style="">'+
                                    '<span>'+ like.rate +'</span><br/>'+
                               '</span>'+
                            '</div>'+
                        '</div>'+
                        '<div class ="comted-head-btm">'+
                            '<div data-cmt-id='+ like.id +'>'+
                                '<span class="com-dv-dte"></span>'+
                                '<span class="op-dte" ></span>'+
                                '<span class ="com-head-time" >comment on :</span>'+   
                            '</div>'+
                        '</div>'+
                    '</div>';
        callback(view);
    }

    function sharedPostHeadView(post, callback) {
         var view =  '<div class ="comted-div-a">'+
                        '<div class ="com-div-left" data-auth-id='+ comment.author.id +'>'+
                            '<a class ="com-profile-link-img">'+
                                '<img class="com-profile-img" src='+ comment.author.profilePic.cropPath +' />'+
                            '</a>'+
                        '</div>'+
                        '<div class ="com-div-right-a" data-cmt-id='+ comment.id +'>'+
                            '<div class ="com-head-name">'+
                                '<span class="com-sp-nm-ct">'+
                                    '<a href='+ comment.author.username +' class ="com-link-name usr-name-lk">'+
                                        '<span>'+ comment.author.name +'<span>'+
                                    '</a>'+
                                '</span>'+                        
                                '<span class ="contentComment" style="">'+
                                    '<span>'+ comment.content +'</span><br/>'+
                               '</span>'+
                            '</div>'+
                            '<div class ="com-img-container" >'+
                                '<a href="" data-cmt-id='+ comment.id +' class="lk-cmt-img see-img-lk" >See Image</a>'+
                            '</div>'+
                        '</div>'+
                        '<div class ="comted-head-btm">'+
                            '<div data-cmt-id='+ comment.id +'>'+
                                '<span class="com-dv-dte"></span>'+
                                '<span class="op-dte" ></span>'+
                                '<span class ="com-head-time" >comment on :</span>'+   
                            '</div>'+
                        '</div>'+
                    '</div>';
        callback(view);
    }

    function sharedOpinionHeadView(post, callback) {
        var view =  '<div class ="comted-div-a">'+
                        '<div class ="com-div-left" data-auth-id='+ comment.author.id +'>'+
                            '<a class ="com-profile-link-img">'+
                                '<img class="com-profile-img" src='+ comment.author.profilePic.cropPath +' />'+
                            '</a>'+
                        '</div>'+
                        '<div class ="com-div-right-a" data-cmt-id='+ comment.id +'>'+
                            '<div class ="com-head-name">'+
                                '<span class="com-sp-nm-ct">'+
                                    '<a href='+ comment.author.username +' class ="com-link-name usr-name-lk">'+
                                        '<span>'+ comment.author.name +'<span>'+
                                    '</a>'+
                                '</span>'+                        
                                '<span class ="contentComment" style="">'+
                                    '<span>'+ comment.content +'</span><br/>'+
                               '</span>'+
                            '</div>'+
                            '<div class ="com-img-container" >'+
                                '<a href="" data-cmt-id='+ comment.id +' class="lk-cmt-img see-img-lk" >See Image</a>'+
                            '</div>'+
                        '</div>'+
                        '<div class ="comted-head-btm">'+
                            '<div data-cmt-id='+ comment.id +'>'+
                                '<span class="com-dv-dte"></span>'+
                                '<span class="op-dte" ></span>'+
                                '<span class ="com-head-time" >comment on :</span>'+   
                            '</div>'+
                        '</div>'+
                    '</div>';
        callback(view);
    }

    function followHeadView(post, callback) {
        var view = '';
        callback(view);
    }
    function followPostBodyView(post, callback) {
         var view = '';
        callback(view);
    }
    function followFootView(post, data, callback) {
         var view = '';
        callback(view);
    }

    function recordedHeadView(post, callback) {
         var view = '';
        callback(view);
    }
    function recordedBodyView(post, callback) {
         var view = '';
        callback(view);
    }
    function recordedFootView(post, data, callback) {
         var view = '';
        callback(view);
    }

    function realtimeHeadView(post, callback) {
         var view = '';
        callback(view);
    }
    function realtimeBodyView(post, callback) {
         var view = '';
        callback(view);
    }
    function realtimeFootView(post, data, callback) {
         var view = '';
        callback(view);
    }


    // function imagesView(post, images, callback) {
    //     var image_HTML  = '';
    //     if (images.length === 1) {
    //        image_HTML += '<div class ="pst-dv-one-img" data-pst-id='+ post.id +' data-imgs-id="">';
    //            images.forEach(function(image, index){
    //                image_HTML +=   '<a href="" class="pst-img-lk" data-img-id='+image.id+' id=>'+
    //                                    '<img src='+ image.webPath +' class="pst-jst-oe-img" data-img-id='+ image.id +'/>'+
    //                                '</a>';
    //                });
    //        image_HTML += '</div>';
    //     } else if(images.length === 2) {
    //        image_HTML += '<div class ="pst-dv-two-img" data-pst-id='+ post.id +' data-imgs-id="">';
    //            images.forEach(function(image, index){
    //                image_HTML +=    '<a href="" class="pst-img-lk" data-img-id='+image.id+' >'+
    //                                    '<img src='+ image.webPath +' class="pst-jst-to-img" data-img-id='+image.id+'/>'+
    //                                '</a>';                                                                               
    //            });
    //        image_HTML += '</div>';
    //     } else if (images.length > 2) {
    //        nb_img = images.length - 3;
    //        image_HTML += '<div class ="pst-dv-pls-img" data-pst-id='+ post.id +' data-imgs-id="">';
    //            images.forEach(function(image, index) {
    //                if (index === 0){
    //                    image_HTML +=   '<a href="" class="pst-img-lk first" data-img-id='+ image.id +' >'+
    //                                        '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                    '</a>';
    //                } else if (index === 1) {
    //                    image_HTML += '<div class="pst-dv-pls-img-lft">'+
    //                                    '<a href="" class="pst-img-lk scond" data-img-id='+ image.id +' >'+
    //                                        '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                    '</a>';
    //                } else if (index === 2) {
    //                    image_HTML +=  '<div class ="pst-dv-thir-img" data-pst-id='+ post.id +'>'+
    //                                        '<a href="" class="pst-img-lk thir" data-img-id='+ image.id +'>'+
    //                                            '<img src='+ image.webPath +' class="pst-jst-pls-img" data-img-id='+ image.id +'/>'+
    //                                        '</a>'+
    //                                        '<a href="" class="see-mr-pst-img '+ (nb_img ? '' : 'none-see-mr-img')+'" data-pst-id='+ post.id +'>'+
    //                                            '<i class="fa fa-plus" aria-hidden="true"></i>'+
    //                                            '<span class="nb-img-txt">'+ nb_img +'</span>'+
    //                                        '</a>'+
    //                                    '</div>';     
    //                }                    
    //            });
    //        image_HTML += '</div>';
    //     }else{
           
    //     }
    //     callback(image_HTML);        
    // }
    
    function postView(data, callback) {
        postHeadView(data.response.post, function(headHtml) {
            postBodyView(data.response.post, function(bodyHtml) {
                postFootView(data.response.post, data, function(footHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })                    
                })
            })
        })
    }
    
    function opinionView(data, callback) {
        opinionHeadView(data.response.post, function(headHtml) {
            opinionBodyView(data.response.post, function(bodyHtml) {
                opinionFootView(data.response.post, data, function(footHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }
    
    function galleryView(data, callback) {
        galleryHeadView(data.response.post, function(headHtml) {
            galleryBodyView(data.response.post, function(bodyHtml) {
                postFootView(data.response.post, data, function(footHtml) {  //galleryView is same as postView footer 
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })                    
                })
            })
        })
    }

    function commentedPostView(data, callback) {
        commentedPostHeadView(data.response.post, function(headHtml) {
            commentedPostBodyView(data.response.post, function(bodyHtml) {
                commentedPostFootView(data.response.post, data, function(footHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }   

    function commentedOpinionView(data, callback) {
        commentedOpinionHeadView(data.response.post, function(headHtml) {
            commentedOpinionBodyView(data.response.post, function(bodyHtml) {
                commentedOpinionFootView(data.response.post, data, function(footHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }
    
    function ratedView(data, callback) {
        ratedHeadView(data.response.post, function(headHtml) {
            commentedBodyView(data.response.post, function(bodyHtml) {
                commentedFootView(data.response.post, data, function(footHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }

    function likedPostView(data, callback) {
        likedHeadView(data.response.post, function(headHtml) {
            commentedBodyView(data.response.post, function(bodyHtml) {
                commentedlikeFootView(data.response.post, data, function(footHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }
    
    function sharedPostView(data, callback) {
        sharedPostHeadView(data.response.post, function(headHtml) {
            commentedPostBodyView(data.response.post, function(bodyHtml) {
                commentedPostFootView(data.response.post, data, function(footHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }

    function sharedOpinionView(data, callback) {
        sharedOpinionHeadView(data.response.post, function(headHtml) {
            commentedOpinionBodyView(data.response.post, function(bodyHtml) {
                commentedOpinionFootView(data.response.post, data, function(footHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }
    
    function recordedView(data, callback) {
        recordedHeadView(data.response.post, function(headHtml) {
            recordedBodyView(data.response.post, function(bodyHtml) {
                recordedFootView(data.response.post, data, function(viewHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }

    function realtimeVideoView(post, data, callback) {
        realtimeHeadView(post, function(headHtml) {
            realtimeBodyView(post, function(bodyHtml) {
                realtimeFootView(post, data, function(viewHtml) {
                    composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }

    function followView(data, callback) {
        followHeadView(data.response.post, function(headHtml) {
            followBodyView(data.response.post, function(bodyHtml) {
                followFootView(data.response.post, data, function(viewHtml) {
                   composeView(data.response.post, headHtml, bodyHtml, footHtml, function(viewHtml){
                        callback(viewHtml);
                    })
                })
            })
        })
    }

    function renderPostView(data) {
        postView(data, function(postHtml) {
            newsContainer.append(postHtml);
        });
    }

    function renderOpinionView(data) {
        opinionView(data, function(postHtml) {
            newsContainer.append(postHtml);
        });
    }

    function renderGalleryView(data) {
        galleryView(data, function(postHtml) {
            newsContainer.append(postHtml);
        })
    }

    function renderCommentedPostView(data) {
        commentedPostView(data, function(postHtml) {
            newsContainer.append(postHtml);
        })
    }

    function renderCommentedOpinionView(data) {
        commentedOpinionView(data, function(postHtml) {
            newsContainer.append(postHtml);
        })
    }

    function renderSharedPostView(data) {
        sharedPostView(data, function(postHtml) {
            newsContainer.append(postHtml);
            
        })
    }

    function renderSharedOpinionView(data) {
        sharedOpinionView(data, function(postHtml) {
            newsContainer.append(postHtml);
        })
    }

    function renderRealTimeVideoView(data) {
        realtimeVideoView(post, data, function(postHtml) {
            newsContainer.append(postHtml);
        })
    }

    function renderRecordView(data) {
        recordView(data, function(postHtml) {
            newsContainer.append(postHtml);
        })
    }

    function renderFollowView(data) {
        followView(data, function(postHtml) {
            newsContainer.append(postHtml);
        })
    }

    this.prependPost = function(data) {
        if(data.response.post.objectType == 'post' && data.response.post.type == 'post') {
            postView(data, function(postHtml) {
                newsContainer.prepend(postHtml);
            });
        }
        if(data.response.post.objectType == 'post' && data.response.post.type == 'opinion') {
            opinionView(data, function(postHtml) {
                newsContainer.prepend(postHtml);
            });
        }
        if(data.response.post.objectType == 'gallery' && data.response.post.type == '') {
            galleryView(data, function(postHtml) {
                newsContainer.prepend(postHtml);
            });
        }
    }

    this.loopDatas = function(datas) {
        datas.forEach(function(data) {
            if(data.response.post.objectType == 'post' && data.response.post.type == 'basic') {
                renderPostView(data);
            }
            if(data.response.post.objectType == 'post' && data.response.post.type == 'opinion') {
                renderOpinionView(data);
            }
            if(data.response.post.objectType == 'notif' && data.response.post.type == 'basic') {
                renderCommentedPostView(data);
            }
            if(data.response.post.objectType == 'notif' && data.response.post.type == 'opinion') {
                renderCommentedOpinionView(data);
            }
            if(data.response.post.objectType == 'gallery' && data.response.post.type == '') {
                renderGalleryView(data);
            }
            if(data.response.post.objectType == 'profilePic' && data.response.post.type == '') {
                renderProfilePicView(data);
            }
        });
    };
}