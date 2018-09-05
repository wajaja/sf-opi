import _ from 'lodash';
import Emitter from './Emitter';

/**
 * Manage all media devices
 */
class MediaDevice extends Emitter {

    constructor(firebase) {
        super();

        this.hasUserMedia = this.hasUserMedia.bind(this);
    }

    /**
    * Start media devices and send stream
    */
    start(config) {
        const constraints = {
            video: config.video ? {
                facingMode: 'user',
                height: { min: 360, ideal: 720, max: 1080 }
            } : false,

            audio: true
        };

        //standardize
        if(this.hasUserMedia()) {
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                    this.stream = stream;
                    this.emit('stream', stream);
                })
                .catch((err) => {
                    console.log(err)
                });
        } else {
            console.log('no mediaDevices');
        }
        return this;
    }

    hasUserMedia() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        return !!navigator.getUserMedia;
    }

    /**
    * Turn on/off a device
    * @param {String} type - Type of the device
    * @param {Boolean} [on] - State of the device
    */
    toggle(type, on) {
        const len = arguments.length;
        if (this.stream) {
            this.stream[`get${type}Tracks`]().forEach((track) => {
                const state = len === 2 ? on : !track.enabled;
                _.set(track, 'enabled', state);
            });
        }
        return this;
    }

    /**
    * Stop all media track of devices
    */
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        return this;
    }
}

export default MediaDevice;
