var exec            = require('child_process').exec,
    spawn           = require('child_process').spawn,
    path            = require('path');


var initEncode = function initEncode(uploadDir, fileNoExt, originalExt, type) {
    return new Promise((resolve, reject) => {
        if(type === 'h264' || type === 'mpeg') {
            encodeVideoH264(uploadDir, fileNoExt, originalExt, null).then(
                (output) => { 
                    resolve(output) 
                }, 
                (err) => { 
                    console.log(err)
                    reject(err) }
            )
        } else {
            encodeVideoVP9(uploadDir, fileNoExt, originalExt, null).then(
                (output) => { resolve(output) }, 
                (err) => { reject(err) }
            )
        }
    })
}

/**
* @Function encode video (extension || size)
* @param vidExt         : video extension
* @param videoSize      : the video size
* 
*/
var encodeVideoH264 = function encodeVideoH264(uploadDir, fileNoExt, originalExt, resolution) {
    return new Promise((resolve, reject) => {
        /**
        * -i input.mov: this is our input video file
        * -s 640x360: we tell FFmpeg to resize our input file to 640x360 while transcoding
        * -c:v libx264: we tell FFmpeg to use x264 as the video encoding library
        * -b:v 650k: the target video bitrate should be 650 kbps
        * -r 24: we want a constant framerate at 24 fps (which is the same as our source video file in this case)
        * -x264opts keyint=48:min-keyint=48:no-scenecut: we should have one keyframe every 48 frames (every 2 seconds). The keyframe injection should be constant
        * -profile:v main: we want H.264 main profile which is supported by most devices on the market while offering good transcoding quality and options
        * -preset fast: we use a fast preset for x264 transcoding
        * -movflags +faststart: the file should be web ready (moov box before mdat box)
        * -c:a libfdk_aac: we use libfdk_aac as our audio encoding library
        * -b:a 128k: the target audio bitrate should be 128 kbps
        * -ac 2: we want a stereo (2 audio channels) output
        * out-low.mp4: our output file should be a MP4 file named out-low.mp4
        */
        // const cmd = "ffmpeg -i input.mov -s 640x360 -c:v libx264 "+
        //             "-b:v 650k -r 24 -x264opts keyint=48:min-keyint=48:no-scenecut "+ 
        //             "-profile:v main -preset fast -movflags +faststart -c:a libfdk_aac "+
        //             "-b:a 128k -ac 2 out-low.mp4";

        var output, bitrate, bufsize;
        if(resolution === '640x360') { 
            output = 'out-low.mp4';
            bitrate = '650k';
            bufsize = '500k'
        } else if(resolution === '854x480') {
            output = 'out-med.mp4';
            bitrate = '1400k';
            bufsize = '1000k'
        } else if(resolution === '1280x720'){
            output = 'out-high.mp4'
            bitrate = '2500k'
            bufsize = '1500k'
        } else {
            output = 'output' + '.mp4'
            bitrate = '1400k'
            bufsize = '1000k'
        }

        var size = resolution !== null ? ' -s '+ resolution : ' ',

        cmd = ` ffmpeg -i ${uploadDir}/input.${originalExt} ` +
              ` -r 24 -c:a aac -b:a 128k -profile:v main ` +
              ` -ab 128k -f mp4 -aspect 16:9 -r 30  ${size} ` +
              ` -preset fast -movflags +faststart -ar 44100 ` +
              ` -c:v libx264 -x264opts keyint=24:min-keyint=24:no-scenecut ` +
              ` -b:v ${bitrate} -maxrate 1500k -bufsize ${bufsize} ` +
              //'-vf "scale=-1:720" ' +
              path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', fileNoExt, output);

        /**
        * @process : spawn execute command
        * spawn('cmd.exe', ['/s', '/c',  command]); : On Windows platform
        * spawn('/bin/sh', ['-c',  command]); : On Unix platform
        */
        try {
            exec(cmd, { maxBuffer: 1024*500 }, (err, stdout, stderr) => {
                if(err) return reject(err)
                resolve(`${uploadDir}/${output}`)
            })            
        } catch (e) {
            console.log('catch generate* error ', e)
            reject(e)
        } 
    })
}

