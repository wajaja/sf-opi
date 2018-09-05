import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'

const io = require('socket.io-client')

import InputType from './InputType'

import { 
    App as AppActions,
    VideoUploader as VideoUploaderActions
} from '../../../../actions/social'

/**
* @videoPreview 
* jQuery plugin that allow to preview the uploaded video
*/
(function($) {
    $.fn.videoPreview = function(options) {
        return this.each(function() {
            var elm = $(this);
            var frames = parseFloat(elm.data('frames'));

            var img = $('<img/>', { 'src': elm.data('source') }).hide().css({
                'position': 'absolute', 'cursor': 'pointer'
            }).appendTo(elm);
            var slider = $('<div/>').hide().css({
                'width': '2px', 'height': '100%', 'background': '#ddd', 'position': 'absolute',
                'z-index': '1', 'top': '0', 'opacity': 0.6, 'cursor': 'pointer'
            }).appendTo(elm);

            var width;

            function defaultPos() {
                //img.css('left', -width * frames / 4);
                img.css('left', -width * frames / 4);
            }

            img.load(function() { // we need to know video's full width
                $(this).show();
                width = this.width / frames;
                elm.css('width', width);
                defaultPos();
            });
            elm.mousemove(function(e) {
                var left = e.clientX - elm.offset().left; // position inside the wrapper
                slider.show().css('left', left - 1); // -1 because it's 2px width
                img.css('left', -Math.floor((left / width) * frames) * width);
            }).mouseout(function(e) {
                slider.hide();
                defaultPos();
            });
            elm.click(function(e){                        //prevent click events 
                e.preventDefault();
            })
        });
    };
})(jQuery);

/**
 */
let socket = io.connect('http://:8081'),
    Path = "http://opinion.com";

const ProgressBar  = createReactClass( {

    getInitialState() {
        return {
        }
    },

    componentDidMount() {
        if (typeof(G_vmlCanvasManager) !== 'undefined') {
            G_vmlCanvasManager.initElement(canvas);
        }
        const canvas = ReactDOM.findDOMNode(this).querySelector("#ProgressBar");
        var ctx = canvas.getContext('2d');
            ctx.fillStyle = "#88d6ef";                  
            ctx.fillRect(0, 0, 208 * this.props.percent / 100, 5);
    },

    render() {
        return (
            <div id="progressContainer">
                <canvas id="ProgressBar"></canvas>
            </div>
        )
    }
})

