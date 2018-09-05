import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link, Router }             from 'react-router-dom'
import { connect }                  from 'react-redux'
import * as axios                   from 'axios'

import bindFunctions                from '../../../utils/bindFunctions'
import { BASE_PATH }                from '../../../config/api'
import * as DraftFuncs              from '../../../components/social/home/form/DraftFuncs'
import { BuildContent }             from '../../../components/social' 
import { Images }                   from '../../../components/media'
import { Author }                   from '../../../components/post/avatars'
import { TimeAgo }                  from '../../../components/social/commons'
import { Modal }                    from '../../../components/social'

import { 
    Photos as PhotosActions
}                                   from '../../../actions/media'
import { 
    App as AppActions
}                                   from '../../../actions/media'

@connect(state => ({
    userId: state.User.user.id
}))
const Option  = createReactClass(  {

    getInitialState() {
        return {
            option: false
        }
    },

    getPost() {
        const self  = this;
        return axios.get(`${BASE_PATH}/api/posts/edit/${self.props.post.id}`);
    },

    handleEdit(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        if(!this.props.editingPost) {
            this.props.handleEdit(true);
            dispatch(AppActions.editPostFormFocus(true));
            dispatch(AppActions.editingPost(true));
        }
    },

    handleRemove(e) {
        e.preventDefault();
        this.props.handleRemove();
    },

    maskPost(e) {
        e.preventDefault();
        this.props.maskPost();
    },

    favoritePost(e) {
        e.preventDefault();
        this.props.favoritePost();
    },

    renderForAuthor() {
        return(
            <div className="pst-opt-ctnr-a">
                <div className="opt-rel-ctnr">
                    <i className="opt-arraw"><i></i></i>
                    <span className="pst-opt-ctnr-b">
                        <a href="" className="pst-opt-edit" data-pst-id={this.props.post.id} onClick={this.handleEdit}>
                            <span className="pst-opt-edit-ico">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-edit-txt"> Edit</span>
                        </a>
                        <a href="" className="pst-opt-remove" data-pst-id={this.props.post.id} onClick={this.handleRemove}>
                            <span className="pst-opt-remove-ico">
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-remove-txt">Trash</span>
                        </a>
                    </span>
               </div>
            </div>
        )
    },

    ///
    ///
    renderForUser() {
        return(
            <div className="pst-opt-ctnr-a">
               <div className="opt-rel-ctnr">
                    <i className="opt-arraw"><i></i></i>
                    <span className="pst-opt-ctnr-b">                                    
                        <a href="" className="pst-opt-mask" data-pst-id={this.props.post.id} onClick={this.maskPost}>
                            <span className="pst-opt-mask-ico">
                                <i className="fa fa-trash" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-mask-txt">Mask</span>
                        </a>
                        <a href="" className="pst-opt-favorite" data-pst-id={this.props.post.id} onClick={this.favoritePost}>
                            <span className="pst-opt-favorite-ico">
                                <i className="fa fa-star" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-favorite-txt">Favorite</span>
                        </a>
                    </span>
                </div>
            </div>
        )
    },

    ///
    ///
    render() {
        if(this.props.author.id === this.props.userId) {
            return this.renderForAuthor();
        } else {
            return this.renderForUser();
        }
    }
})


