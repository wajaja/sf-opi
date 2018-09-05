import React            from 'react'
import { connect }      from 'react-redux'
import { Link }         from 'react-router-dom'
import createReactClass from 'create-react-class'
import InputType        from './InputType'

import { 
    App as AppActions,
    PostForm as PostFormActions
}                       from '../../../../actions/social'

/**
*
*/
const OpinionEditor = createReactClass({

	getInitialState() {
        return {
            rightEditorTexts:'',
            leftEditorTexts:'',
            errors: {}
        }
    },

    toggleEditor(EditorName, e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(PostFormActions.toggleEditor(EditorName));
    },

    openModalUserInfo(editor, e) {
        e.preventDefault();
    },

    removeRightEditor(editor, e) {
        e.preventDefault();       
        const { dispatch } = this.props;
        dispatch(PostFormActions.removeRightEditor(editor));
    },

    removeLeftEditor(editor, e) {
        e.preventDefault();       
        const { dispatch } = this.props;
        dispatch(PostFormActions.removeLeftEditor(editor));
    },

	render() {
        const self = this;
        const { user } = this.props;
        const leftEditorsNode = this.props.leftEditors.map(function(editor, i) {
            return (
                <span key={i} className="gl-frm-bd-usr-li" data-username={editor.username}>
                    <div 
                        className="lk-pic-thb-pfrm" 
                        onClick={self.openModalUserInfo.bind(self, editor)}
                        >
                        <img 
                            src={editor.profile_pic.web_path} 
                            className="pic-thb-pfrm" 
                            />
                    </div>
                    <div className="rmv-pst-edtor" onClick={self.removeLeftEditor.bind(self, editor)}>
                        <i className="fa fa-minus" aria-hidden="true"></i>
                    </div>
                </span>
            )
        })
        const rightEditorsNode = this.props.rightEditors.map(function(editor, i) {
            return (
                <span key={i} className="gl-frm-bd-usr-li" data-username={editor.username}>
                    <div 
                        className="lk-pic-thb-pfrm" 
                        onClick={self.openModalUserInfo.bind(self, editor)}
                        >
                        <img src={editor.profilePic} className="pic-thb-pfrm" />
                    </div>
                    <div className="rmv-pst-edtor" onClick={self.removeRightEditor.bind(self, editor)}>
                        <i className="fa fa-minus" aria-hidden="true"></i>
                    </div>
                </span>
            )
        })
		return (
			<div className="opinion-dv-usrs">
                <div className="opinion-dv-usrs-lft">
                    <div 
                        className="gl-frm-bd-usr-ul" 
                        id="gl_frm_bd_usr_lft_ul">{leftEditorsNode}</div>
                    <span className="gl-frm-bd-usr-li-lft">
                        {this.props.leftEditors.length < 2 && 
                            <div id="_leftEditor" className={this.props.postFormFocus ? `lk-add-lft-editor in` : `lk-add-lft-editor out`} onClick={this.toggleEditor.bind(this, 'leftEditor')}>
                                <i className="fa fa-user-plus" aria-hidden="true"></i>
                            </div>
                        }
                    </span>
                </div>
                <div className="opinion-dv-usr-ntr">
                    <Link to={user.username} className="lk-pic-thb-pfrm">
                        <img src={user.profile_pic.web_path} className="pic-thb-pfrm"/>
                    </Link>
                </div>
                <div className="opinion-dv-usrs-rgt">
                    <span className="gl-frm-bd-usr-li-rgt">
                        {this.props.rightEditors.length < 2 &&  
                            <div 
                                id="_rightEditor"  
                                className={this.props.postFormFocus ? `lk-add-rgt-editor in` : `lk-add-rgt-editor out`} onClick={this.toggleEditor.bind(this, 'rightEditor')}>
                                <i className="fa fa-user-plus" aria-hidden="true"></i>
                            </div>
                        }
                    </span>
                    <div className="gl-frm-bd-usr-ul r" id="gl_frm_bd_usr_rgt_ul">{rightEditorsNode}</div>
                </div>  
            </div>
        )            
	}
})

export default connect(state => ({
    leftEditors: state.PostForm.leftEditors,
    rightEditors: state.PostForm.rightEditors,
    currentEditor: state.PostForm.currentEditor,
    postFormFocus: state.App.postFormFocus
}))(OpinionEditor);