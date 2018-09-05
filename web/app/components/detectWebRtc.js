/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* WebRTC 
* Author : Cedrick Ngeja
* At 9th September 2015
*-----------------------------------
*  -----this file give a lot of informations 
** -----to client about his browser and to detect the  **************************************************/

    var opinionAudio = false;
    var opinionVideo = false;
    var opinionLocalAddress = '';
    var opinionAudioDevices = [];
    var opinionVideoDevices = [];

    //So far we add other variables to detect RTC 


    opinionAudio  = DetectRTC.hasSpeakers && DetectRTC.hasMicrophone && DetectRTC.isWebRTCSupported ;
    opinionVideo  =  DetectRTC.hasSpeakers && DetectRTC.hasMicrophone && DetectRTC.isWebRTCSupported && DetectRTC.hasWebcam ;
    opinionLocalAddress = DetectRTC.DetectLocalIPAddress;


    //set content message in the form  microphone
    if (opinionAudio === true ){
       //window.alert('audio');
       $("a#microphone-icon-form").hover({
            content: function() {
               var message = "start with audio" + i;
                 return message;
            }
        });
    }

    //set content message in the form  microphone
    if (opinionVideo === true){
        
    }