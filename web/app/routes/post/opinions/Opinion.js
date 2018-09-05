import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link, withRouter, 
         Switch, Route }             from 'react-router-dom'
import { connect }                  from 'react-redux'
import classnames                   from 'classnames';
import * as axios                   from 'axios'
import { push }                     from 'react-router-redux'
import { Helmet }                   from 'react-helmet'
import { BASE_PATH }                from '../../../config/api'
import * as DraftFuncs              from '../../../components/social/home/form/DraftFuncs'
import { BuildContent, LikeButton, 
         Images, Author, TimeAgo,
         Modal }                    from '../../../components' 
import { LeftComments, RightComments,
         PostContainer }             from './components'

import { 
    Comments as CommentsActions,
    Authors as AuthorsActions,
    Posts as PostsActions,
    App as AppActions,
}                                   from '../../../actions'
const Picture  = require('../../../routes/media/pictures/Picture').default,
Video    = require('../../../routes/media/videos/Video').default;

import '../../../styles/post/opinion.scss'

const Option  = createReactClass(  {

    getInitialState() {
        return {
            option: false
        }
    },

    getPost () {
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
                        <a href="" className="pst-opt-edit" onClick={this.handleEdit}>
                            <span className="pst-opt-edit-ico">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-edit-txt"> Edit</span>
                        </a>
                        <a href="" className="pst-opt-remove" onClick={this.handleRemove}>
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
        const { user }      = this.props
        if(this.props.author.id === this.props.user.id) {
            return this.renderForAuthor();
        } else {
            return this.renderForUser();
        }
    }
})

