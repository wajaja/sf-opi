
function SetProfilesImage(){
    var viewportWidth   = 0,
        global_type     = "",
        data_imgId      = "",
        image_file      = "",
        $uploadCrop     = null,
        win             = window,
        doc             = document,
        $               = win.jQuery,
        winW            = win.innerWidth,
        winH            = win.innerHeight,
        mOverlay        = doc.getElementById('st-profiles-overlay'),
        mContainer      = doc.getElementById('st-profiles-container');
    
    /**
     * Croppie out image from it url 
     * @param {String} url
     * @param {String} file
     * @param {String} imageId
     * @returns {undefined}
     */
    function bindUrl(url, file, imageId){
        $('.mdl-st-prf-opt-ctnr').css("display", "block"); //
        $uploadCrop.croppie('bind', {
            url : url
        });
        data_imgId = imageId.length === 24 ? imageId : "";  //image exist ?
        image_file = file;                                  // after file readed
    }
    
    /**
     * Before OpenModal Get profile pic or Image by its id
     * @param {String} imgId
     * @returns {undefined}
     */
    function beforeOpenModal (imgId) {
        var url         = "";
        viewportWidth   = global_type === 'cover' ? 589 : 200;
        if(imgId === ""){
            url = global_type === 'cover' ? 'http://opinion.comapp_dev.php/profile/cover'
                                          : 'http://opinion.comapp_dev.php/profile/pic';
        } else {
            url = 'http://opinion.comapp_dev.php/images/' + imgId;
        }

        $.ajax({
            type: 'get',
            url: url,
            beforeSend: function () {},
            dataType: "json",
            success: function (data) {
                'use strict';
                //croppie bind imageSrc
                console.log(data.webPath);
                if(data.webPath !== "") {
                    createCroppieInstance(viewportWidth, function () {
                        bindUrl(data.webPath, '', data.imageId);
                    });                    
                } else {
                    createCroppieInstance(viewportWidth, function () {
                        //nothing to do here; just create croppie instance
                    });
                }                
            },
            failure: function () {}
        });
    }
    
    /**
     * get Others user's images
     * @returns {undefined}
     */
    function afterOpenModal () {
        //call all user'images 
        $.ajax({
            type: 'get',
            url: 'http://opinion.comapp_dev.php/profile/images',
            beforeSend: function () {},
            dataType: "json",
            success: function (data) {
                'use strict';
                if(null === data.images){
                    $('.mdl-st-prf-upt-btm-ctnr').html(noOthersImagesHtml);
                } else {
                    $('.mdl-st-prf-upt-btm-ctnr').html('');
                }                
            },
            failure: function () {}
        });
    }

    function beforeCloseModal (type) {
        //
    }

    function afterCloseModal () {

    }
    
    /**
     * Crop the result
     * @param {String} result
     * @returns {undefined}
     */
    function cropResult (result) {
        var html;
        if (result.html) {
            html = result.html;
        }
        if (result.src) {
            $('#crop-area').toggleClass('changed');                     //toggle;

            html = '<img id="lst-crop" class="lst-crop" src="' + result.src + '" / style="width: '+ viewportWidth +'px !important">';
        }
        $('#crop-area').removeClass('croppie-container');     //remove croppie-container in crop-area
        $('#crop-area').html(html);                         //print img to user after cropping
          //display save buttom
    //    $('#cfrm_sv_pic').attr("disabled", "false");  //change text & class on button
    }

    /**
     * Save cropped data or if possible image file to Server
     * @param {String} cropped_data
     * @returns {undefined}
     */
    function SaveToServer (cropped_data){
        url = global_type === 'cover' ? 'http://opinion.comapp_dev.php/complete/cover'
                                      : 'http://opinion.comapp_dev.php/complete/pic';
        var formData = new FormData();
        formData.append('cropped_data', cropped_data);
        formData.append('file', image_file);
        formData.append('image_id', data_imgId);
        $.ajax({
            type:'post',
            url: url,
            data:formData,
            contentType:false,
            processData: false,
            beforeSend:function(){
                if(!$('#crop-area').find('.cfmd-ldg-upld').length){
                    $('#crop-area').append('<span class="cfmd-ldg-upld"></span>');
                }
            },
            success:function(response){
//                if($('#crop-area').find('.cfmd-ldg-upld').length){
//                    $('.cfmd-ldg-upld').remove();
//                }  
                console.log(response.data);
                //TODO flash message
//                setTimeout(function(){
//                    window.location.href = response.url;
//                }, 1000);
            },
            failure:function(){
                console.log('error');
            }
        });
    }
    
    /**
     * Open Modal
     * @param {String} type
     * @param {String} imgId
     * @returns {undefined}
     */
    this.OpenModal = function (type, imgId) {

        mOverlay.style.display  = "block";
        mContainer.style.left   = ((winW / 2) - (600 / 2)) + "px";
        mContainer.style.top    = "60px";
        global_type             = type;

        //add Animation Class
        mContainer.style.display = "block";
        $('#st-profiles-container').addClass('prof-openModal');
        global_type === 'cover' ? $('#st-profiles-container').html(coverHtmlContainer)
                                : $('#st-profiles-container').html(profileHtmlContainer);

        beforeOpenModal(imgId);   

        afterOpenModal();
    }
    
    /**
     * Close Modal
     * @returns {undefined}
     */
    this.CloseModal = function () {
        // beforeCloseModal(type);
        var $mContainer         = $('#st-profiles-container');
        mOverlay.style.display  = "none";
        $mContainer.removeClass('prof-openModal');
        $mContainer.html('');
        mContainer.style.display = "none";
        // afterCloseModal()
    }
    
    /**
     * Reset Modal Content
     * @returns {undefined}
     */
    this.Reset = function () {
        createCroppieInstance (viewportWidth, function () {
            //nothing to do here; just  new croppie instance
        });

        $('.mdl-st-prf-opt-center') .css("display", "inline-block");
        $('.mdl-st-prf-opt-rgt')    .css("display", "none");
        $('.mdl-st-prf-upt-hd')     .css("height", "340px");
        $('.mdl-st-prf-upt-btm')    .css("display", "block");
    }
    
    /**
     * ReadFile After change event
     * @param {Object} input
     * @returns {undefined}
     */
    this.ReadFile = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                bindUrl(e.target.result, input.files[0], "");
                //   
            }
            reader.readAsDataURL(input.files[0]);
        }
        else {
            console.log("Sorry - you're browser doesn't support the FileReader API");
        }
    }
    
    /**
     * Croppie instance
     * @param {Integer} viewportWidth
     * @param {Function} callback
     * @returns {undefined}
     */
    function createCroppieInstance (viewportWidth, callback) {
        $('.vw-crop').css("display", "inline");                 //display button after after on change event on input element
        if(!$('#crop-area').hasClass('changed')){
            $('#crop-area').toggleClass('changed');
            console.log('pas');
        }
        if(!$('#crop-area').hasClass('croppie-container')){
            $('#crop-area').find('.lst-crop').remove();         //remove text before load an file
            $uploadCrop = $('#crop-area').croppie({             //attach croppie to element
                viewport: {
                    width: viewportWidth,
                    height: 200,
                    type: 'square'
                },
                boundary: {
                    width: 588,
                    height: 280
                },
                exif: true,
                enableOrientation : true
            });

        }

        callback();
    }

    $(document).on('click', '.save-set-prof', function (e) {
        e.preventDefault();
        //send data to server
        var data = $('#lst-crop').attr('src');  //get data:base64 of cropped img
        SaveToServer(data);                     //call fct for sending data to server
    });
     //upload to server
    $(document).on('click', '#cfrm_sv_pic', function(e){
        e.preventDefault();
        var data = $('#lst-crop').attr('src');  //get data:base64 of cropped img
        SaveToServer(data);                     //call fct for sending data to server
    });

    //crop picture
    $(document).on('click', '.vw-crop', function (ev) {
        ev.preventDefault();
        $uploadCrop.croppie('result', {
                type: 'canvas',
                size: 'viewport'
            }).then(function (resp) {
               cropResult({
                    src: resp
               });
               console.log('here');
            });

        $('.mdl-st-prf-opt-center') .css("display", "none");
        $('.mdl-st-prf-opt-rgt')    .css("display", "block");
        $('.mdl-st-prf-upt-hd')     .css("height", "240px");
        $('.mdl-st-prf-upt-btm')    .css("display", "none");
        return false;
    });

    $(document).on('click', '.rot-prof-img', function (e){
        e.preventDefault();
        $uploadCrop.croppie('rotate', parseInt($(this).attr('data-deg')));
    });

    var profileHtmlContainer =  '<div class="mdl-st-prf-upt" id="mdl_prof_upt">'+
                                    '<div class="mdl-st-prf-upt-ctnr" id="mdl_prof_upt_ctnr">'+
                                        '<div class="mdl-st-prf-upt-hd" id="mdl_prof_upt_hd">'+
                                            '<div class="mdl-st-prf-upt-hd-ctnr" id="mdl_prof_upt_hd_ctnr">'+
                                                '<div class="mdl-st-prf-frm-dv" style="position:relative;">'+
                                                    '<a href="" class="close-profSet-modal">'+
                                                        '<i class="fa fa-times" aria-hidden="true"></i>'+
                                                    '</a>'+
                                                    '<div id="crop-area" class="crop-area changed"></div>'+
                                                    '<div class="mdl-st-prf-inp-ctnr" style="">'+
                                                        '<button class="fileUploadImageSet btn btn-d ">'+
                                                            '<i class="fa fa-camera fa-2x ">'+
                                                                '<input type="file" class="inpUploadImageSet" id="inpUploadImageSet">'+
                                                            '</i>'+
                                                        '</button>'+
                                                    '</div>'+
                                                    '<div class="mdl-st-prf-opt-ctnr" >'+
                                                        '<div class="mdl-st-prf-opt-center" >'+
                                                            '<button class="btn rot-prof-img rot-lft" type="button" data-deg="-90">'+
                                                                '<i class="fa fa-undo" aria-hidden="true"></i>'+
                                                            '</button>'+
                                                            '<span class="vw-crop-sp" >'+
                                                                '<button class="btn vw-crop" type="button">View</button>'+
                                                            '</span>'+
                                                            '<button class="btn rot-prof-img rot-rgt" type="button" data-deg="90">'+
                                                                '<i class="fa fa-repeat" aria-hidden="true"></i>'+
                                                            '</button>'+
                                                        '</div>'+
                                                        '<div class="mdl-st-prf-opt-rgt" >'+
                                                            '<div class="mdl-st-prf-opt-rgt-a" >'+
                                                                '<button class="btn btn-danger cancel-set-prof" type="button">Cancel</button>'+
                                                                '<button class="btn btn-primary save-set-prof" type="submit" >Save</button>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="mdl-st-prf-upt-btm" id="mdl_prof_upt_btm">'+
                                            '<div class="mdl-st-prf-upt-btm-ctnr" id="mdl_prof_upt_btm_ctnr">'+
                                                '<div class="opinion_modal_loading" ></div>' +
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';

    var coverHtmlContainer =    '<div class="mdl-st-prf-upt" id="mdl_cover_upt">'+
                                    '<div class="mdl-st-prf-upt-ctnr" id="mdl_cover_upt_ctnr">'+
                                        '<div class="mdl-st-prf-upt-hd" id="mdl_cover_upt_hd">'+
                                            '<div class="mdl-st-prf-upt-hd-ctnr" id="mdl_cover_upt_hd_ctnr">'+
                                                '<div class="mdl-st-prf-frm-dv" style="position:relative;">'+
                                                    '<a href="" class="close-profSet-modal">'+
                                                        '<i class="fa fa-times" aria-hidden="true"></i>'+
                                                    '</a>'+
                                                    '<div id="crop-area" class="crop-area changed"></div>'+
                                                    '<div class="mdl-st-prf-inp-ctnr" style="">'+
                                                        '<button class="fileUploadImageSet btn btn-d ">'+
                                                            '<i class="fa fa-camera fa-2x ">'+
                                                                '<input type="file" class="inpUploadImageSet" id="inpUploadImageSet">'+
                                                            '</i>'+
                                                        '</button>'+
                                                    '</div>'+
                                                    '<div class="mdl-st-prf-opt-ctnr" >'+
                                                        '<div class="mdl-st-prf-opt-center" >'+
                                                            '<button class="btn rot-prof-img rot-lft" type="button" data-deg="-90">'+
                                                                '<i class="fa fa-undo" aria-hidden="true"></i>'+
                                                            '</button>'+
                                                            '<span class="vw-crop-sp" >'+
                                                                '<button class="btn vw-crop" type="button">View</button>'+
                                                            '</span>'+
                                                            '<button class="btn rot-prof-img rot-rgt" type="button" data-deg="90">'+
                                                                '<i class="fa fa-repeat" aria-hidden="true"></i>'+
                                                            '</button>'+
                                                        '</div>'+
                                                        '<div class="mdl-st-prf-opt-rgt" >'+
                                                            '<div class="mdl-st-prf-opt-rgt-a" >'+
                                                                '<button class="btn btn-danger cancel-set-prof" type="button">Cancel</button>'+
                                                                '<button class="btn btn-primary save-set-prof" type="submit" >Save</button>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="mdl-st-prf-upt-btm" id="mdl_cover_upt_btm">'+
                                            '<div class="mdl-st-prf-upt-btm-ctnr" id="mdl_cover_upt_btm_ctnr">'+
                                                '<div class="opinion_modal_loading" ></div>' +
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
    var noOthersImagesHtml = '<div class="mdl-st-prf-upt-btm-not">No Other Image</div>';
}

var SetProfilesImage = new SetProfilesImage();