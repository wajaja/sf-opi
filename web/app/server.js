var http            = require('http'),
    util            = require('util'),
    ffmpeg          = require('ffmpeg'),
    fs              = require('fs-extra'),
    fluentFfmpeg    = require('fluent-ffmpeg'),
    exec            = require('child_process').exec,
    spawn           = require('child_process').spawn,
    redis           = require('socket.io-redis'),
    path            = require('path');

var server          = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200);
        res.writeHead(500);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        //res.end(content); //https://github.com/mozilla/nunjucks/issues/652#issuecomment-175881104

        res.render(content);
    });
}).listen(8081);

//var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
var io = require('socket.io').listen(server, {
    log:false, 
    origins:'*:*'
});

const { initEncode, encodeVideosH264, encodeVideosVP9, 
        createDASHGpac, createDASHWebm }  = require('./server-node/video-encoders')

var Files           = {},
    canPlayType     = {},       //canPlayType for user's browser
    StartEvent      = false,
    UploadEvent     = false,
    RemoveEvent     = false,
    UploadCompleted = false,
    tmpDir;

/**
* return value like "00", "01", "23"
*/
function pad(num) {
    return ("0" + num).slice(-2);
}

/**
*
*
*/
function replaceAll(inp_str, find, replace) {
    return inp_str.replace(new RegExp(find, 'g'), replace)
}