/**
* @Function encode video (extension || size)
* @param vidExt         : video extension
* @param videoSize      : the video size
* 
*/
var encodeLibvorbis = function encodeLibvorbis(uploadDir, fileNoExt, originalExt) {
    return new Promise((resolve, reject) => {

        const cmd = `ffmpeg -i ${uploadDir}/input.${originalExt} ` +
                    `-c:a libvorbis -b:a 128k -vn `+
                    `-f webm -dash 1 `+
                    path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', fileNoExt, 'audio.webm');
        // path.join(__dirname, '..',  '/optube', 'uploads', 'videos', fileNoExt, output) + 

        /**
        * @process : spawn execute command
        * spawn('cmd.exe', ['/s', '/c',  command]); : On Windows platform
        * spawn('/bin/sh', ['-c',  command]); : On Unix platform
        */
        try {
            exec(cmd, { maxBuffer: 1024*500 }, (err, stdout, stderr) => {
                if(err) return reject(err)

                resolve()
            })            
        } catch (e) {
            console.log('catch generate* error ', e)
            reject(e)
        } 
    })
}

/**
* @Function encode video (extension || size)
* @param vidExt         : video extension
* @param videoSize      : the video size
* 
*/
var encodeVideoVP9 = function encodeVideoVP9(uploadDir, fileNoExt, originalExt, resolution) {
    return new Promise((resolve, reject) => {
        /**
        * -i input.mov: this is our input video file
        * -s 640x360: we tell FFmpeg to resize our input file to 640x360 while transcoding
        * -c:v libx264: we tell FFmpeg to use x264 as the video encoding library
        * -b:v 650k: the target video bitrate should be 650 kbps
        * -r 24: we want a constant framerate at 24 fps (which is the same as our source video file in this case)
        * -x264opts keyint=48:min-keyint=48:no-scenecut: we should have one keyframe every 48 frames (every 2 seconds). The keyframe injection should be constant
        * -profile:v main: we want H.264 main profile which is supported by most devices on the market while offering good transcoding quality and options
        * -preset fast: we use a fast preset for x264 transcoding
        * -movflags +faststart: the file should be web ready (moov box before mdat box)
        * -c:a libfdk_aac: we use libfdk_aac as our audio encoding library
        * -b:a 128k: the target audio bitrate should be 128 kbps
        * -ac 2: we want a stereo (2 audio channels) output
        * out-low.mp4: our output file should be a MP4 file named out-low.mp4
        */

        var output, bitrate, bufsize;
        if(resolution === '160x90') {
            output = 'out-min.webm';
            bitrate = '400k';
            bufsize = '300k'
        }else if(resolution === '640x360') { 
            output = 'out-low.webm';
            bitrate = '650k';
            bufsize = '500k'
        } else if(resolution === '854x480') {
            output = 'out-med.webm';
            bitrate = '1400k';
            bufsize = '1000k'
        } else if(resolution === '1280x720'){
            output = 'out-high.webm'
            bitrate = '2500k'
            bufsize = '1500k'
        } else {
            output = 'output.webm'
            bitrate = '1400k'
            bufsize = '1000k'
        }



        var size = resolution !== null ? ' -s '+ resolution : ' '

        const VP9_DASH_PARAMS ="-tile-columns 4 -frame-parallel 1"


        const cmd = `ffmpeg -i ${uploadDir}/input.${originalExt} -c:v libvpx-vp9 ` +
                    ` ${size} -b:v ${bitrate} -keyint_min 150 `+
                    ` -g 150 ${VP9_DASH_PARAMS} -an -f webm -dash 1 `+
                    path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', fileNoExt, output);
        /**
        * @process : spawn execute command
        * spawn('cmd.exe', ['/s', '/c',  command]); : On Windows platform
        * spawn('/bin/sh', ['-c',  command]); : On Unix platform
        */
        try {
            exec(cmd, { maxBuffer: 1024*500 }, (err, stdout, stderr) => {
                console.log('command line executed with code ', cmd)
                if(err) {
                    console.log('maxBuffer', err)
                    reject(err)
                }
                else { 
                    resolve(`${uploadDir}/${output}`)
                }
            })            
        } catch (e) {
            console.log('catch generate* error ', e)
            reject(e)
        } 
    })
}


