import React                        from 'react'
import createReactClass             from 'create-react-class'
import { connect }                  from 'react-redux'
import ReactDOM, { findDOMNode }    from 'react-dom'
import bindFunctions                from '../../../../utils/bindFunctions'
import { Video }                    from '../../../../components'

import { 
    App as AppActions,
    Confidence as ConfidenceActions,
    VideoUploader as VideoUploaderActions
}                                   from '../../../../actions'
import { canUseDOM }                from '../../../../utils/executionEnvironment'

import InputType from './InputType'
import EmojiPicker from 'emojione-picker'
import '../../../../styles/emojibox.scss'

/**
 */
let selectedFile,
    fReader,
    socket = null,  
    Path = "http://opinion.com";

const VideoPreview  = createReactClass( {

    getInitialState() {
        return {
            frames: 1,
            width: 1,
        }
    },

    componentDidMount() {

    },

    render() {
        const { poster, manifest, videoPreview, available, submittingPost } = this.props
        return (
            <div className="video-preview-dv">
                {available && 
                    <Video 
                        poster={poster} 
                        manifest={manifest}
                        videoPreview={videoPreview}
                        submittingPost={submittingPost}
                        />
                }
                {!available && 
                    <div className="pster-ctnr">
                        <img src={poster} className="pster-img" />
                        <span className="await-vdeo"></span>
                    </div>
                }         
                
            </div>
        )
    }
})


////////
///////
const ProgressBar  = createReactClass({

    componentDidMount() {
        if (typeof(G_vmlCanvasManager) !== 'undefined') {
            G_vmlCanvasManager.initElement(canvas);
        }
    },

    componentDidUpdate(oldProps) {
        const self = this;
        if(this.props.percent != oldProps.percent) {
            //update progress
            const canvas    = ReactDOM.findDOMNode(this).querySelector("#ProgressBar"),
            ctx         = canvas.getContext('2d');
            ctx.fillStyle   = "#88d6ef";                  
            ctx.fillRect(0, 0, 208 * self.props.percent / 100, 5);

            var MBDone = Math.round(((self.props.percent / 100.0) * selectedFile.size) / 1048576);
            document.getElementById('MB').innerHTML  = MBDone;
        }
    },

    render() {
        return (
            <div id="progressContainer">
                <canvas id="ProgressBar"></canvas>
            </div>
        )
    }
})

