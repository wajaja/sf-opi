import React                from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router-dom'
import createReactClass     from 'create-react-class'
import InputType            from './InputType'
import { 
    PostForm as PostFormActions 
}                           from '../../../../actions/social'

/**
*/
const BasicEditor  = createReactClass({
    
	getInitialState() {
        return {
            editorTexts: '',
            errors: {}
        }
    },

    //
    toggleEditor(EditorName, e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(PostFormActions.toggleEditor(EditorName));
    },

    openModalUserInfo(editor, e) {
        e.preventDefault();
    },

    removeEditor(editor, e) {
        const { dispatch } = this.props;
        e.preventDefault();       
        dispatch(PostFormActions.removeEditor(editor));
    },

	render() {
        const { user } = this.props;
        const self = this;
        const editorsNode = this.props.editors.map(function(editor, i) {
            return (
                <span key={i} className="gl-frm-bd-usr-li" data-username={editor.username}>
                    <a href="" className="lk-pic-thb-pfrm" onClick={self.openModalUserInfo.bind(self, editor)}>
                        <img src={editor.profilePic} className="pic-thb-pfrm" />
                    </a>
                    <a href="" className="rmv-pst-edtor" onClick={self.removeEditor.bind(self, editor)}>
                        <i className="fa fa-minus" aria-hidden="true"></i>
                    </a>
                </span>
            )
        })
        
        return (
            <div className="basic-dv-usrs in">
                <div className="pst-dv-usr-crtor">
                    <span className="gl-frm-bd-usr-li">
                        <Link to={user.username} className="lk-pic-thb-pfrm" >
                            <img src={user.profile_pic.web_path} className="pic-thb-pfrm" />
                        </Link>
                    </span>
                </div>
                <div className="gl-frm-bd-usr-ul">{editorsNode}</div>
                <span className="gl-frm-bd-usr-li">
                    {this.props.editors.length < 2 && 
                        <a 
                            href="" id="_editor" 
                            className={this.props.postFormFocus ? `lk-add-editor in` : `lk-add-editor out`} 
                            onClick={this.toggleEditor.bind(this, 'editor')}>
                            <i className="fa fa-user-plus" aria-hidden="true"></i>
                        </a>
                    }
                </span>
            </div>
		)
	}
})

export default connect(state => ({
    editors: state.PostForm.editors,
    typeName: state.PostForm.typeName,
    typeValue: state.PostForm.typeValue,
    currentEditor: state.PostForm.currentEditor,
    postFormFocus: state.App.postFormFocus
}))(BasicEditor)