/**
* Function used to get time format 
* from seconds like "00:00:00"
*/
function hhmmss(secs) {
    var minutes = Math.floor(secs/60),
        seconds = secs%60,
        hours   = Math.floor(minutes/60),
        minutes = minutes%60;
        return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

function canPlayTypeClient() {
    for(var prop in canPlayType){
        if(canPlayType[prop] === true)
            return prop
    }
}

/**
* Genarate video poster 
* @param
* 
*/
function generatePoster(uploadDir, originalExt, timeAt) {
    return new Promise((resolve, reject) => {
        try {
            exec(`ffmpeg -i ${uploadDir}/input.${originalExt} `+                                             // input file
                ' -ss ' + timeAt +                                                                  //time where image frame will be captured
                ' -vframes 1 -vf "select=not(mod(t\\,4)),scale=-1:250,tile=1x1:padding=0:margin=0" ' +  // set size 250px for width
                `${uploadDir}/poster.jpg`, (err) => {
                if(err) reject(err)
                resolve(uploadDir.split('/../../web/')[1] + '/poster.jpg')
            })            
        } catch (e) {
            console.log('catch poster error ', e)
            reject(e)
        }        
    })
}


/**
* Generate image's frames for uploaded video
* @param 
*/
function generatePreview(uploadDir, originalExt) {
    return new Promise((resolve, reject) => {
        try {
            /**
            * -i "$MOVIE" The input file.
            * -y Override any existing output file.
            * -frames 1 Tell ffmpeg that output from this command is just a single image (one frame).
            * -q:v 0 Output quality, 1 is the slow.
            * -vf select= This is the selector function for video filter.
                * not(mod(n\,40)) Select one frame every 40 frames or
                  not(mod(t\,1)) Select one frame every 1 percent
                * scale=-1:120 Resize frames to fit 120px height, and the width is adjusted automatically to keep the correct aspect ratio.
                * tile=100x1 Layout captured frames into this grid.
            */
            exec(`ffmpeg -i ${uploadDir}/input.${originalExt} ` +
                ' -frames 1 -q:v 0 -vf "select=not(mod(t\\,4)),scale=-1:100,tile=40x1:padding=0:margin=0" '+ 
                `${uploadDir}/preview.jpg`, (err) => {
                if (!err) {
                    resolve(uploadDir.split('/../../web/')[1] + '/preview.jpg')
                } else {
                    reject(err)
                    console.log('Frames: ' + err);
                }          
            }); 
        } catch (e) {
            console.log("error code to generate loonnng image for video", e.code);
            console.log("error mesaaage to generate image loonng", e.msg);
            reject(e)
        }
    })
}


//on someone connected to socket
io.sockets.on('connection', function(socket) {
    socket = socket;
    socket.on('Start', function(data) {
        StartEvent      = true;
        canPlayType     = data['canPlayType'];  //canPlayType for user's browser
        var fileName    = data['fileName'],
        SsId            = data['SsId'],
        Place           = 0,
        DocumentType    = data['DocumentType'];
        Files[fileName] = {
            FileSize    : data['Size'],
            Data        : "",
            Downloaded  : 0
        };
        
        tmpDir = `./../../web/optube/cache/tmp/uploads/videos/${SsId}/${DocumentType}`;
        fs.ensureDir(tmpDir, (err) => {
            if(!err){
                try {
                    var Stat = fs.statSync(tmpDir + '/' + fileName);         

                    if(Stat.isFile()){
                        Files[fileName]['Downloaded'] = Stat.size;
                        Place = Stat.size / 524288;
                    }
                } catch (error) { } //it's a new File
                fs.open(tmpDir + '/' + fileName, "a", 0755, function(error, fd){
                    if(error){
                        console.log(error);
                    }else{
                       Files[fileName]['Handler'] = fd; //We store the file handler so we can write it later 
                       socket.emit('MoreData', {'Place' : Place, Percent : 0});
                    }
                });
            }else{
                console.log(err);
            }                
        });
    });

    socket.on('Upload', (data) => {
        StartEvent      = false;
        UploadEvent     = true;
        UploadCompleted = false;
        var fileName    = data['fileName'],
        SsId            = data['SsId'],
        DocumentType    = data['DocumentType'],
        arr_name        = fileName.split('.'),
        fileNoExt       = arr_name[0],
        originalExt     = arr_name[1];
        
        Files[fileName]['Downloaded'] += data['Data'].length;
        Files[fileName]['Data']       += data['Data'];
        
        if(Files[fileName]['Downloaded'] == Files[fileName]['FileSize']) { //file fully Uploaded
            UploadEvent = false;


            fs.write(Files[fileName]['Handler'], Files[fileName]['Data'], null, 'Binary', (error, Writen) => {
                //GEt thumbnail
                var callbackHandled = false,
                    cacheDir        = `./../../web/optube/cache/uploads/videos/${SsId}/${DocumentType}`,
                    uploadDir       = `./../../web/optube/uploads/videos/${fileNoExt}`,
                    findInManifest  = './../../web/';

                fs.ensureDir(cacheDir, (err) => {
                    if (err) return console.log('ensureDir cacheDir err :', err); 
                    fs.ensureDir(uploadDir, (err) => {
                        if (err) return console.log('ensureDir uploadDir err :', err);
                        var readStream  = fs.createReadStream(`${tmpDir}/${fileName}`),     //this readable stream                    
                        writeStream = fs.createWriteStream(`${uploadDir}/input.${originalExt}`),                
                        onError     = (error) => {
                            console.log('Error On WritenStream : ' +error);
                            if(!callbackHandled) {
                                callbackHandled = true;

                                //callback(error);          //need callback module
                            }
                        };

                        readStream.on('error', onError);
                        writeStream.on('error', onError);
                        readStream.on('end', () => {
                            writeStream.end(() => {
                                console.log('writting streamed video ended')
                                if(!callbackHandled){
                                    callbackHandled = true;
                                    //callback(null);           //need callback module
                                }
                            });
                        });

                        readStream.pipe(writeStream, {end:false});      //
                        
                        fs.unlink (tmpDir + '/' + fileName, () => {

                            /** 
                            * copy file in uploads directory
                            * @param        : file source
                            * @param        : target file
                            */
                            try {
                                fs.copy(`${uploadDir}/input.${originalExt}` , `${cacheDir}/${fileName}`, (err) => {
                                    if (!err) {
                                        generatePreview(uploadDir, originalExt)
                                        .then((preview)=> {
                                            UploadCompleted = true;
                                            socket.emit('videoPreview', {'videoPreview' : preview });
                                        }, (err) => { 
                                            UploadCompleted = true;
                                            socket.emit('videoPreview', {'videoPreview' : 'null' });
                                            console.log('generatePreview error', err)
                                        })

                                        const type = canPlayTypeClient();

                                        initEncode(uploadDir, fileNoExt, originalExt, type).then(
                                            (initFile) => {
                                                var initFileArr = initFile.split('/'),
                                                initFileName    = initFileArr[initFileArr.length - 1]
                                                if( initFileName.split('.')[1] === 'mp4') {
                                                    createDASHGpac(uploadDir, fileNoExt, originalExt, null).then(
                                                        (manifest) => {
                                                            socket.emit('Manifest', {'manifest' : replaceAll(manifest, findInManifest, '') });
                                                        }, 
                                                        (err) => { console.log('createDASHGpac erroro :', err)}
                                                    )
                                                } else {
                                                    console.log('initFile for the uploaded file is not mp4')
                                                    createDASHWebm(uploadDir, fileNoExt, originalExt, 0).then(
                                                        (manifest) => {
                                                            console.log('callVideoGenerator was execured with with the currents code manifest', manifest)
                                                            socket.emit('Manifest', {'manifest' : replaceAll(manifest, findInManifest, '') });
                                                        },
                                                        (err) => { socket.emit('Manifest', {'manifest' : null });}
                                                    )
                                                }
                                            }, 
                                            (err) => {
                                                socket.emit('initEncodeErr', {'error': err})
                                            }
                                        )

                                        //after copy file in cache dir; process with news videoSize 
                                        var process = new ffmpeg(uploadDir + '/input.' + originalExt);
                                        process.then(
                                            (video) => {
                                                var duration = video.metadata.duration.seconds,
                                                    resolution = video.metadata.video.resolution,
                                                    timeAt   = hhmmss(duration/2) //get time format like 00:00:00
                                                //generate Video preview
                                                // console.log('video object ', video)
                                                // console.log('time at is ', timeAt)
                                                generatePoster(uploadDir, originalExt, timeAt)
                                                .then((image)=> {
                                                        UploadCompleted = true;
                                                        socket.emit('Done', {'Image' : image });
                                                    },
                                                    (err) => {
                                                        socket.emit('Done', {'Image' : null });
                                                    }
                                                )

                                                encodeVideosH264(uploadDir, fileNoExt, originalExt, resolution).then(
                                                    (nbResolution) => {
                                                        createDASHGpac(uploadDir, fileNoExt, originalExt, nbResolution).then(
                                                            (manifest) => {
                                                                socket.emit('Manifest', {'manifest' : replaceAll(manifest, findInManifest, '') });
                                                            }, 
                                                            (err) => { console.log('createDASHGpac error :', err)}
                                                        )
                                                    }, 
                                                    (err) => {
                                                        socket.emit('Manifest', {'manifest' : null });
                                                    }
                                                )

                                                encodeVideosVP9(uploadDir, fileNoExt, originalExt, resolution)
                                                .then(
                                                    (nbResolution) => {
                                                        createDASHWebm(uploadDir, fileNoExt, originalExt, nbResolution).then(
                                                            (manifest) => {
                                                                console.log('callVideoGenerator was execured with with the currents code manifest', manifest)
                                                                socket.emit('Manifest', {'manifest' : replaceAll(manifest, findInManifest, '') });
                                                            },
                                                            (err) => { socket.emit('Manifest', {'manifest' : null });}
                                                        )
                                                    }, 
                                                    (err) => {
                                                        console.log('error happens in callVideoGenerator ', err)
                                                        socket.emit('Manifest', {'manifest' : null });
                                                    }
                                                )
                                            }, 
                                            (err) => { console.log('Error: ' +err) }
                                        )                                                  
                                    } else {
                                        console.log(err);
                                    }
                                })                               
                            } catch (error) { 
                                console.log(error); 
                            }                                
                        });
                    })  
                });                                        
            });            
        }else if(Files[fileName]['Data'].length > 10485760 ) { //if data Buffer reaches 10MB
            fs.write(Files[fileName]['Handler'], Files[fileName]['Data'], null, 'Binary', function (error, Writen){
                Files[fileName]['Data'] = "";
                var Place   = Files[fileName]['Downloaded'],    //524288
                    Percent = (Files[fileName]['Downloaded'] / Files[fileName]['FileSize']) * 100;
                socket.emit('MoreData', {'Place' : Place, 'Percent' : Percent });
            });
        }else{
            var Place   = Files[fileName]['Downloaded'] / 524288,
                Percent = (Files[fileName]['Downloaded'] / Files[fileName]['FileSize']) * 100;
            socket.emit('MoreData', {'Place' : Place, 'Percent' : Percent });
        }
    });
    
    //handle client-side video remove action 
    socket.on('Remove', function(data){
        RemoveEvent         = true;
        var fileName            = data['fileName'],
            DocumentType    = data['DocumentType'],
            SsId            = data['SsId'],
            tmpDir          = './../../web/optube/cache/tmp/uploads/videos/' + SsId + '/' + DocumentType,
            cacheDir        = './../../web/optube/cache/uploads/videos/' + SsId + '/' + DocumentType;
        
        //test uploading progress
        if(!UploadEvent){
            try {
                fs.remove(cacheDir + '/' + fileName, function(err){
                    if (!err) {
                        socket.emit('Removed', { 'Statut' : 'success'});
                    }else{
                        console.error(err);
                    }
                });
            } catch (e) { console.log(e); }
        }else{            
//            try {
                
//                fs.remove(tmpDir + '/' + fileName, function(err){
//                    if (!err) {
//                        socket.emit('Removed', { 'Statut' : 'success'});
//                    }else{
//                        console.error(err);
//                    }
//                });
//            } catch (e) { console.log(e); }            
        }        
    });
});