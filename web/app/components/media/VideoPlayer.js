import React from 'react';
import createReactClass from 'create-react-class'
import { findDOMNode } from 'react-dom'

import 'video.js/dist/video-js.css'

const VideoPlayer  = createReactClass( {

    getInitialState(){
        return {
            playerReady: false
        }
    },

    progressMove(e) {
        if(typeof document === 'undefined') {
            return
        }
        if(typeof document !== 'undefined' && !document.createElement) {
            return
        }

        let progress     = e.target,
        img             =  document.createElement('img'),
        previewCtnr     = document.createElement('div'),
        imgWrapper      = document.createElement('div');

        previewCtnr.setAttribute('class', 'preview-vid-dv')
        imgWrapper.setAttribute('class', 'preview-vid-wrap')
        // previewCtnr.style.display = 'none'
        img.setAttribute('class', 'preview-vid-img')
        img.setAttribute('src', this.props.videoPreview)

        if(!progress.querySelector('.preview-vid-img')) {
            imgWrapper.appendChild(img)
            previewCtnr.appendChild(imgWrapper)
            progress.appendChild(previewCtnr)         // append preview container before checking for it's width
        }

        // imgWrapper.style.width = img.style.width / 40
        if(progress.querySelector('.preview-vid-img')) {
            const playerNode      = findDOMNode(this),
            imgWidth            = parseInt($(playerNode).find('.preview-vid-img').css('width'), 10),
            widthPerFrame       = imgWidth / 40,   // 40 refer to number captured in video
            progressWidth       = parseInt($(progress).css('width'), 10),
            progressWidthPerImg = progressWidth / 40,
            pointerPosition     = e.clientX - $(progress).offset().left,
            previewCtnrLeft     = widthPerFrame * pointerPosition;

            $(previewCtnr).css('right', - Number(pointerPosition) + 60)
            $(img).css('left', Math.floor(pointerPosition / progressWidthPerImg) * widthPerFrame)
        }
    },

    progressOut(e) {
        const progress = e.target,
        previewCtnr    = $(progress).find('.preview-vid-dv')[0];
        progress.removeChild(previewCtnr)
    },

    componentDidMount() {
        // instantiate Video.js
        const self = this;
        this.player = videojs(this.videoNode, {...this.props.options}, function onPlayerReady() {
            self.setState({playerReady: true})

            this.on('ended', () => {
                this.hasStarted(false)
            })
        });

        //control on seekBar for video preview
        this.player.controlBar.progressControl.seekBar.on('mouseout', this.progressOut) 
        this.player.controlBar.progressControl.seekBar.on('mousemove', this.progressMove)
    },

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    },

    componentWillUpdate(nextProps, nextState) {
        if(nextState.playerReady && this.props !== nextProps){
            const poster = findDOMNode(this).querySelector('.vjs-poster')
            this.player.poster(nextProps.poster);
            poster.style.display = 'block !important'; 
            poster.style.position = 'relative !important'; 
            poster.style.backgroundImage = `url(${nextProps.poster})`
        }
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.sources !== nextProps.sources)
            this.player.src(nextProps.sources.src);

        if(this.props.submittingPost && this.props.submittingPost !== nextProps.submittingPost) {
            this.player.stop(); //stop reading video when submitting
        }
    },

    // wrap the player in a div with a `data-vjs-player` attribute
    // so videojs won't create additional wrapper in the DOM
    // see https://github.com/videojs/video.js/pull/3856
    render() {
        const boxStyle = {
            width: '100%',
            height: '100%'
        }
        return (
            <div data-vjs-player style={boxStyle}  ref={el => this.playerCtnr = el}>
                <video ref={ node => this.videoNode = node } className="video-js"></video>
            </div>
        )
    }
})

export default VideoPlayer