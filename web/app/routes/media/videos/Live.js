import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link, withRouter }             from 'react-router-dom'
import { connect }                  from 'react-redux'
import classnames                   from 'classnames'
import * as axios                   from 'axios'
import _                            from 'lodash'

import bindFunctions                from '../../../../utils/bindFunctions'
import { getUrlParameterByName }    from '../../../../utils/funcs'
import { BASE_PATH }                from '../../../../config/api'
import * as DraftFuncs              from '../../../../components/social/home/form/DraftFuncs'
import { BuildContent, LikeButton, 
         Author, TimeAgo,
         Modal }                    from '../../../../components' 
import { PictureComments,
         PictureSecrets,
         PictureLikes }             from '../components'

import { 
    Questions as QuestionsActions,
    Responses as ResponsesActions,
    Authors as AuthorsActions,
    Photos as PhotosActions,
    Photo as PhotoActions,
    App as AppActions
}                                   from '../../../../actions'


const _Option  = createReactClass({

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
                        <a href="" className="pst-opt-favorite" onClick={this.favoritePost}>
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

const Option = connect(state => ({
    userId: state.User.user.id
}))(_Option)


const Photo  = createReactClass({

    /**
     * state
     * @type {{caption: string, hashtags: string, location: string, filename: string, uploadState: string, disabledUploadState: boolean}}
     */
    getInitialState() {
        return {
            photo: {},
            comments: [],
            left: '100px',
            width: '800px',
            height: '400px',
            secretView: '',
            loadingSecret: true,
            secretAlreadySeen: false,
            showLikes: false,
            photoCtnr: '450px',
            halfHeight: '250px',
            showComments: true,
            questionBox: false,
            showSecrets: false,
            questionId: undefined,
            boxPlacement: 'bottom',
            selected_activity: 'comment',
        }
    },

    commentEdited () {
        this.setState({editingComment: false})
    },

    onLike () {
        this.props.onLike();
    },

    onShare(postId, e) {
        e.preventDefault();
        this.props.onShare(postId, 'photo');
    },

    toggleQuestion(e) {
        const self  = this,
        { post }    = this.props;
        this.setState({questionBox: !self.state.questionBox})
    },

    goPrev () {
        const { dispatch, router, params }  = this.props,
            { photo: {imagesIds, id, postValid} } = this.state,
            index = _.findIndex(imagesIds, imgId => imgId === id);

        if(index === 0) {
            console.log('null')
            return //dispatch(AppActions.noMoreAllies('first'));
        }
        
        const prevId = imagesIds[index - 1],
        route = `/pictures/${prevId}?post_id=${postValid}`;
        router.replace(route)
    },

    goNext () {
        const { dispatch, router, params }  = this.props,
            { photo: {imagesIds, id, postValid} } = this.state,
            index = _.findIndex(imagesIds, imgId => imgId === id);
            console.log(index)

        if(imagesIds.length < index) {
            console.log('null')
            return //dispatch(AppActions.noMoreAllies('first'));
        }

        const nextId = imagesIds[index + 1],
        route = `/pictures/${nextId}?post_id=${postValid}`;
        router.replace(route)
    },

    closeModal(e) {
        e.preventDefault();
        const { status, router, dispatch } = this.props
        dispatch(PhotoActions.closeModal())
        router.goBack();
    },

    /**
     * handleChange
     * @param e event
     */
    handleChange(e) {

        e.preventDefault()

        let reader = new FileReader(),
            file   = e.target.files[0]

        this.setState({ filename: file.name })

    },

    onShare(photoId) {
        console.log('share picture')
    },

    onLike () {
        // this.setState({
        //     showComments: false,
        //     showSecrets: false,
        //     showLikes: true,
        //     selected_activity: 'like'
        // })
    },

    loadQuestions(postId) {
        // const self = this, { dispatch } = this.props;
        // if(!this.state.secretAlreadySeen) {               
            
        //     .then(function (res) {
        //         const questions = res.data.questions;
        //         if(questions) {
        //             self.setState({
        //                 loadingSecret: false,
        //                 questions: questions
        //             })
        //             _.each(questions, function(question) {
        //                 dispatch(QuestionsActions.pushQuestion(question))
        //             })
        //         } else {
        //             self.setState({
        //                 loadingSecret: false,
        //                 questions: [],
        //             })
        //         }
        //         self.changeView('questions')
        //         self.changeQuestionId(null)
                
        //     }, function(err) {
        //         if(err.response) {
        //         console.log(err.response.data); 
        //             console.log(err.response.status);
        //             console.log(err.response.headers);              
        //         } else if(err.request) {
        //             console.log(err.request);
        //         } else {
        //             console.log(err.message);
        //         }
        //         console.log(err.config);
        //     })
        // }
    },

    loadUserResponses(postId) {
        // const self = this,
        // { photo : { hasSecret }, dispatch } = this.props;
        // if(hasSecret && !this.state.secretAlreadySeen) {
        //     axios.get(`${BASE_PATH}/api/questions/find`, { 
        //         params : {
        //             postId: postId,
        //             refer: 'photo'
        //         }
        //     }).then(function (res) {
        //         const question = res.data.question,
        //             responses  = res.data.responses;
        //         if(question) {
        //             self.setState({
        //                 loadingSecret: false,
        //                 questionId: question.id,
        //             })
        //             dispatch(QuestionsActions.pushQuestion(question));
        //             _.each(responses, function(response) {
        //                 dispatch(ResponsesActions.pushResponse(response));
        //                 dispatch(AuthorsActions.pushAuthor(response.author))
        //             })
        //             self.changeQuestionId(question.id)
        //         } else {
        //             self.setState({
        //                 loadingSecret: false,
        //                 questionId: null,
        //             })
        //             self.changeQuestionId(null)
        //         }
        //     }, function(err) {
        //         if(err.response) {
        //         console.log(err.response.data); 
        //             console.log(err.response.status);
        //             console.log(err.response.headers);              
        //         } else if(err.request) {
        //             console.log(err.request);
        //         } else {
        //             console.log(err.message);
        //         }
        //         console.log(err.config);
        //     })
        // } else {
        //     self.setState({
        //         loadingSecret: false,
        //         questionId: null
        //     })
        //     self.changeQuestionId(question.id)
        // }   
        // self.changeView('responses')
    },

    showSecrets(e) {
        const { photo : { author }, } = this.state,
              {  user, dispatch }        = this.props,
            postId   = this.state.photo.id,
            authorId = author.id;
        if(authorId == user.id) {
            dispatch(QuestionsActions.loadQuestions(postId, 'photo'))
        } else {
            dispatch(ResponsesActions.findQuestionForUser(postId, 'photo'))
        }

        this.setState({
            showComments: false,
            showSecrets: true,
            showLikes: false,
            selected_activity: 'secret',
        })
    },

    changeView(view) {
        this.setState({secretView: view})
    },

    changeQuestionId(id) {
        this.setState({questionId: id})
    },

    renderComments(e) {
        this.setState({
            showComments: true,
            showSecrets: false,
            showLikes: false,
            selected_activity: 'comment'
        })
    },

    componentWillMount() {
        const { photosStore, params: {id}} = this.props,
        photo = photosStore.filter((p, i) => {
                                for(var prop in p) {
                                    return p[prop].id === id 
                                }
                            }).map((p, i) => {
                                for(var prop in p) {
                                    return p[prop];
                                }
                            })[0] || {};

        this.setState({
            photo: photo
        })
    },

    componentDidMount() {
        //next images in this post
        //perform ajax request for getting next photo id on this one
        const { dispatch, params, location: {query, pathname } } = this.props,
        loading     = false,
        postId      = params.id,
        status      = { modal: true, returnTo: pathname },
        winWidth    = window.innerWidth,
        winHeight   = window.innerHeight,
        width       = (winWidth - (60 * 2)) + 'px',
        height      = (winHeight - (25 * 2)) + 'px',
        photoCtnr   = ((winWidth - (60 * 2)) - 360) + 'px',
        halfHeight  = ((winHeight - (25 * 2)) / 2) + 'px';

        // dispatch(PhotoActions.modalPhoto(params, query, status, loading))

        const comments = this.props.commentsStore
        .filter(function(comment, i) {
            for(var prop in comment) {
                return comment[prop].postValid === postId 
                        && comment[prop].refer === 'photo';
            }
        })
        .map(function(comment, i) {
            for(var prop in comment) {
                return comment[prop];
            }
        })
        .sort(function compare(a, b) {
            if (a.createdAt < b.createdAt)
                return -1;
            if (a.createdAt > b.createdAt)
                return 1;
            return 0;
        })

        this.setState({
            width: width,
            height: height,
            photoCtnr: photoCtnr,
            halfHeight: halfHeight,
            comments: comments
        })
    },

    componentWillUpdate(nextProps, nextState) {
        if(this.props.params.id !== nextProps.params.id) {
            //
        }
    },

    componentWillReceiveProps(nextProps) {
        const { params: {id}, photosStore, 
            location: {query: {post_id}}, 
            dispatch, commentsStore}        = nextProps
        if( id !== this.props.params.id || photosStore != this.state.photosStore) {
            const photo = photosStore.filter((p, i) => {
                                for(var prop in p) {
                                    return p[prop].id === id 
                                }
                            }).map((p, i) => {
                                for(var prop in p) {
                                    return p[prop];
                                }
                            })[0] || {}
            if(!photo.id) return dispatch(PhotoActions.load(id, post_id));
           
            this.setState({photo: photo})
        }

        if(commentsStore != this.props.commentsStore) {
            const comments = commentsStore.filter((c, i) => {
                                for(var prop in c) {
                                    return c[prop].postValid  === id && 
                                           c[prop].refer      === 'photo';
                                }
                            }).map((c, i) => {
                                for(var prop in c) {
                                    return c[prop];
                                }
                            }).sort((a, b) => {
                                if (a.createdAt < b.createdAt)
                                    return -1;
                                if (a.createdAt > b.createdAt)
                                    return 1;
                                return 0;
                            })
            this.setState({comments: _.uniqBy(comments, 'id')})
        }
    },

    /**
     * render
     * @returns markup
     */
    render() {
        const { questionBox,
	         selected_activity, showSecrets, questionId,
	         showLikes, showComments, comments, secretView, 
	         secretAlreadySeen, questions, loadingSecret,
	         photo:{ id, content, postValid, createdAt, 
	         	updatedAt, updated, nbLikers, nbQuestioners,
	            author, liked, nbComments, webPath, hasSecret, 
	        } 
	    }   			= this.state,

        { 
        	user, left, width, 
        	photoCtnr, halfHeight, height, 
     	} 				= this.props;
        return (
            <Modal className="o-modal photo"> 
                <div className="modal-ctnr">
                    <div className="black-drop-dv" onClick={this.closeModal}></div>
                    <div className="container" style={{width: width, height: height}}>
                        <div className="dv-ph-ctnr" >
                            <div className="ph_header">
                                <span className="ph-close" onClick={this.closeModal}>
                                    <i className="fa fa-times "></i>
                                </span>
                            </div> 
                            <div className="ph-ctnr-a">
                                <div className="ph-ctnr-b">
                                    <div className="ph-lft" style={{width: photoCtnr}}>
                                        <div className="ph-lft-a"> 
                                            {id === this.props.params.id &&
                                                <div className="ph-lft-tp">
                                                    <div className="ph-lft-tp-r">
                                                        <div className="tp-r-avatar">                  
                                                            <Author.Photo author={author} imgHeight={40} />                           
                                                       </div>
                                                        <div className="tp-r-name">
                                                            <Author.Name author={author} className="pst-aut-nm" /> 
                                                       </div>
                                                    </div>
                                                    <div className="ph-lft-tp-l">
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
                                            }
                                            <div className="ph-rght-mdl">
                                                {id === this.props.params.id &&
                                                    <div className="mdl-ct">
                                                        <div className="mdl-ct-a">
                                                            <BuildContent content={content} />
                                                        </div>
                                                    </div>
                                                }
                                                <div className="nav-pic-lft" style={{top: halfHeight, left: "10px"}}>
                                                    <div className="prev-ph-btn" onClick={this.goPrev}>
                                                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                {id === this.props.params.id &&
                                                    <div className="mdl-img">
                                                        <img src={webPath} className="img-tg" style={{maxHeight: height, height: height}}/>
                                                        <div className="shadow"></div>
                                                    </div>
                                                }
                                                <div className="nav-pic-rght" style={{top: halfHeight, right: "10px"}}>
                                                    <div className="nxt-ph-btn" onClick={this.goNext}>
                                                        <i className="fa fa-chevron-right" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="mdl-side ph-rght">
                                        <div className="rght-tp"></div>
                                        <div className="rght-a">
                                            <div className="rght-b">
                                                <div className="actties-ctnr">
                                                    <div className="actties-ctnr-a">                                                            
                                                        {showComments && 
                                                            <PictureComments 
                                                                photo={this.state.photo} 
                                                                comments={comments} 
                                                                />
                                                        }
                                                        {showLikes && 
                                                            <PictureLikes 
                                                                photo={this.state.photo} 
                                                                />
                                                        } 
                                                        {showSecrets && 
                                                            <PictureSecrets
                                                                view={secretView}
                                                                loading={loadingSecret}
                                                                questions={questions}
                                                                questionId={questionId}
                                                                alreadySeen={secretAlreadySeen}
                                                                photo={this.state.photo} 
                                                                changeView={this.changeView}
                                                                changeQuestionId={this.changeQuestionId}
                                                                />
                                                        }                                                               
                                                    </div>
                                                    <div className={classnames('actties-arrow', selected_activity)}></div>                            
                                                </div> 
                                                <div className="pls-lks-act">
                                                    {id === this.props.params.id &&
                                                        <div className="pls-lks-act-a">
                                                            <div className="share-dv">
                                                                <span className="postShare-icon-form" onClick={this.onShare.bind(this, id)}>
                                                                    <i className="fa fa-share-alt"></i>
                                                                    <span className="txt">share</span>
                                                                </span>                           
                                                            </div>
                                                            <div className={classnames('q-div', {'selected' : showSecrets })}>
                                                                <span className={classnames('selec-sp', {'selected' : showComments })}></span>
                                                                <span className="sp-secret" onClick={this.showSecrets}>
                                                                    <span className="glyphicon glyphicon-question-sign"></span>
                                                                    <span className="txt">secret</span>
                                                                </span>
                                                                {user.id == author.id && <span className="pst-qst-nb">{nbQuestioners}</span>}
                                                                {hasSecret && 
                                                                    <span className="pst-qst-noti">
                                                                        <i className="fa fa-circle" aria-hidden="true"></i>
                                                                    </span>
                                                                } 
                                                            </div>
                                                            <div className={classnames('cmt-dv', {'selected' : showComments })}>
                                                                <span className={classnames('selec-sp', {'selected' : showComments })}></span>
                                                                <span className="linkPcomment" onClick={this.renderComments}>
                                                                    <i className="fa fa-comment"></i>
                                                                    <span className="txt">comment</span>
                                                                </span>
                                                            </div>
                                                            <div className={classnames('like-dv', {'selected' : showLikes })}>
                                                                <span className={classnames('selec-sp', {'selected' : showComments })}></span>
                                                                <LikeButton 
                                                                    object={this.state.photo} 
                                                                    refer="picture" 
                                                                    liked={liked} 
                                                                    onLike={this.onLike} />
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ph-lft-btm">
                                                                                                                                                            
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
export default withRouter(connect(state => ({ 
    user: state.User.user,
    status: state.Photo.status,
    photosStore: state.Photos.photos,
    commentsStore: state.Comments.comments,
}))(Photo))