const _VideoUploader  = createReactClass({

    canPlayType: {},

    getInitialState() {
        return {
            videoName: '',
            fileName: '',
            imageSource: '',
            percent: 0,
            preview: '',
            available: false,
            videoHeight: '250px',
            errors: {},
            videoSize: 0,
            videoOptionBox: true,
        }
    },

    onChange(e) {
        this.setState({[e.target.name]: e.target.value })
    },

    hideVideoOptionBox(e) {
        this.setState({videoOptionBox: false})
    },

    getCanPlayType () {
        const el = document.createElement && document.createElement('video');
        if(el.canPlayType) {
            this.canPlayType['mpeg'] = "" !== el.canPlayType('video/mp4; codecs="mp4v.20.8"')

            this.canPlayType['h264'] = "" !== el.canPlayType('video/mp4; codecs="avc1.42E01E"')
                                           || el.canPlayType('video/mp4; codecs="mp4a.40.2"')

            this.canPlayType['ogg']  = "" !== el.canPlayType('video/ogg; codecs="theora"')

            this.canPlayType['webm'] = "" !== el.canPlayType('video/webm; codecs="vp8, vp9, vorbis"')
        }
    },

    //function to ngenerate new string to rename file
    generateUUID() {
        let d = new Date().getTime();
        
        if (window.performance && typeof window.performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        
        let  uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            let r = ( d + Math.random() * 16 ) % 16 | 0;
                d = Math.floor(d/16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });    
        return uuid;
    },

    test() {
        console.log('this is the test method in videoUploader')
    },

    //start upload function
    startUpload(videoExtn) {
        const self = this,
        { dispatch } = this.props;
        if(document.getElementById('post_type_vid').value !== "") {
            fReader         = new FileReader();
            let SsId      = this.props.sessionId,
            fileName        = this.generateUUID() + '.' + videoExtn, /*** cancat generatedUUID with file extension */
            videoBox        = findDOMNode(this),
            videoName;

            if(videoBox.querySelector(".pst-nme-vid").value == '')
                videoName   = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
            else
                videoName = videoBox.querySelector(".pst-nme-vid").value

            self.setState({
                videoName: videoName,
                videoSize: Math.round(selectedFile.size / (1024 * 1024)) // value in MB
            });
            self.props.getVideoName(videoName);
            dispatch(VideoUploaderActions.setVideoName(fileName));
            dispatch(VideoUploaderActions.setState(true, false)); //(progress, success)
            
            //called every time it reads some data; emit data to server 
            fReader.onload = function (e) {
                console.log('starting upload socket EMit')
                socket.emit('Upload', {'fileName': fileName, 'SsId' : SsId, 'Data': e.target.result, 'DocumentType' : self.props.documentType });
            };

            //emit start event 
            socket.emit('Start', {
                'fileName': fileName, 
                'SsId' : SsId, 
                'Size': selectedFile.size, 
                'canPlayType' : self.canPlayType,
                'DocumentType' : self.props.documentType 
            });
        }else{
            alert('please Select a file');
        }
    },

    removeOrCancelVideo(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(AppActions.modalVideoConfirm(true));
    },

    componentWillMount() {

    },

    componentDidMount() {
        this.getCanPlayType();
        this.width       = findDOMNode(this).parentNode.offsetWidth;
        const self      = this,
        { dispatch }    = self.props,
        height          = this.width * (9 / 16),
        videoHeight     = height + 'px';
        this.setState({videoHeight: videoHeight})

        require.ensure([
            'socket.io-client',
        ], (require) => {
            const io = require('socket.io-client');
            socket = io.connect('http://:8081');

            socket.on('Removed', (data) => {
                dispatch(AppActions.formVideoPane(false));
            });

            socket.on('MoreData', (data) => {
                self.setState({percent: data['Percent']});
                let Place = data['Place'] * 524288,
                    NewFile; 
                if(selectedFile.webkitSlice){
                    newFile = selectedFile.webkitSlice(Place, Place + Math.min(524288, (selectedFile.size - Place)));
                }else if (selectedFile.mozSlice){
                    NewFile = selectedFile.mozSlice(Place, Place + Math.min(524288, (selectedFile.size - Place)));
                }else{
                    NewFile = selectedFile.slice(Place, Place + Math.min(524288, (selectedFile.size - Place)));
                }
                fReader.readAsBinaryString(NewFile);
            });

            socket.on('Done', (data) => {
                dispatch(VideoUploaderActions.setState(false, true)); //(progress, success)
                self.setState({
                    imageSource: Path + '/' + data['Image'],
                    percent: data['Percent'],
                });
            });

            socket.on('videoPreview', (data) => {
                self.setState({videoPreview: Path + '/' + data['videoPreview']});
            });

            socket.on('Manifest', (data) => {
                self.setState({
                    available: true,
                    manifest: Path + '/' + data['manifest']
                });
            })
        })
    },

    componentDidUpdate(oldProps) {
        const { dispatch } = this.props;
        if(this.props.videoPane != oldProps.videoPane && this.props.videoPane) {
            findDOMNode(this).querySelector(".vidNameArea").innerText = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
        }
        if(this.props.videoPane != oldProps.videoPane && !this.props.videoPane) {
            this.setState({
                videoName: '',
                fileName: '',
                imageSource: '',
                percent: 0,
            })
        }
        if(this.props.resseting != oldProps.resseting && this.props.resseting) {
            dispatch(AppActions.formVideoPane(false));
            this.setState({
                videoName: '',
                fileName: '',
                imageSource: '',
                percent: 0,
            })
        }
    },

    componentWillReceiveProps(nextProps){
        if(this.props.vUploader !== nextProps.vUploader && nextProps.vUploader) {
            this.startUpload(nextProps.videoExtn)
        }
    },

    componentWillUnmount() {
        socket && socket.removeListener('videoPreview', this.void);
        socket && socket.removeListener('MoreData', this.void);
        socket && socket.removeListener('Manifest', this.void);
        socket && socket.removeListener('Done', this.void);
    },

    void() {

    },

    render() {
        const self = this,
        { videoPane, videoUploadProgress,
          videoUploadSuccess, vUploader, submittingPost, 
        }                                       = this.props,
        { imageSource, videoPreview, available, 
            manifest, videoName, videoSize, 
            errors, videoHeight, videoOptionBox 
        }                                       = this.state,
        height = videoUploadSuccess ? videoHeight : null
            ////add pane for webcam record or file uploader choice
            ////VideoUploader

        return (
            <div 
                className={videoPane ? `video-upl-box in` : `video-upl-box out`} 
                ref={box => this.box = box}
                style={{height: height}} >
                {videoUploadSuccess &&  
                    <div className="video-area">
                        <VideoPreview 
                            poster={imageSource}
                            available={available}
                            manifest={manifest}
                            submittingPost={submittingPost}
                            videoPreview={videoPreview}
                            />
                    </div>
                }
                <div className="videoBox-container">
                    <div id="rmv_CclVideo" className="remove-upl-video" onClick={this.removeOrCancelVideo}>
                        {false && <div className="ico"></div>}
                        <span className="txt">{videoUploadProgress ? `cancel` : `remove`}</span>
                    </div> 
                    <div className="videoBox-a">
                        {videoUploadProgress && 
                            <div className="video-lding-dv">
                                <ProgressBar percent={this.state.percent} />
                                <div className="video-lding-ctnr"> 
                                    <span id="uploaded">
                                        <span id="MB"> 0 </span>/<span> {videoSize} MB</span>
                                    </span>
                                    <div className="ico"></div>
                                </div>
                            </div>                       
                        }                                                
                    </div>
                    {this.state.videoOptionBox &&
                        <div className="video-opt">
                            <div className="video-opt-a">
                                <div 
                                    className="remove-rname-box" 
                                    onClick={this.hideVideoOptionBox}>
                                    <div className="ico"></div>
                                </div> 
                                {!videoUploadSuccess && 
                                    <div id="videoOptNmCtnr" className="video-opt-nm-ctnr">
                                        <div className="video-text">
                                            <span className="vidNameArea" >{videoName}</span>
                                        </div>
                                    </div>
                                }
                                <InputType 
                                    error={errors.videoName}
                                    onChange={this.onChange}
                                    value={videoName}
                                    name= "videoName"
                                    placeholder=""
                                    customClassName="pst-nme-vid"
                                    />
                            </div>
                        </div>
                    }
                </div>
                {videoUploadSuccess && 
                    <div className="succ video-opt-nm-ctnr">
                        <div className="video-text">
                            <span className="vidNameArea" >{videoName}</span>
                        </div>
                    </div>
                }
            </div>
        )
    }
})
export const VideoUploader = connect(state => ({
    videoPane: state.App.videoPane,
    sessionId: state.App.sessionId,
    resseting: state.PostForm.resseting,
    videoExtn: state.VideoUploader.videoExtn,
    documentType: state.PostForm.typeValue,
    videoUploadSuccess: state.VideoUploader.success,
    videoUploadProgress: state.VideoUploader.progress
}))(_VideoUploader)


