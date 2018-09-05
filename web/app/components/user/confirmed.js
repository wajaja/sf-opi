///aling confirmed div in center 
var $window = $(window),
    window_size = $window.width(),
    cfmd_lf =Math.floor((window_size - 500)/2);
    cfmd_lf_px = cfmd_lf+'px';
$('.db-cfmd-dv').css("left", cfmd_lf_px); ///

function cropResult(result) {
    var html;
    if (result.html) {
        html = result.html;
    }
    if (result.src) {
        $('#crop-area').toggleClass('changed');                     //toggle;
        html = '<img id="lst-crop" class="lst-crop" src="' + result.src + '" />';
    }
    $('#crop-area').removeClass('croppie-container');     //remove croppie-container in crop-area
    $('#crop-area').html(html);                         //print img to user after cropping
      //display save buttom
//    $('#cfrm_sv_pic').attr("disabled", "false");  //change text & class on button
}
//fct called when save is clicked
function SaveToServer(data){
    var formData = new FormData();
    formData.append('base_data', data);
    console.log(formData);
    $.ajax({
        type:'post',
        url:'http://opinion.comapp_dev.php/complete/pic',
        data:formData,
        contentType:false,
        processData: false,
        beforeSend:function(){
            if(!$('.cfmd-btm-dv').find('.cfmd-ldg-upld').length){
                $('.cfmd-btm-dv').append('<span class="cfmd-ldg-upld"></span>');
            }
        },
        afterSend:function(){

        },
        success:function(response){
            //$('.cfmd-btn-dv').remove();
            if($('.cfmd-btm-dv').find('.cfmd-ldg-upld').length){
                $('.cfmd-ldg-upld').remove();
            }
            $('.vw-crop').text('done').css("color", 'green');               //display done text when data is saved to the server
            $('.prf-dv-nv-lk').html('<span class="ld-prf-img"></span>');
            $('.prf-dv-nv-lk').html('<img id="profilePic-in-nav" class="profilePic-in-nav" src="'+response.webPath+'" />');
            setTimeout(function(){
                window.location.href = response.url;
            }, 1000);
        },
        failure:function(){
            console.log('error');
        }
    });
}

var $uploadCrop;
function readFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $uploadCrop.croppie('bind', {
                    url: e.target.result
            });
//            $('.upload-demo').addClass('ready');
        }
        reader.readAsDataURL(input.files[0]);
    }
    else {
        console.log("Sorry - you're browser doesn't support the FileReader API");
    }
}


$('.uploadProfile').on('change', function () {
    $('.vw-crop').css("display", "inline");                 //display button after after on change event on input element
    if(!$('#crop-area').hasClass('changed')){
        $('#crop-area').toggleClass('changed');
        console.log('pas');
    }
    if(!$('#crop-area').hasClass('croppie-container')){
        $('.vw-crop').removeClass('sv-t-svr').text('View'); //change text in post button
        $('#crop-area').find('.lst-crop').remove();         //remove text before load an file
        $uploadCrop = $('#crop-area').croppie({             //attach croppie to element
            viewport: {
                    width: 200,
                    height: 200,
                    type: 'square'
            },
            boundary: {
                    width: 240,
                    height: 200
            },
            exif: true
        });
    }
    //if($('#crop-area').find())
    readFile(this);
});

//upload to server
$(document).on('click', '#cfrm_sv_pic', function(e){
    e.preventDefault();
    var data = $('#lst-crop').attr('src');  //get data:base64 of cropped img
    SaveToServer(data);                     //call fct for sending data to server
});

//crop picture
$('.vw-crop').on('click', function (ev) {
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
    $(this).css("display", "none");
    return false;
});