const Opinion  = createReactClass( {

    /**
     * state
     * @type {{caption: string, hashtags: string, location: string, filename: string, uploadState: string, disabledUploadState: boolean}}
     */
    getInitialState() {
        return {
            allie_id: 1,
            left: '100px',
            width: '800px',
            height: '400px',
            postCtnr: '450px',
            selected_allie: null,
            post: {},
        }
    },

    commentEdited () {
        this.setState({editingComment: false})
    },

    onRate () {
        this.props.onLike();
    },

    onShare(postId, e) {
        e.preventDefault();
        this.props.onShare(postId, 'post');
    },

    onSideComment(comment, side) {
        const postAuthorId = this.props.post.author._id["$id"]
        this.props.onSideComment(comment, side, postAuthorId)
    },

    onComment(comment) {
        const postAuthorId = this.props.post.author._id["$id"]
        this.props.onComment(comment, postAuthorId)
    },

    closeModal(e) {
        e.preventDefault();
        const { router } = this.props;
        router.goBack();
    },

    onShare(photoId) {
        console.log('share picture')
    },

    goPrev () {
        const { mainPost: {nbAllies} } = this.state,
              { location: {query: {allie_id}}, dispatch, router, params }  = this.props, 
              prev_allie_id = Number(allie_id) - 1;

        if(prev_allie_id < 0) {
            console.log('null')
            return //dispatch(AppActions.noMoreAllies('first'));
        }
        const route = `/posts/${params.id}?allie_id=${prev_allie_id}`;
        router.replace(route)
    },

    goNext () {
        const { mainPost: {nbAllies} } = this.state,
              { location: {query: {allie_id}}, dispatch, router, params }  = this.props, 
              next_allie_id = Number(allie_id) + 1;

        if(next_allie_id > nbAllies) {
            console.log('null')
            return //dispatch(AppActions.noMoreAllies('first'));
        }
        const route = `/posts/${params.id}?allie_id=${next_allie_id}`;
        router.replace(route)
    },

    componentWillMount() {
        
    },

    componentDidMount() {

        const self      = this,
        { dispatch }    = this.props,
        webSocket       = WS.connect("ws://127.0.0.1:8080"),
        { post: {id, type, author, allie_ids, opinionOrder }} = this.state,
        winWidth = window.innerWidth,
        winHeight= window.innerHeight,
        width = (winWidth - (50 * 2)) + 'px',
        height = (winHeight - (40 * 2)) + 'px',
        postCtnr = ((winWidth - (50 * 2)) - 360 - 360) + 'px';

        if(id) {
            dispatch(CommentsActions.loadLeftComment(id))
            dispatch(CommentsActions.loadRightComment(id))
        }

        webSocket.on("socket/connect", (session) => {
            this.session = session;

            this.session.subscribe(`left/channel/${id}`, (uri, payload) => {
                if(payload.data) {
                    const comment = JSON.parse(payload.data).data
                    console.log(comment)
                    dispatch({type: 'PUBLISH_LEFT', comment, id, opinionOrder})
                }
            });

            this.session.subscribe(`right/channel/${id}`, (uri, payload) => {
                if(payload.data) {
                    const comment = JSON.parse(payload.data).data
                    console.log(comment)
                    dispatch({type: 'PUBLISH_RIGHT', comment, id, opinionOrder})
                }
            });

            _.each(allie_ids, (allie_id, i) => {
                const order = i + 1
                this.session.subscribe(`left/channel/${allie_id}`, (uri, payload) => {
                    if(payload.data) {
                        const comment = JSON.parse(payload.data).data
                        console.log(comment)
                        dispatch({type: 'PUBLISH_LEFT', comment, id, order})
                    }
                });

                this.session.subscribe(`right/channel/${allie_id}`, (uri, payload) => {
                    if(payload.data) {
                        const comment = JSON.parse(payload.data).data
                        console.log(comment)
                        dispatch({type: 'PUBLISH_RIGHT', comment, id, order})
                    }
                });
            })

            this.session.subscribe(`rate/channel/${id}`, (uri, payload) => {
                if(payload.data) {
                    const rate = JSON.parse(payload.data).data
                    dispatch({type: 'PUBLISH_RATE', rate, id, opinionOrder})
                }
            });

            this.session.subscribe(`share/channel/${id}/post`, (uri, payload) => {
                if(payload.data) {
                    const share = JSON.parse(payload.data).data
                    dispatch({type: 'PUBLISH_SHARE', share, id, opinionOrder})
                }
            });

            this.session.subscribe(`nextPost/channel/${id}`, (uri, payload) => {
                if(payload.data) {
                    const nextPost = JSON.parse(payload.data).data
                    dispatch({type: 'PUBLISH_NEXT_POST', nextPost, id, opinionOrder})
                }
            });
        })

        webSocket.on("socket/disconnect", function(error){
            console.log("Disconnected for " + error.reason + " with code " + error.code);
        })

        this.setState({
            width: width,
            height: height,
            postCtnr: postCtnr,
        })
    },

    componentWillUpdate(nextProps, nextState) {
        if(nextState.post.id !== this.state.post.id) {
            const { post }      = nextState,
                { dispatch }    = this.props
            dispatch(CommentsActions.loadLeftComment(post.id))
            dispatch(CommentsActions.loadRightComment(post.id))
        }
    },

    componentWillReceiveProps(nextProps) {
        // if((this.props.alliesStore !== nextProps.alliesStore) || (next_order !== this_order)) {
        //     if(next_order > 0 ) {
        //         const post =  nextProps.alliesStore
        //         .filter((p, i) => {
        //             for(var prop in p) {
        //                 return p[prop].opinionOrder === next_order
        //                 &&     p[prop].mainAllieId === id
        //             }
        //         }).map((p, i) => {
        //             for(var prop in p) {
        //                 return p[prop];
        //             }
        //         })[0] || {}

        //         if(!post.id) this.dispatch(PostsActions.loadAllieByOrder(id, next_order));

        //         this.setState({post: post})
        //     } else {
        //         const p = this.props.postsStore
        //             .filter((p, i) => {
        //                 for(var prop in p) {
        //                     return p[prop].id === id 
        //                 }
        //             }).map((p, i) => {
        //                 for(var prop in p) {
        //                     return p[prop];
        //                 }
        //             })[0] || {}
        //         this.setState({post: p}) 
        //     }
        // }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.user !== nextProps.user || 
            this.state !== nextState
    },

    /**
     * render
     * @returns markup
     */
    render() {
        const { left, width, postCtnr, selected_allie, 
            height, l_arguments, r_arguments, }    = this.state,
        { user, location, match,
          post: { rate, publishedAt, isMainPost, totalRate, nbAllies,
                rightEditors, author, opinionOrder, liked, nbLeftComments, secret,
                isUpdated, isMasked, title, images, videos, content, id, createdAt,
                favorite, nbRightComments, updateAt, nbRates, leftEditors, 
            }, mainPost  } = this.props,
        _title = title.length ? title : content  //TODO TRI
        allie_id = getUrlParameterByName('allie_id', location.search);
        return (
            <Modal className="o-modal opinion">
                {mainPost.id === this.props.params.id && 
                    <div className="modal-ctnr">
                        <Helmet>
                            <title>Opinion . {post.author.firstname}</title>
                        </Helmet>
                        <div className="black-drop-dv" onClick={this.closeModal}></div>
                        <div className="container" style={{width: width, height: height}}>
                            <div className="dv-op-ctnr" >
                                <div className="op_header">
                                    <span className="op-close" onClick={this.closeModal}>
                                        <i className="fa fa-times "></i>
                                    </span>
                                </div> 
                                {id &&
                                    <div className="op-ctnr-a">
                                        <div className="op-ctnr-b">
                                            <div className="mdl-side op-lft">                                            
                                                <div className="lft-tp"></div>
                                                <LeftComments 
                                                    {...this.props}
                                                    allie_id={allie_id}
                                                    mainPost={mainPost}
                                                    post={this.state.post}
                                                    onComment={this.onComment}
                                                    />
                                            </div>           
                                            <div className="op-cter" style={{width: postCtnr}}>
                                                <PostContainer 
                                                    {...this.props}
                                                    mainPost={mainPost}
                                                    allie_id={allie_id}
                                                    goNext={this.goNext}
                                                    goPrev={this.goPrev}
                                                    onShare={this.onShare}
                                                    post={this.state.post}
                                                    />
                                            </div>
                                            <div className="mdl-side op-rght">
                                                <div className="rght-tp"></div>
                                                <RightComments 
                                                    {...this.props}
                                                    allie_id={allie_id}
                                                    mainPost={mainPost}
                                                    post={this.state.post}
                                                    onComment={this.onComment}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {!id && <div className="loading-dv"></div>}
                            </div>
                        </div>
                    </div>
                }
                <Switch>
                    <Route path="/videos/" children={() => <Video {...props} />} />                   
                    <Route path="/pictures/:id" children={() => <Picture {...props} />} />
                </Switch>
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
    sideState: state.App.sideComment,
}))(Opinion))