const VideoUploader  = createReactClass( {

	getInitialState() {
		return {
            videoName: '',
            Name: '',
            percent: 0,
            errors: {}
        }
    },

    //
    getFileReader() {
        return new FileReader();
    },

    onChange(e) {
        this.setState({[e.target.name]: e.target.value })
    },

    //function to ngenerate new string to rename file
    generateUUID() {
        var d = new Date().getTime();
        
        if (window.performance && typeof window.performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        
        var  uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            var r = ( d + Math.random() * 16 ) % 16 | 0;
                d = Math.floor(d/16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });    
        return uuid;
    },

    //start upload function
    startUpload() {
        const { dispatch } = this.props;
        if(document.getElementById('post_type_vid').value !== ""){
            const SsId = this.props.sessionId;
            const Name = this.generateUUID() + '.' + this.props.videoExtn; /*** cancat generatedUUID with file extension */
            const selectedFile = this.props.selectedFile;
            dispatch(VideoUploaderActions.setVideoName(Name));
            dispatch(VideoUploaderActions.setState(true, false)); //(progress, success)
            this.setState({Name: Name})
            var videoBox            = document.getElementById("videoBox"),
                videoOpt            = videoBox.querySelector("#videoOpt"),
                videoBoxA           = videoBox.querySelector(".videoBox-a"),
                videoArea           = videoBox.querySelector('#videoArea'),
                videoText           = videoBox.querySelector('#videoText'),
                removeBtn           = videoBox.querySelector('#rmv_CclVideo'),
                progressContainer   = videoBox.querySelector("#progressContainer");
            
            videoArea.innertText = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
            
            //called every time it reads some data; emit data to server 
            this.getFileReader().onload = function (e) {
                socket.emit('Upload', {'Name': Name, 'SsId' : SsId, 'Data': e.target.result, 'DocumentType' : this.props.documentType });
            };

            //emit start event 
            socket.emit('Start', {'Name': Name, 'SsId' : SsId, 'Size': selectedFile.size, 'DocumentType' : DocumentType });
        }else{
            alert('please Select a file');
        }
    },

    updateBar(percent) {
        var MBDone = Math.round(((percent / 100.0) * selectedFile.size) / 1048576);
        document.getElementById('MB').innerHTML  = MBDone;
    },

    removeOrCancelVideo(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(AppActions.modalVideoConfirm(true));
    },

    componentDidMount() {
        const self = this;
        const { dispatch } = self.props;
        const selectedFile = self.props.selectedFile;
        //success to remove file from node server
        socket.on('Removed', function(data){
            var videoBox = document.getElementById('videoBox');
        });

        socket.on('MoreData', function(data){
            var Place = data['Place'] * 524288,
                NewFile; 
            if(selectedFile.webkitSlice){
                newFile = selectedFile.webkitSlice(Place, Place + Math.min(524288, (selectedFile.size - Place)));
            }else if (selectedFile.mozSlice){
                NewFile = selectedFile.mozSlice(Place, Place + Math.min(524288, (selectedFile.size - Place)));
            }else{
                NewFile = selectedFile.slice(Place, Place + Math.min(524288, (selectedFile.size - Place)));
            }
            self.getFileReader().readAsBinaryString(NewFile);
        });

        socket.on('Done', function(data){
            dispatch(VideoUploaderActions.setState(false, true)); //(progress, success)
            var videoBox            = document.getElementById("videoBox"),
                videoOpt            = videoBox.querySelector("#videoOpt"),
                videoBoxA           = videoBox.querySelector(".videoBox-a"),
                videoArea           = videoBox.querySelector('#videoArea'),
                removeBtn           = videoBox.querySelector('#rmv_CclVideo'),
                canvas              = document.createElement("canvas"),
                videoText           = videoBox.querySelector('#videoText'),
                videoPreview        = videoBox.querySelector(".video-preview"),
                progressContainer   = videoBox.querySelector("#progressContainer"),
                videoSize = Math.round(selectedFile.size / 1048576),
                videoName = videoBox.querySelector("").value;

            self.setState({videoName: videoName, videoSize: videoSize});
            
            
            videoOpt.style.display = "none"; 
            progressContainer.style.display = "none";                        // hide progressBar
            removeBtn.style.display = "inline-block";
            var videoBox = document.getElementById("videoBox"),                                                                 
                inputNameValue = videoBox.querySelector("#post_type_videoName").value;
            videoPreview.setAttribute("data-source", Path + '/' + data['Image']);   
            
            var videoArea = document.getElementById('videoArea');
            videoText.innerHTML = content; 

           
            $('.video-preview').videoPreview();
        });
    },

    componentWillMount() {
        /* add page load event before StartUpload function call */
    },

	render() {
		return (
			<div id="videoBox" className={this.props.videoPane ? `videoBox in` : `videoBox out`} >                
                {this.props.videoUploadProgress && <ProgressBar percent={this.state.percent} /> } 
                <div className="videoBox-container">
                    <div className="videoBox-a">                        
                        <a href="" id="rmv_CclVideo" className="remove-video" onClick={this.removeOrCancelVideo}>
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </a>
                        <span className="video-opt-str-btn-ctnr">
                            <button type="button" id="upload_pst_video" className="upload-video" onClick={this.startUpload}>
                                <i className="fa fa-upload" aria-hidden="true"></i>Upload
                            </button>
                        </span>
                        <div id="videoArea" className="video-area">
                            <a href="" target="_blank" className="video-preview" data-frames="33" data-source=""></a>
                        </div>                                               
                    </div>
                    <div id="videoText" className="video-text">
                        <span id="vidNameArea" >{this.state.videoName}</span>
                        <span id="uploaded"><span id="MB"> 0 </span>/{this.state.videoSize} MB</span>
                    </div>
                </div>
                <div id="videoOpt" className="video-opt">
                    <span id="videoOptNmCtnr" className="video-opt-nm-ctnr">
                        <InputType 
                            error={this.state.errors.videoName}
                            onChange={this.onChange}
                            value={this.state.videoName}
                            name= "videoName"
                            placeholder=""
                            customClassName="pst-nme-vid"
                            />
                    </span>
                </div>
            </div>
		)
	}
})