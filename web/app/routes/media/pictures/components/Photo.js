import React                        from 'react'
import { findDOMNode }              from 'react-dom'
import createReactClass             from 'create-react-class'
import { Link, withRouter }         from 'react-router-dom'
import { connect }                  from 'react-redux'
import { Helmet }                   from 'react-helmet'
import { bindActionCreators }       from 'redux'
import classnames                   from 'classnames'
import * as axios                   from 'axios'
import _                            from 'lodash'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
// import Container from './Container'
import { getUrlParameterByName }    from '../../../../utils/funcs'
import { BASE_PATH }                from '../../../../config/api'
import * as DraftFuncs              from '../../../../components/social/home/form/DraftFuncs'
import { BuildContent, LikeButton, 
         Author, TimeAgo,
         Modal, EmojisContainer,
        EveryWhereContainer, }                    from '../../../../components' 
import { PictureComments,
         PictureSecrets,
         PictureLikes }             from '../components'

import { 
    EveryWhere as EveryWhereAction,
    Questions as QuestionsActions,
    Secrets as SecretsActions,
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
            everywhere: {},
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
        const { photo } = this.state,
            index = _.findIndex(photo.imagesIds, imgId => imgId === photo.id);

        if(index === 0) {
            console.log('null')
            return //dispatch(AppActions.noMoreAllies('first'));
        }
        
        const prevId = photo.imagesIds[index - 1];
        this.props.history.replace(`/pictures/${prevId}?post_id=${photo.postValid}`, {modal: true})
    },

    goNext () {
        const { photo } = this.state,
            index = _.findIndex(photo.imagesIds, imgId => imgId === photo.id);
            console.log(index)

        if(photo.imagesIds.length < index) {
            console.log('null')
            return //dispatch(AppActions.noMoreAllies('first'));
        }

        const nextId = photo.imagesIds[index + 1];
        this.props.history.replace(`/pictures/${nextId}?post_id=${photo.postValid}`, {modal: true})
    },

    closeModal(e) {
        e.preventDefault();
        this.props.dispatch(PhotoActions.closeModal())
        this.props.history.goBack();
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

    onShare(id) {
        this.props.onShare(id, 'photo');
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

    },

    loadUserResponses(postId) {

    },

    showSecrets(e) {
        const { photo } = this.state;
        if(photo.author.id == this.props.user.id) {
            this.props.dispatch({type: 'LOAD_QUESTIONS', postId: photo.id, refer: 'photo'})
        } else {
            this.props.dispatch({type: 'FIND_QUESTION_FOR_USER', postId: photo.id, refer: 'photo', userId: this.props.user.id})
        }

        this.setState({
            showComments: false,
            showSecrets: true,
            showLikes: false,
            selected_activity: 'secret',
        })
    },

    showLikes(e) {
        const postId   = this.state.photo.id;

        this.setState({
            showComments: false,
            showSecrets: false,
            showLikes: true,
            selected_activity: 'like',
        })
    },

    changeView(view) {
        this.setState({secretView: view})
    },

    changeQuestionId(id) {
        this.setState({questionId: id})
    },

    removeEverywhere() {
        console.log('removing everywhere')
    },

    //get size of image container
    //get image original size
    //calcal the scale_x and scale_y
    //then send the left, top, title and the scale of image to server
    sendEverywhere(left, top, title) {
        let { addEver, match: {params}, user } = this.props,
        img = findDOMNode(this.refs._img),
        { naturalWidth, naturalHeight, height, width } = img,
        scale_x = width / naturalWidth,
        scale_y = height / naturalHeight,

        everywhere = {
            scale_x,
            scale_y,
            rect_y: top,
            rect_x: left,
            char_code: title,
        }

        this.props.addEver(params.id, everywhere);
    },

    sendFriendTag(rect, recipient, clientScale) {
        const { imageId } = this.props;
        console.log('sendFriendTag', rect, recipient, clientScale)
    },

    popFriendInList(username) {
        const friends = _.filter(this.state.friends, (user, i) => {
            return !_.indexOf(user, user.username); //remove user in selectable list
        })
        .map((user, i) => {
            return {
                label: user.username, 
                firstname: user.firstname, 
                lastname:user.lastname, 
                value: user
            }
        });

        this.setState({friends})
    },

    handleImageLoaded(e) {
        // console.log('image loaded')
        const rects = [],
        img         = e.target,
        tracker     = new tracking.ObjectTracker('face');

        tracking.track(img, tracker);
        tracker.on('track', function(e) {
            e.data.forEach(function(rect) {
                rects.push(rect);
                // plotRectangle(rect.x, rect.y, rect.width, rect.height);
            });
        });

        this.setState({
            img: img,
            rects: rects,
        })
    },

    handleImageErrored(e) {
        console.log('some error happens when initializing image')
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
        const { photosStore, match: {params: {id}}} = this.props,
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
        const rects = [],
        img         = this.refs._img,
        { dispatch, match: {params}, location: {query, pathname }, user } = this.props,
        loading     = false,
        postId      = params.id,
        status      = { modal: true, returnTo: pathname };

        // this.props.dispatch(EveryWhereAction.loadEveryWhere(postId, user.id))

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

        this.setState({comments: comments})
    },

    componentWillUpdate(nextProps, nextState) {
        if(this.props.match.params.id !== nextProps.match.params.id) {
            //
        }
    },

    componentWillReceiveProps(nextProps) {
        const { match:{params: {id}}, photosStore, location, dispatch, commentsStore} = nextProps,
        post_id = getUrlParameterByName('post_id', location.search)
        if( id !== this.props.match.params.id || photosStore != this.props.photosStore) {
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
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState ||
            this.props.user !== nextProps.user
    },

    /**
     * render
     * @returns markup
     */
    render() {
        const { questionBox,
	         selected_activity, showSecrets, questionId,
	         showLikes, showComments, secretView, 
	         secretAlreadySeen, questions, loadingSecret,
	         photo, 
	    }   			= this.state,

        { user, left, width, height, match: {params}} = this.props;
        return (
            <div className="o-modal photo no-modal"> 
                <div className="modal-ctnr">
                    <Helmet>
                        <title>Photo of {photo.author.firstname}</title>
                    </Helmet>
                    <div className="black-drop-dv" onClick={this.closeModal}></div>
                    <div className="container" style={{width: `${width}px`, height: `${height}px`}}>
                        <div className="dv-ph-ctnr" >
                            <div className="ph_header">
                                <span className="ph-close" onClick={this.closeModal}>
                                    <i className="fa fa-times "></i>
                                </span>
                            </div> 
                            <div className="ph-ctnr-a">
                                <div className="ph-ctnr-b">
                                    <div className="ph-lft" style={{width: `${this.props.photoCtnr}px`}}>
                                        <div className="ph-lft-a"> 
                                            {photo.id === params.id &&
                                                <div className="ph-lft-tp">
                                                    <div className="ph-lft-tp-r">
                                                        <div className="tp-r-avatar">                  
                                                            <Author.Photo author={photo.author} imgHeight={40} />                           
                                                       </div>
                                                        <div className="tp-r-name">
                                                            <Author.Name author={photo.author} className="pst-aut-nm" /> 
                                                       </div>
                                                    </div>
                                                    <div className="ph-lft-tp-l">
                                                        <span className="dte-ctnr">
                                                            <TimeAgo timestamp={photo.createdAt} />
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
                                                                    author={photo.author} />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <div className="ph-rght-mdl">
                                                {photo.id === params.id &&
                                                    <div className="mdl-ct">
                                                        <div className="mdl-ct-a">
                                                            <BuildContent content={photo.content} />
                                                        </div>
                                                    </div>
                                                }
                                                <div className="nav-pic-lft" style={{top: `${this.props.halfHeight}px`, left: "10px"}}>
                                                    <div className="prev-ph-btn" onClick={this.goPrev}>
                                                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                {photo.id === params.id &&
                                                    <div className="mdl-img">
                                                        <EveryWhereContainer 
                                                            {...this.props}
                                                            photo={this.state.photo}
                                                            rects={this.state.rects}
                                                            imgElement={this.state.img}
                                                            everywhere={photo.everywhere}
                                                            removeEverywhere={this.removeEverywhere}
                                                            sendEverywhere={this.sendEverywhere}>
                                                            <img 
                                                                ref='_img'
                                                                src={photo.webPath} 
                                                                className="img-tg" 
                                                                onLoad={this.handleImageLoaded}
                                                                onError={this.handleImageErrored}
                                                                style={{maxHeight: `${height}px`, height: `${height}px`}}
                                                                />
                                                        </EveryWhereContainer>
                                                        <div className="shadow"></div>
                                                    </div>
                                                }
                                                <div className="nav-pic-rght" style={{top: `${this.props.halfHeight}px`, right: "10px"}}>
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
                                                    <div className={classnames('actties-ctnr-a', selected_activity)}>
                                                        <PictureComments 
                                                            {...this.props}
                                                            showComments={showComments}
                                                            photo={this.state.photo} 
                                                            comments={this.state.comments} 
                                                            />
                                                        <PictureLikes
                                                            {...this.props} 
                                                            showLikes={showLikes}
                                                            photo={this.state.photo} 
                                                            />
                                                        <PictureSecrets
                                                            {...this.props}
                                                            view={secretView}
                                                            showSecrets={showSecrets}
                                                            loading={loadingSecret}
                                                            questions={questions}
                                                            questionId={questionId}
                                                            alreadySeen={secretAlreadySeen}
                                                            photo={this.state.photo} 
                                                            changeView={this.changeView}
                                                            changeQuestionId={this.changeQuestionId}
                                                            />                                                             
                                                    </div>
                                                    <div className={classnames('actties-arrow', selected_activity)}></div>                            
                                                </div> 
                                                <div className="pls-lks-act">
                                                    {photo.id === params.id &&
                                                        <div className="pls-lks-act-a">
                                                            <div className="share-dv">
                                                                <span className="postShare-icon-form" onClick={this.onShare.bind(this, photo.id)}>
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
                                                                {user.id == photo.author.id && <span className="pst-qst-nb">{photo.nbQuestioners}</span>}
                                                                {photo.hasSecret && 
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
                                                                <div 
                                                                    onClick={this.showLikes}
                                                                    className="every-ico">
                                                                    EveryWh
                                                                </div>
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
            </div>
        )
    }
})

///////
function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, EveryWhereAction), dispatch)
}

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default DragDropContext(HTML5Backend)(withRouter(connect(state => ({ 
    user: state.User.user,
    status: state.Photo.status,
    photosStore: state.Photos.photos,
    commentsStore: state.Comments.comments,
}), mapDispatchToProps)(Photo)))
// <LikeButton 
//     object={this.state.photo} 
//     refer="picture" 
//     liked={liked} 
//     onLike={this.onLike} />