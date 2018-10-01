import React                   from 'react'
import createReactClass        from 'create-react-class'
import { connect }          from 'react-redux'
import { fromJS }                   from 'immutable'
import { BASE_PATH }                from '../../config/api'
import { Modal }                    from '../../components'

import { 
    Photo as PhotoAction
}                                   from '../../actions'


const ZoomImage  = createReactClass({

    getInitialState() {
        return {
            focus: false,
            isLoading: false,
        }
    },
  
    closeModal () {
        this.props.closeZoom()
    },

    componentDidMount() {
        window.document.addEventListener('click', this.handleDocClick, false);
    },

    handleDocClick(e) {     
        // if(!ReactDOM.findDOMNode(this.emojiButton).contains(e.target) && this.state.emoji) {
        //     this.toggleEmoji()
        // }
    },

    componentWillUnmount () {
        window.document.removeEventListener('click', this.handleDocClick, false);
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.showModal !== nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal})
        }
        if(this.props.isRequesting !== nextProps.isRequesting && !nextProps.isRequesting) {
            //animate opacity after prepreding data to news div container 
            console.log('animating modal box')
            const containers = window.document.getElementsByClassName("mdl-tg-frd");
            for (var i = 0; i < containers.length; i++) {
                if(!$(containers[i]).hasClass('in')) {
                    window.getComputedStyle(containers[i]).display;
                    containers[i].className += ' in';
                }
            }
        }
    },

    /////
    /////
    render() {
        const { src, imageId, isRequesting, user }  = this.props
        /////
        /////
        return (
            <Modal className="modal-share">
                <div>           
                    <div className="black-drop-dv" onClick={this.closeZoom}></div>
                    <div className="mdl-container">
                        {isRequesting && 
                            <div className="loading-dv" 
                                style={{
                                    zIndex: 1
                                }}></div>
                        }
                        <div 
                            className="mdl-tg-frd" 
                            style={{
                                zIndex: 2
                            }}
                            >
                            <div className="share_form_header">
                                <span className="opinion-modal-close" onClick={this.closeZoom}>
                                    <i className="fa fa-times"></i>
                                </span>
                            </div> 
                            <div className="img-ctnr">
                                {!isRequesting && 
                                    <img 
                                        id="img" 
                                        src={src} 
                                        className="img-tg" 
                                        onLoad={this.handleImageLoaded}
                                        ref={elm => this.imgRefs = elm } 
                                        onError={this.handleImageErrored}
                                        />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
})

function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, PhotoAction), dispatch)
}

export default connect(state =>({

}), mapDispatchToProps)(ZoomImage)
