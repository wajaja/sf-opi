$(document).ready(function () {
    $('#meeting-icon-form').animatedModal({
        modalTarget:'meetingAnimatedModal',
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
        animationDuration:'.6s', 
        overflow:'auto', 
        // Callbacks
        beforeOpen: function() {            
            DetectRTC.load(function() {
                //detect the microphone
                if(!(DetectRTC.hasMicrophone) && !(DetectRTC.audioInputDevices)){
                    console.log('aucun devise detecter');
                }else if((DetectRTC.hasMicrophone) || (DetectRTC.audioInputDevices)){
                    if (hasGetUserMedia()) {
                        $('.mediastream-in-meeting').html(''+
                            '<div class="mediastream-meeting-a">'+
                                '<div class="mediastream-meeting-b">'+
                                    '<div class="mediastream-meeting-top">'+
                                        '<section class="experiment-meeting" style="padding: 5px;">'+
                                            '<label for="time-interval">Time Interval (milliseconds):</label>'+
                                            '<input type="text" id="time-interval" class="time-interval" value="5000">'+
                                            '<button id="start-recording-meeting" class="start-recording-meeting" >Start</button>'+
                                            '<button id="stop-recording-meeting" class="stop-recording-meeting" >Stop</button>'+
                                            '<button id="pause-recording-meeting" class="pause-recording-meeting" >Pause</button>'+
                                            '<button id="resume-recording-meeting" class="resume-recording-meeting">Resume</button>'+
                                        '</section>'+
                                    '</div>'+
                                    '<audio src="" class="audio-stream" id="audio-stream" style="width:280px; ">'+
                                        'Sorry, your browser doesn\'t support embedded videos, but don\'t worry, you can'+
                                            '<a href="videofile.ogg">download it</a>'+
                                        'and watch it with your favorite video player!'+
                                    '</audio>'+
                                '</div>'+
                            '</div>'+            
                            '<div id="mediastream-video-bottom" class="mediastream-video-bottom">'+
                                '<button type="button" class="btn btn-default btn-xs" data-dismiss="modal">Close</button>'+
                                '<button type="button" class="btn btn-primary btn-xs">Save changes</button>'+
                            '</div>'+
                        ''); 
                    var audio = $('audio');
                    if(DetectRTC.browser.isChrome){     // if is chrome browser 
                            
                    }
                    else if(DetectRTC.browser.isFirefox){
                        
                    }
                    else if(DetectRTC.browser.isOpera){
                        
                    }
                    else if(DetectRTC.browser.isIE){
                        
                    }
                    else if(DetectRTC.browser.isSafari){
                        
                    }
                    else if(DetectRTC.browser.isEdge){
                        
                    }else {
                        
                    }
                    } else {
                        
                        alert('getUserMedia() is not supported in your browser');
                    }
                }else{
                    $('.mediastream-in-meeting').html(''+
                        '<div class="mediastream-meeting-no-micro">'+
                            'please connect the microphone to start recording'+
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
            console.log("The animation was called");
        }, 
        afterClose: function() {
            console.log("The animation is completed");
        }
    });
    function hasGetUserMedia() {
        // Note: Opera is unprefixed.
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }
    
});


