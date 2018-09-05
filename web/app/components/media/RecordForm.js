import React 			from 'react'
import createReactClass from 'create-react-class'

// const DetectRTC = require('detectrtc')


const RecordForm = createReactClass({

	getInitialState() {
		return {
		var mediaRecorder;

        var timer = null,               //the function that make timer in the 
            interval = 1000,            //general interval 
            streamAvailable: false,
            globalBlob,                 //make blob as global variable     
            time = 30,                  //max time for recorded data
            audio = '',                 //audio tag
            video = '',                 //video tag
            maxWidth = 600,
            duration = time * 1000,     //time for waiting progress-bar 
            videoWidth = 650,           //width for video element
            videoHeight = 400;          //height for video element
         	var mediaConstraints : {
                audio: !!true,       //global boolean
                video: !!false
            },
            isCamera: false,
		}
	},

	mediaRecorder: null,

	hasGetUserMedia() {
        // Note: Opera is unprefixed.
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mediaDevices.getUserMedia || navigator.msGetUserMedia);
    },

	onMediaSuccess(stream) {                            
        this.mediaRecorder = new MediaStreamRecorder(stream);
        this.mediaRecorder.stream = stream;
        this.mediaRecorder.bufferSize = 512;     //audio-bufferSize values: 0, 256, 512, 1024, 2048, 4096, 8192, and 16384. "0" means: let chrome decide the device's default bufferSize
        this.mediaRecorder.audioChannels = 1;

    	/* -- do this, if this is only the audio recorded data ---------*/
        if(!videoConstraint){
            if(mediaContainer.find('audio').length !== 0){
                alert('this an audio element in the mediacontainer');
            }else{
                let mediaRecorder.mimeType = 'audio/ogg',   //media as type of recorded data
                time = 30;                              //time for all data recoded
                /* set Timeout before *
                 * displaying the time *
                 * decrease */
                this.timeout = window.requestTimeout(function(){                                                               
                    if (timer !== null) return;
                        this.timer = window.requestInterval(function () {
                            time = time-1;                                                                                        
                                let s = time%60,
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
                window.requestTimeout(function(){
                    bar.show();
                    $('.bar-recording-record').animate({
                        width: maxWidth
                    }, duration, function() {
                        $(this).css('background-color', 'green');
                        //clearInterval(timer);
                    });
                }, 10);
                console.log(stream);
                //when the data available in mediaStreamRecorder 
                mediaRecorder.ondataavailable = function (blob) {
                    // POST/PUT "Blob" using FormData/XHR2
                    globalBlob = blob;
                    let blobURL = window.URL.createObjectURL(blob);
                    audio = $('<audio/>', {
                        id: 'audio-in-media',
                        controls: true,
                        muted: true,
                        src: blobURL
                    }); 

                    console.log(audio.duration);
                    window.clearRequestInterval(this.timer);
                    this.timer = null;
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
    },

    onMediaError(e) {
        console.error('media error', e);
    },

	//delete audio element in modal
    onDelete(e){
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
    },

    //stop recording 
    stopRecording(e) {                         
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
    },

    //pause recording
    pauseRecording() {                                
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
    },

    //bouton start recording
    startRecording(e) {                                  
        btnStartRecording.prop('disabled', true);
        btnResumeRecording.prop('disabled', true);                                 
        btnStopRecording.prop('disabled', false);
        btnPauseRecording.prop('disabled', false);
        //test if the mediaCotainer
        if(mediaContainer.find('audio').length !== 0){
            alert('this an audio element in the mediacontainer');
        }else{
            navigator.getUserMedia(
            	this.state.mediaConstraints, 
            	this.onMediaSuccess, 
            	this.onMediaError
            );
        }                    
    },

    //resume recording
    resumeRecording(e) {
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
    },

     //save recoded media in device
    saveRecording(e) {                             
        $(this).prop('disabled', true);
        mediaRecorder.save();
    },   

    postRecording(e){
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
    },

	componentDidMount() {
		DetectRTC.load(function() {
		    //if there is not media devices; do nothing
		    if(!(DetectRTC.hasMicrophone) && !(DetectRTC.audioInputDevices) && !(DetectRTC.videoInputDevices) && !(DetectRTC.hasWebcam)){

		    }

		    //if microphone as detected; mediaStream append stuff html_elements     
		    else if(((DetectRTC.hasMicrophone) || (DetectRTC.audioInputDevices))){
		        if (this.hasGetUserMedia()) {
		                window.URL = window.URL || window.webkitURL;
		                    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		                                              navigator.mediaDevices.getUserMedia || navigator.msGetUserMedia; 

		       
		                //declare btn; progress bar etc... variacle
		                var mediaContainer = $('div.mediaContainer'),
		                    btnStartRecording = $('.start-recording-record'),
		                    
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




		 window.URL = window.URL || window.webkitURL;
                    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                                              navigator.mediaDevices.getUserMedia || navigator.msGetUserMedia; 
	},

    componentWillUnmount() {
        this.
    },

	render() {


		const audio = audio = $('<audio/>', {
                        id: 'audio-in-media',
                        controls: true,
                        muted: true,
                        src: blobURL
                    }); 


		return(
			<div className="mediastream-in-record">
				<div className="mediastream-record-a">
                    <span className="addCameraContain">
                    	{this.state.isCamera && 
                    		<a href="" id="addCameraIcon" class="addCameraIcon">
		                    	<i class="fa fa-video-camera camera-icon"></i>
		                	</a>
		                }
                    </span>


                    <div className="mediastream-record-b">
                        <div className="mediastream-record-left">
                            <div style="color:red; font-size:20px" className="glyphicon glyphicon-record"></div>
                            <section className="experiment-record" style="position:relative; top: 5px;">                                            
                                <button onClick={this.startRecording} className="btn start-recording-record" >Start</button>
                                <button onClick={this.stopRecording} className="btn stop-recording-record" >Stop</button>
                                <button onClick={this.pauseRecording} className="btn pause-recording-record" >Pause</button>
                                <button onClick={this.resumeRecording} className="btn resume-recording-record">Resume</button>
                            </section>
                        </div>
                        <div  className="mediaContainer" id="mediaContainer" style="">  
                            <div className="video-container">

                            </div>
                            <div className="audio-container">
                            
                            </div>

                            <div id="progressBarContainer" className="progressBarContainer">                                                
                                <a onClick={this.startRecording} id="micro-support">
                                	<i className="fa fa-microphone micro-icon"></i>
                                </a>
                                <div id="border-bar-recording-record" className="border-bar-recording-record" >
                                    <div id="bar-recording-record" className="bar-recording-record" ></div>                                                
                                </div>
                                <div id="time-recording-record"></div>
                            </div>
                            <button onClick={this.onDelete} className="btn delete-record">delete</button>
                        </div>
                    </div>
                </div>   
                <span className="separate"></span>
                <div className="mediaStreamFoo">
                    <span className="mediaStream-footer"></span>
                    <div className="mediastream-record-bottom">
                        <button 
                        	type="button" className="save-recording-record btn btn-default" 
                        	onClick={this.saveRecording}
                        	>
                        	<i className="fa fa-download"></i> 
                        	save
                        </button>
                        <button 
                        	type="submit" 
                        	onClick={this.postRecording}
                        	className="post-recording-record btn btn-primary"
                        	>
                        	Post
                        </button>
                    </div>
                </div>
			</div>
		)
	}
})


export default RecordForm