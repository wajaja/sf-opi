import React                    from 'react'
import createReactClass         from 'create-react-class'
import { connect }              from 'react-redux'

import { 
    App as AppActions,
    VideoUploader as VideoUploaderActions
}                                   from '../../../actions/social'

import { canUseDOM }                from '../../../utils/executionEnvironment'

let socket = null,
    Path = "http://opinion.com";

const ModalVideoConfirm  = createReactClass({
    //
    no() {
        this.hide();
    },

    yes() {
        if(this.props.progress) {
            this.cancelVideoUpload();
            this.hide();
        }

        if(!this.props.progress && !this.props.success) {
            //this.removeChoosenVideo();
            this.hide();
        }

        if(this.props.success) {
            this.removeUploadedVideo();
            this.hide();
        }
    },

    hide() {
        const { dispatch } = this.props;
        dispatch(AppActions.modalVideoConfirm(false))
    },

    //cancel upload function
    cancelUpload(e){
        UploadEvent = false;
        console.log('video canceled');
    },

    cancelVideoUpload() {
        const { dispatch } = this.props;
        const self = this;
        dispatch(VideoUploaderActions.setState(false, false));
        dispatch(AppActions.formVideoPane(false));
        document.getElementById('post_type_vid').value = "";
        socket.removeListener("MoreData", self.cancelUpload);
        socket.emit('Remove', {'Name': this.props.name, 'SsId' : self.props.sessionId, 'DocumentType' : self.props.documentType });
    },

    removeUploadedVideo() {
        const { dispatch } = this.props;
        const self = this;
        dispatch(VideoUploaderActions.setState(false, false));
        dispatch(AppActions.formVideoPane(false));
        document.getElementById('post_type_vid').value = "";
        socket.removeListener("MoreData", self.cancelUpload);
        socket.emit('Remove', {'Name': self.props.name, 'SsId' : self.props.sessionId, 'DocumentType' : self.props.documentType });
    },

    initialize () {
        require.ensure(['socket.io-client'], (require) => {
            const io = require('socket.io-client');
            socket = io.connect('http://:8081')
        })
    },

    componentWillMount() {
        if(canUseDOM) {
            this.initialize();
        }
    },

    componentDidMount() {
        if(!socket) {
            this.initialize();
        }
        const winWidth = window.innerWidth;
        const dialogBox  = document.getElementById('pst_dialog_box');
        dialogBox.style.left = ((winWidth/2) - (300/2)) + "px";
    },

    render() {
        return (
            <div>
                <div className={this.props.modalVideoConfirm ? `pst-dialog-overlay active` : `pst-dialog-overlay`} id="pst_dialog_overlay"></div>
                <div className={this.props.modalVideoConfirm ? `pst-dialog-box active` : `pst-dialog-box`} id="pst_dialog_box">
                    <div>
                        <div className="pst-dialog-box-head" id="pst_dialog_box_head"></div>
                        <div className="pst-dialog-box-body" id="pst_dialog_box_body">
                            {this.props.progress ? `Cancel Uploading... ?` : ``}
                            {this.props.success ? `remove Uploaded... ?` : ``}
                        </div>
                        <div className="pst-dialog-box-foot" id="pst_dialog_box_foot">
                            <div>
                                <button onClick={this.yes} className="confirm-action">Confirm</button>
                                <button onClick={this.no} className="confirm-cancel">Cancel</button>
                            </div>                                   
                        </div>
                    </div>       
                </div>
            </div>
        )
    }
})

export default connect(state => ({
    modalVideoConfirm: state.App.modalVideoConfirm,
    progress: state.VideoUploader.progress,
    name: state.VideoUploader.videoName,
    success: state.VideoUploader.success,
    documentType: state.PostForm.typeValue,
    sessionId: state.App.sessionId
}))(ModalVideoConfirm)