const Photo  = createReactClass( {

    getInitialState() {
        return {
            caption: '',
            hashtags: '',
            location: '',
            left: '100px',
            filename: 'Select Image',
            uploadState: 'Upload',
            disabledUploadState: false,
        }
    },

    /**
     * handleFileClick
     */
    handleFileClick() {
        document.getElementById('file').click()
    },

    /**
     * handleHashtagsChange
     * @param e event
     */
    handleHashtagsChange(e){
        this.setState({
            hashtags: e.target.value,
        })
    },

    /**
     * render
     * @returns markup
     */
    render() {
        const { left } = this.state;
        // const {}
        return (
            <Modal className="modal-photo">
                <div className="modal-ctnr">           
                    <div className="black-drop-dv" onClick={this.closeModal}></div>
                    <div className="container">
                        <div className="dv-ph-ctnr" style={{left: left}}>
                            <div className="ph_header">
                                <span className="close" onClick={this.closeModal}>
                                    <i className="fa fa-times "></i>
                                </span>
                            </div> 
                            <div className="ph-ctnr-a">
                                <div className="ph-ctnr-b">
                                    <div className="ph-rght">
                                        <div className="ph-rght-a"> 
                                            <div className="ph-rght-tp">
                                                <div className="ph-rght-tp-r">
                                                    <div className="tp-r-avatar">                  
                                                        <Author author={author} imgHeight={45} />                           
                                                   </div>
                                                    <div className="tp-r-name">
                                                       <Link className="pst-aut-nm" to={author.username}> 
                                                            {author.firstname} {author.lastname}
                                                       </Link>
                                                   </div>
                                                </div>
                                                <div className="ph-rght-tp-l">
                                                    <span className="dte-ctnr">
                                                        <TimeAgo timestamp={createdAt} />
                                                    </span>
                                                    <div className="img-opt">
                                                        <span className="img-opt-lk" onClick={this.toggleOption}>
                                                            <i className="fa fa-chevron-down" aria-hidden="true"></i>
                                                        </span>
                                                        {this.props.option && 
                                                            <Option 
                                                                post={this.props.post} 
                                                                toggleOption={this.toggleOption} 
                                                                handleEdit={this.handleEdit} 
                                                                editing={this.props.editing} 
                                                                handleRemove={this.handleRemove}
                                                                favoritePost={this.favoritePost}
                                                                maskPost={this.maskPost} 
                                                                author={author} />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ph-rght-mdl">
                                                <div className="mdl-ct">
                                                    <div className="mdl-ct-a">
                                                        <BuildContent content={content} />
                                                    </div>
                                                </div>
                                                <div className="mdl-img">
                                                    <img src={image.src} className="img-tg" />
                                                </div>
                                            </div>
                                            <div className="ph-rght-btm">
                                                <div className="pls-lks-act">
                                                    <div className="q-div">
                                                        <span className="sp-secret" onClick={this.toggleQuestion}>
                                                            <span className="glyphicon glyphicon-question-sign"></span>
                                                            <span className="txt">secret</span>
                                                        </span>
                                                        {userId == authorId && <span className="pst-qst-nb">{nbQuestioners}</span>}
                                                        {hasSecret && 
                                                            <span className="pst-qst-noti">
                                                                <i className="fa fa-circle" aria-hidden="true"></i>
                                                            </span>
                                                        }
                                                        {questionBox && 
                                                            <QuestionBox 
                                                                post={this.props.post}
                                                                placement={boxPlacement}
                                                                toggleQuestion={this.toggleQuestion} 
                                                                />
                                                            }
                                                    </div>
                                                    <div id="postShareDiv" className="postShareDiv">
                                                        <span className="postShare-icon-form" onClick={this.onShare.bind(this, id)}>
                                                            <i className="fa fa-share-alt"></i>
                                                            <span className="txt">share</span>
                                                        </span>                           
                                                    </div>
                                                    <LikeButton 
                                                        object={this.props.post} 
                                                        type="post" 
                                                        liked={liked} 
                                                        onLike={this.onLike} />
                                                </div>                                                                                                                     
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ph-lft">
                                        <div className="ph-lft-a">
                                            <div className="ph-lft-b">
                                                <div className="ph-lft-tp">
                                                    <div className="tp-pls">
                                                        <div className="pls-statistic">                                                                                                                        
                                                        </div>                                                                                                                                                                               
                                                    </div>                               
                                                </div>
                                                <div className="actties-ctnr">
                                                    <div className="actties-ctnr-a">
                                                        <div className="cmts-ctnr">
                                                            <div className="cmts-ctnr-a">
                                                            </div> 
                                                        </div>
                                                        <div className="frm-ctnr">
                                                            <div className="frm-ctnr-a">
                                                            </div> 
                                                        </div>  
                                                    </div>                               
                                                </div>                            
                                            </div>
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

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default connect(state => ({ 
    user: state.User.user 
}))(Photo)
