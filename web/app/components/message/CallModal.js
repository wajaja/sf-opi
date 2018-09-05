import React from 'react'
// import { connect } from 'react-redux'
import classnames       from 'classnames'
import { Modal, CallWrapper }     from '../../components'

import '../../styles/message/calls.scss'

class CallModal extends React.PureComponent{

	constructor(props) {
		super(props)
	}

	render() {
        // const { mode, cancel, dispatch, recipients }  = this.props
        
        /////
        return (
            <Modal className={classnames('call-modal', this.props.status)}>          
                <div className="black-drop-dv"></div>
            	<div className="mdl-container">
                    <div className="modal-call-hd">
                        <span className="opinion-modal-close" onClick={this.props.closeCallModal}>
                            <i className="fa fa-times "></i>
                        </span>
                        <div className="modal-call-bd">
                            <div className="modal-call-bd-a">
                                <CallWrapper {...this.props} />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default CallModal