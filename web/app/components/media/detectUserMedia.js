/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//Detect UserMedia On the Browser
    function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }
    if (hasGetUserMedia()) {
        // Good to go!
        var mediaConstraints = {
            audio: true
        };
        
        document.querySelector('#start-recording').onclick(function() {
            this.disabled = true;
            captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
        });
        document.querySelector('#stop-recording').onclick(function() {
            this.disabled = true;
            mediaRecorder.stop();
            mediaRecorder.stream.stop();
            document.querySelector('#pause-recording').disabled = true;
            document.querySelector('#start-recording').disabled = false;
        });
        document.querySelector('#pause-recording').onclick(function() {
            this.disabled = true;
            mediaRecorder.pause();
            document.querySelector('#resume-recording').disabled = false;
        });
        document.querySelector('#resume-recording').onclick(function() {
            this.disabled = true;
            mediaRecorder.resume();
            document.querySelector('#pause-recording').disabled = false;
        });
        document.querySelector('#save-recording').onclick(function() {
            this.disabled = true;
            mediaRecorder.save();
        });
        window.URL = window.URL || window.webkitURL;
        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
            navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

            function onMediaSuccess(stream) {
                var mediaRecorder = new MediaStreamRecorder(stream);
                mediaRecorder.mimeType = 'audio/ogg';
                mediaRecorder.audioChannels = 1;
                mediaRecorder.ondataavailable = function (blob) {
                    // POST/PUT "Blob" using FormData/XHR2
                    
                    var fileType = 'audio'; // or "audio"
                    var fileName = 'ABCDEF.ogg';  // or "wav" or "ogg"

                    var formData = new FormData();
                    formData.append(fileType + '-filename', fileName);
                    formData.append(fileType + '-blob', blob);

//                    xhr('{{ path('mediastreamrecorder_create', { 'id': 'create' }) }}', formData, function (fileURL) {
//                        window.open(fileURL);
//                    });

                    function xhr(url, data, callback) {
                        var request = new XMLHttpRequest();
                        request.onreadystatechange = function () {
                            if (request.readyState == 4 && request.status == 200) {
                                callback(location.href + request.responseText);
                            }
                        };
                        request.open('POST', url);
                        request.send(data);
                    }
                    
                    
                    var blobURL = URL.createObjectURL(blob);
                    document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
                    
                    //a.innerHTML = 'Open Recorded Audio No. '
                    //       + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' 
                    //  + getTimeLength(timeInterval);
                };
                //mediaRecorder.start(3000);
                 var timeInterval = document.querySelector('#time-interval').value;
                    if (timeInterval) timeInterval = parseInt(timeInterval);
                    else timeInterval = 5 * 1000;
                    // get blob after specific time interval
                    mediaRecorder.start(timeInterval);
                    document.querySelector('#stop-recording').disabled = false;
                    document.querySelector('#pause-recording').disabled = false;
                    document.querySelector('#save-recording').disabled = false;
                    
                    var audiosContainer = document.getElementById('audios-container');
                    var index = 1;
                    // below function via: http://goo.gl/B3ae8c
                    //convert bytes To Size
                    function bytesToSize(bytes) {
                        var k = 1000;
                        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                        if (bytes === 0) return '0 Bytes';
                        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
                        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
                    }
                    // below function via: http://goo.gl/6QNDcI
                    function getTimeLength(milliseconds) {
                        var data = new Date(milliseconds);
                        return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
                    }
                    window.onbeforeunload = function() {
                        document.querySelector('#start-recording').disabled = false;
                    };
                            }           
                    function onMediaError(e) {
                        console.error('media error', e);
                    }       
            } else {
                console.log('getUserMedia() is not supported in your browser');
            }