var createDASHWebm = function createDASHWebm(uploadDir, fileNoExt, originalExt, nbResolution) {
    return new Promise((resolve, reject) => {

        var cmd = '';
        if(nbResolution === null)   
            cmd = dashWebmForNullCommand(uploadDir, fileNoExt)
        else if (nbResolution === 1)
            cmd = dashWebmForOneCommand(uploadDir, fileNoExt)
        else if (nbResolution === 2)
            cmd = dashWebmForTwoCommand(uploadDir, fileNoExt)
        else if (nbResolution === 3)
            cmd = dashWebmForThreeCommand(uploadDir, fileNoExt)
        else 
            cmd = dashWebmForFourCommand(uploadDir, fileNoExt)        

        /**
        * @process : spawn execute command
        * spawn('cmd.exe', ['/s', '/c',  command]); : On Windows platform
        * spawn('/bin/sh', ['-c',  command]); : On Unix platform
        */
        try {
            exec(cmd, { maxBuffer: 1024*500 }, (err, stdout, stderr) => {
                if(err) {
                    console.log('maxBuffer', err)
                    reject(err)
                }
                else { 
                    resolve(`${uploadDir}/manifest_webm.mpd`)
                }
            })            
        } catch (e) {
            console.log('catch generate* error ', e)
            reject(e)
        }
    })
}



var createDASHGpac = function createDASHGpac(uploadDir, fileNoExt, originalExt, nbResolution) {
    return new Promise((resolve, reject) =>{
        var inputs = '';
        if(nbResolution === null)    
            inputs = `${uploadDir}/output.mp4#audio ${uploadDir}/output.mp4#video`
        else if (nbResolution === 1) 
            inputs = `${uploadDir}/out-low.mp4#audio ${uploadDir}/out-low.mp4#video`
        else if (nbResolution === 2) 
            inputs = `${uploadDir}/out-med.mp4#audio ${uploadDir}/out-low.mp4#video ${uploadDir}/out-med.mp4#video`
        else 
            inputs = `${uploadDir}/out-high.mp4#audio ${uploadDir}/out-low.mp4#video ${uploadDir}/out-med.mp4#video ${uploadDir}/out-high.mp4#video`

        var cmd = 'MP4Box -dash 2000 -rap -frag-rap -bs-switching no ' +
                  '-profile onDemand ' +
                  '-out ' + path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', `${fileNoExt}`,  'manifest_mp4.mpd') + 
                  ' ' + inputs                           

        /**
        * @process : spawn execute command
        * spawn('cmd.exe', ['/s', '/c',  command]); : On Windows platform
        * spawn('/bin/sh', ['-c',  command]); : On Unix platform
        */
        try {
            exec(cmd, { maxBuffer: 1024*500 }, (err, stdout, stderr) => {
                if(err) return  reject(err)
                resolve(uploadDir + '/manifest_mp4.mpd')
            })            
        } catch (e) {
            console.log('catch generate* error ', e)
            reject(e)
        }
    })
}

var encodeVideosH264 = function encodeVideosH264(uploadDir, fileNoExt, originalExt, fileResolution) {
    return new Promise((resolve, reject) => {
        var width       = fileResolution.w,
            height      = fileResolution.h

        encodeVideoH264(uploadDir, fileNoExt, originalExt, '640x360').then(
            (res) => { 
                if(width >= 854 && height >= 480 ) {
                    encodeVideoH264(uploadDir, fileNoExt, originalExt, '854x480').then(
                        (res) => { 
                            if(width >= 1280 && height >= 720 ) {
                                encodeVideoH264(uploadDir, fileNoExt, originalExt, '1280x720').then(
                                    (res) => { resolve(3) }, 
                                    (err) => { reject(err) }
                                )
                            } else { 
                                resolve(2) 
                            }
                        }, (err) => { reject(err) })
                } else {
                    resolve(1)
                }
            }, (err) => { reject(err) } 
        )
    })
}