////////////////
//PostFootElement
const PostFootElement  = createReactClass({

    getInitialState() {
        return {
            errors: {},
            initialized: false,
        }
    },

    toggleEmoji() {
        this.props.toggleEmoji();
    },

    toggleParticipantInput(e) {
        e.preventDefault();
        const partBtn = e.target;
        const selectRecip = $(partBtn).parents('.postform').find('.pst-select-recip');
        selectRecip.toggleClass('pst-select-hide');
    },

    togglePlaceInput(e) {
        e.preventDefault();
        this.props.togglePlaceInput();
    },

    handleDocClick(e) {
        const { dispatch } = this.props;   
        if(ReactDOM.findDOMNode(this).contains(e.target)) {
        }
        else {
            dispatch(AppActions.confidPane(false))
        }
    },

    toggleVideoUploaderOption() {
        this.props.toggleVideoUploaderOption()
    },

    handleVideoUploaderBtn () {
        this.toggleVideoUploaderOption()
    },

    insertEmoji(data) {
        this.props.insertEmoji(data)
        this.toggleEmoji();
    },

    ///////when the video's chosen
    fileChosen(e) {
        selectedFile        = e.target.files[0];
        const { dispatch }  = this.props,
        videoExtn           = selectedFile.name.substring(selectedFile.name.lastIndexOf('.') + 1).toLowerCase();  //get video extension
        dispatch(VideoUploaderActions.setVideoExtension(videoExtn)); //set video extension before toggle video Pane
        dispatch(AppActions.formVideoPane(true));
        this.props.handleVideoUploader();
        this.props.toggleVideoUploaderOption();
    },

    initialize () {
        // require.ensure([
        //     'socket.io-client',
        // ], (require) => {
        //     const io = require('socket.io-client');
        //     socket = io.connect('http://:8081');
        // })

        document.addEventListener('click', this.handleDocClick, false);
        this.setState({
            initialized: true,
        })
    },
    
    componentWillMount () {
        if(canUseDOM) {
            this.initialize();
        }
    },

    componentDidMount() {
        if(!socket) {
            this.initialize();
        }
    },

    componentWillUnmount () {
        document.removeEventListener('click', this.handleDocClick, false);
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.initialized     !== nextState.initialized ||
            this.props.videoPane           !== nextProps.videoPane ||
            this.props.videoUploadSuccess  !== nextProps.videoUploadSuccess || 
            this.props.videoUploadProgress !== nextProps.videoUploadProgress || 
            this.props.submittingPost      !== nextProps.submittingPost ||
            this.props.form_focus          !== nextProps.form_focus ||
            this.props.videoUploaderOption !== nextProps.videoUploaderOption);
    },

	render() {
        const { footType, EmojiSelect, form_focus, videoUploaderOption } = this.props;
        
        if(footType === 'videoForm'){
            return(
                <div className="gl-frm-btm-li-post-l">
                    <div className="gl-frm-btm-li-post-l-a">
                        <div className="frm-group-video-dv item deg135">
                            <div className={videoUploaderOption ? `video-upl-option in` : `video-upl-option out`}>
                                <div className="camera-rec-zone">
                                    <div className="camera-rec-ico"></div>
                                    <span className="camera-rec-txt">From camera</span>
                                </div>
                                <div className="upl-vid-zone">
                                    <div className="video-opt-str-btn-ctnr">
                                        <div className="ico"></div>
                                        <input 
                                            type="file" 
                                            id="post_type_vid" 
                                            className="pst-inp-vid" 
                                            onChange={this.fileChosen}/>
                                        <label htmlFor="post_type_vid">Select Video</label>
                                    </div>
                                </div>
                            </div>
                            <span className="frm-group-btn-vdeo" onClick={this.handleVideoUploaderBtn}></span>
                        </div>
                    </div>
                </div>
            )
        }


        return (
			<div className={!!form_focus ? `gl-frm-btm-li-post-l show-dv` : `gl-frm-btm-li-post-l`}>
                <div className="gl-frm-btm-li-post-l-a">
                    {this.state.initialized && this.props.fileInput}
                    {this.props.footType !== 'addPostForm' &&
                        <div className="frm-group-video-dv item deg135">
                            <div className={videoUploaderOption ? `video-upl-option in` : `video-upl-option out`}>
                                <div className="camera-rec-zone">
                                    <div className="camera-rec-ico"></div>
                                    <span className="camera-rec-txt">From camera</span>
                                </div>
                                <div className="upl-vid-zone">
                                    <div className="video-opt-str-btn-ctnr">
                                        <div className="ico"></div>
                                        <input 
                                            type="file" 
                                            id="post_type_vid" 
                                            className="pst-inp-vid" 
                                            onChange={this.fileChosen}/>
                                        <label htmlFor="post_type_vid">Select Video</label>
                                    </div>
                                </div>
                            </div>
                            <span className="frm-group-btn-vdeo" onClick={this.handleVideoUploaderBtn}></span>
                        </div>
                    }
                    <div 
                        className={footType === 'postForm' ? `emoji-dv pst-form item deg45` : `emoji-dv set-pst-form item deg45`}
                        ref={(el)=> {this.emojiDiv = el}}
                        >
                        {this.state.initialized && <EmojiSelect />}
                    </div>
                    {footType == 'postForm' && 
                        <div className="frm-group-btn-partic item center">
                            <div className="ico" onClick={this.toggleParticipantInput}></div>
                        </div>
                    }
                    <div className="frm-group-btn-place item deg315">
                        <div className="ico" onClick={this.togglePlaceInput}></div>
                    </div>
                </div>
            </div>
		)
	}
})

/////////
export default connect(state => ({
    confidPane: state.App.confidPane,
    confidenceValue: state.Confidence.confidenceValue,
    confindenceName: state.Confidence.confindenceName,
    videoUploadSuccess: state.VideoUploader.success,
    videoUploadProgress: state.VideoUploader.progress
}))(PostFootElement);