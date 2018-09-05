$(document).ready(function () {     
    $('#record-icon-form').animatedModal({
            modalTarget:'recordAnimatedModal',
            position:'fixed', 
            width:'100%', 
            height:'100%', 
            top:'50px', 
            left:'0px', 
            zIndexIn: '9999',  
            zIndexOut: '-9999',  
            color: 'transparent', 
            opacityIn:'1',  
            opacityOut:'0', 
            animatedIn:'zoomIn',
            animatedOut:'zoomOut',
            animationDuration:'.8s', 
            overflow:'auto', 
            // Callbacks
            beforeOpen: function() {               
DetectRTC.load(function() {
    //if there is not media devices; do nothing
    if(!(DetectRTC.hasMicrophone) && !(DetectRTC.audioInputDevices) && !(DetectRTC.videoInputDevices) && !(DetectRTC.hasWebcam)){

    //if microphone as detected; mediaStream append stuff html_elements     
    }else if(((DetectRTC.hasMicrophone) || (DetectRTC.audioInputDevices))){
        if (hasGetUserMedia()) {
            $('.mediastream-in-record').html(''+
                '<div class="mediastream-record-a">'+
                    '<span class="addCameraContain"></span>'+
                    '<div class="mediastream-record-b">'+
                        '<div class="mediastream-record-left">'+
                            '<div style="color:red; font-size:20px" class="glyphicon glyphicon-record"></div>'+
                            '<section class="experiment-record" style="position:relative; top: 5px;">'+                                            
                                '<button id="start-recording-record" class="btn start-recording-record" >Start</button>'+
                                '<button id="stop-recording-record" class="btn stop-recording-record" >Stop</button>'+
                                '<button id="pause-recording-record" class="btn pause-recording-record" >Pause</button>'+
                                '<button id="resume-recording-record" class="btn resume-recording-record">Resume</button>'+
                            '</section>'+
                        '</div>'+
                        '<div  class="mediaContainer" id="mediaContainer" style="">'+  
                            '<div id="video-container" class="video-container"></div>'+
                            '<div id="progressBarContainer" class="progressBarContainer">'+                                                
                                '<a href="" id="micro-support"><i class="fa fa-microphone micro-icon"></i></a>'+
                                '<div id="border-bar-recording-record" class="border-bar-recording-record" >'+
                                    '<div id="bar-recording-record" class="bar-recording-record" ></div>'+                                                
                                '</div>'+
                                '<div id="time-recording-record"></div>'+
                            '</div>'+
                            '<button class="btn delete-record">delete</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+   
                '<span class="separate"></span>'+
                '<div class="mediaStreamFoo">'+
                    '<span class="mediaStream-footer"></span>'+
                    '<div class="mediastream-record-bottom">'+
                        '<button type="button" class="save-recording-record btn btn-default" style="font-size:11px;"><i class="fa fa-download"></i> save</button>'+
                        '<button type="submit" id="post-recording-record" class="post-recording-record btn btn-primary" style="font-size:11px;">Post</button>'+
                    '</div>'+
                '</div>'+
            '');                  

                window.URL = window.URL || window.webkitURL;
                    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                                              navigator.mediaDevices.getUserMedia || navigator.msGetUserMedia; 

                var mediaRecorder;

                var timer = null,               //the function that make timer in the 
                    interval = 1000,            //general interval 
                    globalBlob,                 //make blob as global variable     
                    time = 30,                  //max time for recorded data
                    audio = '',                 //audio tag
                    video = '',                 //video tag
                    maxWidth = 600,
                    duration = time * 1000,     //time for waiting progress-bar 
                    videoWidth = 650,           //width for video element
                    videoHeight = 400;          //height for video element

                //declare btn; progress bar etc... variacle
                var mediaContainer = $('div.mediaContainer'),
                    btnStartRecording = $('.start-recording-record'),
                    btnStopRecording = $('.stop-recording-record'),
                    btnPauseRecording = $('.pause-recording-record'),
                    btnSaveRecording = $('.save-recording-record'),
                    btnResumeRecording = $('.resume-recording-record'), 
                    btnPostRecording = $('.post-recording-record'),
                    bar = $('#bar-recording-record'),
                    videoContainer = document.getElementById('video-container'),
                    timeRecordingRecord = $('#time-recording-record'),
                    videoConstraint = false,      
                    audioConstraint = true,
                    mediaStreamFooter = $('.mediaStream-footer'),    //bottom
                    progressBarContainer = $('.progressBarContainer');
                    bar.hide();

                //Default values when the animated modal is open 
                $('.delete-record').hide();
                btnPauseRecording.prop('disabled', true);   
                btnResumeRecording.prop('disabled', true);
                btnStopRecording.prop('disabled', true);
                btnSaveRecording.prop('disabled', true);
                btnPostRecording.prop('disabled', true);


                //detect camera in firefox
                if( ){
                    $('.addCameraContain').append('<a href="" id="addCameraIcon" class="addCameraIcon"><i class="fa fa-video-camera camera-icon"></i></a>');
                }              

                //delete audio element in modal
                $('.delete-record').on('click', function(e){
                    $(this).hide();
                    e.preventDefault();
                    if(!videoConstraint){
                        $('audio').remove();
                        btnStartRecording.prop('disabled', false);
                        mediaContainer.append(''+
                            '<div id="progressBarContainer" class="progressBarContainer">'+                                                
                                '<div class="micro-support" id="micro-support"><i class="fa fa-microphone micro-icon"></i></div>'+
                                '<div id="border-bar-recording-record" class="border-bar-recording-record" >'+
                                    '<div id="bar-recording-record" class="bar-recording-record" ></div>'+                                                
                                '</div>'+
                                '<div id="time-recording-record"></div>'+
                            '</div>'+
                        '');
                    }else{
                        $('video').remove();
                    }                       
                    return false;
                });                                
                
                btnPostRecording.click(function(e){
                    e.preventDefault();
                    /* declare element */
                    this.duration;
                    
                    var file;
                        mediaContainer.find('audio').bind('canplay', function(){
                            duration = this.duration;
                            console.log(duration);
                        });
                    
                    
                    if(globalBlob.type === "audio/wav"){
                        file = new File([globalBlob], "ABCD.wav");
                    }else if (globalBlob.type === "video/webm"){
                        file = new File([globalBlob], "ABCD.webm");
                    } else if(globalBlob.type === "audio/ogg"){
                        file = new File([globalBlob], "ABCD.ogg");
                    }else if(DetectRTC.browser.isFirefox && globalBlob.type === "video/webm"){
                        
                    }else{
                        console.log('undefineded file');
                    }
                    var mediaStreamData = new FormData();
                        mediaStreamData.append('fname', 'abcde.webm');
                        mediaStreamData.append('mediaFile', file);
                        $.ajax({                                                
                            url:'http://127.0.0.1/opinion/web/app_dev.php/mediastreamrecorder/create',
                            type:'POST',
                            data: mediaStreamData,
                            beforeSend:function(){
                                if(mediaStreamFooter.find('.loading-submit').length == 0){          //add loading class
                                    mediaStreamFooter.append('<div class="loading-submit" style=""></div>');
                                }else{                    
                                }  
                            },
                            afterSend:function(){
                                if(mediaStreamFooter.find('.loading-submit').length == 1){          
                                    mediaStreamFooter.find('.loading-submit').remove();       //remove loading class
                                }else{                    
                                }
                            },
                            contentType:false,
                            processData: false,
                            success:function(data){
                                console.log(data);
                                $('.delete-record').hide();
                                mediaStreamFooter.find('.loading-submit').remove();               //remove loading
                                mediaStreamFooter.append('<i class="check-submit fa fa-check" style=""></i>'); //add checked success
                                setTimeout(function(){          //function 
                                    mediaStreamFooter.find('.check-submit').remove();   
                                        if(!videoConstraint){
                                                    $('audio').remove();
                                                    btnStartRecording.prop('disabled', false);
                                                    mediaContainer.append(''+
                                                        '<div id="progressBarContainer" class="progressBarContainer">'+                                                
                                                            '<div class="micro-support" id="micro-support"><i class="fa fa-microphone micro-icon"></i></div>'+
                                                            '<div id="border-bar-recording-record" class="border-bar-recording-record" >'+
                                                                '<div id="bar-recording-record" class="bar-recording-record" ></div>'+                                                
                                                            '</div>'+
                                                            '<div id="time-recording-record"></div>'+
                                                        '</div>'+
                                                    '');
                                                }else{
                                                    $('video').remove();
                                                }                                            //reset form 
                                                        //mediaStreamBottom.remove();
                                }, 1500);               
                            },
                            failure:function(){
                                if(mediaStreamFooter.find('.submit-error').length == 0){          //add loading class
                                    mediaStreamFooter.find('.right-popover-footer').append('<span class="loading-submit" style="left: 200px;"></span>');
                                }else{                    
                                }            
                            }
                        });
                    return false;
                });

                //display video window on click camera icon
                $('.addCameraIcon').click(function(e){
                    videoConstraint = true; // enabled the camera

                    //stated to recording the video containt                               
                    btnStartRecording.prop('disabled', true);
                    btnResumeRecording.prop('disabled', true);                                 
                    btnStopRecording.prop('disabled', false);
                    btnPauseRecording.prop('disabled', false);
                    
                    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);                               

                    e.preventDefault();                                
                    return false;
                });

                /*toggle from video recording to audio recording by click event on the microphone icon*/
                $('.micro-support').click(function(e){
                    e.preventDefault();
                    videoConstraint = false;

                    //stated to recording the video containt                               
                    btnStartRecording.prop('disabled', true);
                    btnResumeRecording.prop('disabled', true);                                 
                    btnStopRecording.prop('disabled', false);
                    btnPauseRecording.prop('disabled', false);
                    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

                    return false;
                });

                //bouton start recording
                btnStartRecording.click ( function() {                                  
                    btnStartRecording.prop('disabled', true);
                    btnResumeRecording.prop('disabled', true);                                 
                    btnStopRecording.prop('disabled', false);
                    btnPauseRecording.prop('disabled', false);
                    //test if the mediaCotainer
                    if(mediaContainer.find('audio').length !== 0){
                        alert('this an audio element in the mediacontainer');
                    }else{
                        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
                    }                    
                });

                //stop recording 
                btnStopRecording.click ( function() {                         
                    clearInterval(timer);
                    timer = null;
                    time = 0;
                    progressBarContainer.fadeOut('1000').remove();
                    btnStopRecording.prop('disabled', true);
                    btnPauseRecording.prop('disabled', true);
                    btnResumeRecording.prop('disabled', true);
                    btnStartRecording.prop('disabled', true);
                    btnPostRecording.prop('disabled', false);
                    btnSaveRecording.prop('disabled', false);
                    mediaRecorder.stop();
                    mediaRecorder.stream.stop();
                });
                //pause recording
                btnPauseRecording.click ( function() {                                
                    $(this).prop('disabled', true);
                    //timer 
                    clearInterval(timer);
                    timer = null;
                    var s = time%60,
                        displayTime = (s < 10) ? "00 : 0"+s : "00 : "+s;
                    document.getElementById('time-recording-record').innerHTML = displayTime;                                
                    mediaRecorder.pause();
                    btnResumeRecording.prop('disabled', false);
                    btnStartRecording.prop('disabled', true);
                    btnStopRecording.prop('disabled', true);                                
                });
                //resume recording
                btnResumeRecording.click ( function() {
                    $(this).prop('disabled', true);                            
                    if (timer !== null) return;
                    this.timer = window.requestInterval(function () {
                        time = time-1;
                        var s = time%60,
                            displayTime = (s < 10) ? "00 : 0"+s : "00 : "+s;
                        document.getElementById('time-recording-record').innerHTML = displayTime;                                    
                    }, interval);
                    bar.animate({
                        width: maxWidth
                    }, duration, function() {
                        $(this).css('background-color', 'green');
                        //clearInterval(timer);
                    });
                    mediaRecorder.resume();
                    btnStartRecording.prop('disabled', true);
                    btnStopRecording.prop('disabled', false);
                    btnPauseRecording.prop('disabled', false);
                });
                //save recoded media in device
                btnSaveRecording.click ( function() {                             
                    $(this).prop('disabled', true);
                    mediaRecorder.save();
                });   
                
                

                var mediaConstraints = {
                    audio: !!audioConstraint,       //global boolean
                    video: !!videoConstraint
                };                       

                function onMediaSuccess(stream) {                            
                    mediaRecorder = new MediaStreamRecorder(stream);
                    mediaRecorder.stream = stream;
                    mediaRecorder.bufferSize = 512;     //audio-bufferSize values: 0, 256, 512, 1024, 2048, 4096, 8192, and 16384. "0" means: let chrome decide the device's default bufferSize
                    mediaRecorder.audioChannels = 1;
                /* -- do this, if this is only the audio recorded data ---------*/
                    if(!videoConstraint){
                        if(mediaContainer.find('audio').length !== 0){
                            alert('this an audio element in the mediacontainer');
                        }else{
                            mediaRecorder.mimeType = 'audio/ogg';   //media as type of recorded data

                            time = 30;                              //time for all data recoded
                            /* set Timeout before *
                             * displaying the time *
                             * decrease */
                            this.timeout = window.requestTimeout(function(){                                                               
                                if (timer !== null) return;
                                    this.timer = window.requestInterval(function () {
                                        time = time-1;                                                                                        
                                            var s = time%60,
                                            displayTime = (s < 10) ? "00 : 0"+s : "00 : "+s;   
                                            if($('audio').length == 0){
                                            document.getElementById('time-recording-record').innerHTML = displayTime; 
                                        }else{
                                            console.log('rien');
                                        }
                                    }, interval);                             
                            }, 100);
                            /* timeout before
                             * diplayong the  progressbar 
                             * in modal*/
                            // window.requestTimeout(function(){
                            //     bar.show();
                            //     $('.bar-recording-record').animate({
                            //         width: maxWidth
                            //     }, duration, function() {
                            //         $(this).css('background-color', 'green');
                            //         //clearInterval(timer);
                            //     });
                            // }, 10);
                            console.log(stream);
                            //when the data available in mediaStreamRecorder 
                            mediaRecorder.ondataavailable = function (blob) {
                                // POST/PUT "Blob" using FormData/XHR2
                                globalBlob = blob;
                                var blobURL = window.URL.createObjectURL(blob);
                                audio = $('<audio/>', {
                                    id: 'audio-in-media',
                                    controls: true,
                                    muted: true,
                                    src: blobURL
                                }); 

                                console.log(audio.duration);
                                clearInterval(timer);
                                timer = null;
                                time = 0;
                                $('.progressBarContainer').remove();
                                mediaContainer.append(audio);
                                $('.delete-record').show();
                                mediaRecorder.stop();
                                mediaRecorder.stream.stop();


                            };
                            mediaRecorder.start(30000);
                        }
                    }else{

                /*mediaStreamRecorder for video recording*/                                        
                        mediaRecorder.mimeType = 'video/webm';                               
                        mediaRecorder.videoWidth = videoWidth;
                        mediaRecorder.videoHeight = videoHeight;

                        var video = document.createElement('video');
                        video = mergeProps(video, {
                            controls: true,
                            muted: true,
                            width: videoWidth,
                            height: videoHeight,
                            src: URL.createObjectURL(stream)
                        });
                        video.play();
                        videoContainer.appendChild(video);                                        

                        mediaRecorder.ondataavailable = function(blob) {
                            mediaRecorder.stop();
                            mediaRecorder.stream.stop();
                            globalBlob = blob;
                            var blobURL = window.URL.createObjectURL(blob);                                    
                                video = $('<video/>', {
                                    id: 'recorded-video',
                                    controls: true,
                                    muted: true,
                                    src: blobURL
                                }); 


                            $('.video-container').remove();
                            $('.progressBarContainer').remove();
                            mediaContainer.append(video);
                            $('.delete-record').show();                                       

                            clearInterval(timer);
                            timer = null;
                            time = 0;


                            btnStopRecording.prop('disabled', true);
                            btnPauseRecording.prop('disabled', true);
                            btnResumeRecording.prop('disabled', true);
                            btnStartRecording.prop('disabled', true);            

                        };                                
                        mediaRecorder.start(30000);
                    }                                  
                }                                
                function onMediaError(e) {
                    console.error('media error', e);
                }
        } else { alert('getUserMedia() is not supported in your browser'); }
    }else{ $('.mediastream-in-record').html(''+
        '<div class="mediastream-record-a">'+
            'please connect the camera and microphone has been connected'+
        '</div>'+   
        '');
    }
    //detect the speaker
    if(!(DetectRTC.hasSpeakers) && !(DetectRTC.audioOutputDevices)){
        console.log('vous n\'avez pas brancher le haut parleur');
    }else{
        console.log('il y n en un ');
    }
});
            },           
            afterOpen: function() {                
                console.log("The animation is completed");
            }, 
            beforeClose: function() {
               
            }, 
            afterClose: function() {
                console.log("The animation is completed");
                 mediaRecorder.stop();
            }
        });          
        
        function hasGetUserMedia() {
            // Note: Opera is unprefixed.
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mediaDevices.getUserMedia || navigator.msGetUserMedia);
        }
        
});