var encodeVideosVP9 = function encodeVideosVP9(uploadDir, fileNoExt, originalExt, fileResolution) {
    return new Promise((resolve, reject) => {
        var width   = fileResolution.w,
        height      = fileResolution.h

        encodeLibvorbis(uploadDir, fileNoExt, originalExt).then(
            () => {
                encodeVideoVP9(uploadDir, fileNoExt, originalExt, '160x90').then(
                    (res) => { 
                        if(width >= 640 && height >= 360 ) {
                            encodeVideoVP9(uploadDir, fileNoExt, originalExt, '640x360').then(
                                (res) => { 
                                    if(width >= 854 && height >= 480 ) {
                                        encodeVideoVP9(uploadDir, fileNoExt, originalExt, '854x480').then(
                                            (res) => { 
                                                if(width >= 1280 && height >= 720 ) {
                                                    encodeVideoVP9(uploadDir, fileNoExt, originalExt, '1280x720').then(
                                                        (res) => { resolve(4) }, 
                                                        (err) => { reject(err) }
                                                    )
                                                } else { 
                                                    resolve(3) 
                                                }
                                            }, (err) => { reject(err) })
                                    } else {
                                        resolve(2)
                                    }
                                }, (err) => { reject(err) } 
                            )
                        } else {
                            resolve(1)
                        }
                    },
                    (err) => { reject() }
                )
            },              
            (err) => { reject() }
        )
    })
}

function dashWebmForNullCommand(uploadDir, fileNoExt) {
    return  `ffmpeg -f webm_dash_manifest -i ${uploadDir}/output.webm  `+
            ` -f webm_dash_manifest -i ${uploadDir}/audio.webm `+
            ` -c copy -map 0 -map 1 -f webm_dash_manifest `+
            ` -adaptation_sets "id=0,streams=0 id=1,streams=1"  ` +
            path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', `${fileNoExt}`,  'manifest_webm.mpd')
}

function dashWebmForOneCommand(uploadDir, fileNoExt) {
    return  `ffmpeg -f webm_dash_manifest -i ${uploadDir}/out-min.webm  `+
            ` -f webm_dash_manifest -i ${uploadDir}/audio.webm `+
            ` -c copy -map 0 -map 1 -f webm_dash_manifest `+
            ` -adaptation_sets "id=0,streams=0 id=1,streams=1"  ` +
            path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', `${fileNoExt}`,  'manifest_webm.mpd')
}

function dashWebmForTwoCommand(uploadDir, fileNoExt) {
    return  `ffmpeg -f webm_dash_manifest -i ${uploadDir}/out-min.webm `+
            ` -f webm_dash_manifest -i ${uploadDir}/out-low.webm  `+
            ` -f webm_dash_manifest -i ${uploadDir}/audio.webm `+
            ` -c copy -map 0 -map 1 -map 2-f webm_dash_manifest `+
            ` -adaptation_sets "id=0,streams=0,1 id=1,streams=2"  ` +
            path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', `${fileNoExt}`,  'manifest_webm.mpd')
}

function dashWebmForThreeCommand(uploadDir, fileNoExt) {
    return  `ffmpeg -f webm_dash_manifest -i ${uploadDir}/out-min.webm  `+
            ` -f webm_dash_manifest -i ${uploadDir}/out-low.webm `+
            ` -f webm_dash_manifest -i ${uploadDir}/out-med.webm `+
            ` -f webm_dash_manifest -i ${uploadDir}/audio.webm `+
            ` -c copy -map 0 -map 1 -map 2 -map 3 -f webm_dash_manifest `+
            ` -adaptation_sets "id=0,streams=0,1,2 id=1,streams=3"  ` +
            path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', `${fileNoExt}`,  'manifest_webm.mpd')
}

function dashWebmForFourCommand(uploadDir, fileNoExt) {
    return  `ffmpeg -f webm_dash_manifest -i ${uploadDir}/out-min.webm  `+
            ` -f webm_dash_manifest -i ${uploadDir}/out-low.webm `+
            ` -f webm_dash_manifest -i ${uploadDir}/out-med.webm `+
            ` -f webm_dash_manifest -i ${uploadDir}/out-high.webm `+
            ` -f webm_dash_manifest -i ${uploadDir}/audio.webm `+
            ` -c copy -map 0 -map 1 -map 2 -map 3 -map 4 -f webm_dash_manifest `+
            ` -adaptation_sets "id=0,streams=0,1,2,3 id=1,streams=1"  ` +
            path.join(__dirname, '..', '..', '/optube', 'uploads', 'videos', `${fileNoExt}`,  'manifest_webm.mpd')
}

exports.initEncode      = initEncode;
exports.createDASHWebm  = createDASHWebm
exports.createDASHGpac  = createDASHGpac
exports.encodeVideoVP9  = encodeVideoVP9
exports.encodeVideosVP9 = encodeVideosVP9
exports.encodeVideoH264 = encodeVideoH264
exports.encodeLibvorbis = encodeLibvorbis
exports.encodeVideosH264 = encodeVideosH264