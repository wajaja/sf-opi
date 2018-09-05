import React                   from 'react'
import createReactClass        from 'create-react-class'
import TaggableFaceImage       from './TaggableFaceImage'
import { connect }                  from 'react-redux'
import { fromJS }                   from 'immutable'
import { BASE_PATH }                from '../../config/api'
import { 
    Shares as SharesActions
}                                   from '../../actions'
import { Modal }                    from '../../components'


const ModalTagFriend  = createReactClass({

    getInitialState() {
        return {
            focus: false,
            isLoading: false,
            leftForm: '250px',
            leftLoading: '305px',
        }
    },
  
    handleOpenModal () {
        this.setState({ showModal: true });
    },
  
    closeModal () {
        this.props.closeModal()
    },

    componentWillMount() {
        const width = window.innerWidth,
        leftForm = ((width - 700) / 2) + 'px',
        leftLoading = ((width - 200) / 2) + 'px';
        ///////////
        
        this.setState({
            leftForm: leftForm,
            leftLoading: leftLoading,
        })
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
        const { src, imageId, isRequesting, user }  = this.props,
        { leftLoading, leftForm } = this.state;

        /////
        /////
        return (
            <Modal className="modal-share">
                <div>           
                    <div className="black-drop-dv" onClick={this.closeModalShare}></div>
                    <div className="mdl-container">
                        {isRequesting && 
                            <div className="loading-dv" 
                                style={{
                                    left: leftLoading,
                                    zIndex: 1
                                }}></div>
                        }
                        <div 
                            className="mdl-tg-frd" 
                            style={{
                                left: leftForm,
                                zIndex: 2
                            }}
                            >
                            <div className="share_form_header">
                                <span className="share_header_title">Tag Friends in photo</span>
                                <span className="opinion-modal-close" onClick={this.closeModalShare}>
                                    <i className="fa fa-times "></i>
                                </span>
                            </div> 
                            <div className="pst-shr-ctnr">
                                <div className="img-ctnr">
                                    {!isRequesting && 
                                        <TaggableFaceImage 
                                            src={src}
                                            friendTags={[]}
                                            imageId={imageId}
                                            />
                                    }
                                </div>

                                <div className="postShare-message">
                                    <div className="postShare-foo">
                                        <div className="shr-foo-rght">
                                            <button 
                                                className="btn btn-default btn-sm"
                                                onClick={this.handleCloseModal}>
                                                Close Modal
                                            </button>
                                        </div>                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
})

export default ModalTagFriend
