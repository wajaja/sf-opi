import React            from 'react'
import { fromJS }       from 'immutable'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
import _                from 'lodash'
import * as moment      from 'moment'

import { 
    Comments, CommentForm, EditCommentForm,
    LikeButton, Reaction, QuestionBox, Comment 
}                       from '../../../components'

import { 
    CommentForm as CommentFormActions,
    Comments as CommentsActions,
    Authors as AuthorsActions
}                                   from '../../../actions/post'
import bindFunctions from '../../../utils/bindFunctions'


const Foot  = createReactClass({

	getInitialState() {
        return {
            comments: [],
            secretView: '',
            questionBox: false,
            questionId: undefined,
            editedComment: {},
            editingComment: false,
            boxPlacement: 'bottom',
            pendingComments: [],
        }
	},

    commentEdited() {
        this.setState({editingComment: false})
    },

    onLike(value, postId, refer) {
        this.props.onLike();
    },

    onShare(postId, e) {
        e.preventDefault();
        this.props.onShare(postId, 'post');
    },

    onComment(postId, refer, data) {

        this.props.dispatch(CommentsActions.submitComment(postId, refer, data)).then(comment => {
            this.onCommentSuccess(data.unique)
            this.props.onComment(comment)
        }, (err) => {
            this.onCommentFail(data.unique)
        })

        //build comment to append
        const { unique, successFiles, content } = data,
        { user: {id, username, lastname, firstname, profile_pic }, } = this.props,
        c = {
            id: null,
            unique: unique,
            content: content,
            images: successFiles,
            createdAt: moment.utc().valueOf(),
            author: {
                id: id,
                username: username,
                lastname: lastname,
                firstname: firstname,
                profile_pic: profile_pic.web_path
            },

            failed: false,
            retrying: false,
            postId, refer, data 
        },
        joined = this.state.comments;
        this.setState({
            comments: joined.concat(c) //
        })
    },

    //delete appended Comment by its unique identifier
    onCommentSuccess(unique) {
        // let coms = this.state.pendingComments.filter((c, i) => {
        //     return c.unique  !== unique
        // })
        // this.setState({pendingComments: coms}) 
    },

    //mark appended Comment fails by its unique identifier
    onCommentFail(unique) {
        // .map((c, i) => {
        //         if(c.unique === unique) {
        //             c.failed = true;
        //             c.retrying = false;
        //         }
        //         return c
        // })

        let comments = fromJS(this.state.comments);
        comments = comments.map(item => { 
            if(item.get('unique') === unique) {
                let comment = item.merge({
                    "failed": true, 
                    "retrying": false
                });
                return comment
            } else {
                return item
            }
        });

        this.setState({
            comments: comments.toJS()
        }) 
    },

    reSubmitComment(postId, refer, data) {
        this.props.dispatch(CommentsActions.submitComment(postId, refer, data)).then(comment => {
            this.onCommentSuccess()
            self.props.onComment(comment)
        }, (err) => {
            this.onCommentFail(data.unique)
        })

        let comments = fromJS(this.state.comments);
        comments = comments.map(item => { 
            if(item.get('unique') === data.unique) {
                let comment = item.merge({
                    "failed": true, 
                    "retrying": false
                });
                return comment
            } else {
                return item
            }
        });

        this.setState({
            comments: comments.toJS()
        }) 
    },

    toggleQuestion(e) {
        const self  = this,
        { post }    = this.props;
        this.setState({questionBox: !self.state.questionBox})
    },

    changeView(view) {
        this.setState({secretView: view})
    },

    changeQuestionId(id) {
        this.setState({questionId: id})
    },

    handleCommentEdit(status, editedComment) {
        this.setState({
            editingComment: status,
            editedComment: editedComment
        })
    },

    componentWillUpdate(nextProps, nextState) {
        
    },

    componentDidMount() {
        const  { post: {id} } = this.props,
        comments =  this.props.commentsStore
                    .filter((comment, i) => {
                        for(var prop in comment) {
                            return comment[prop].postValid  === id && 
                                   comment[prop].refer      === 'post';
                        }
                    }).map((comment, i) => {
                        for(var prop in comment) {
                            return comment[prop];
                        }
                    }).sort((a, b) => {
                        if (a.createdAt < b.createdAt) return -1;
                        if (a.createdAt > b.createdAt) return 1;
                        return 0;
                    }) 
        this.setState({
            comments: _.uniqBy(comments, 'id'),
            pendingComments: []
        })
    },

    componentDidUpdate(prevProps, prevState) {
        if( this.state.comments.length !== prevState.comments.length) {
            this.props.recomputePostHeight();
        }
    },

    componentWillReceiveProps(nextProps) {
        const  { post: {id} } = this.props
        //update comments array in state (incomming & newly created)
        if(nextProps.commentsStore !== this.props.commentsStore) {
            const comments =  nextProps.commentsStore
                        .filter((comment, i) => {
                            for(var prop in comment) {
                                return comment[prop].postValid  === id && 
                                       comment[prop].refer      === 'post';
                            }
                        }).map((comment, i) => {
                            for(var prop in comment) {
                                return comment[prop];
                            }
                        }).sort((a, b) => {
                            if (a.createdAt < b.createdAt) return -1;
                            if (a.createdAt > b.createdAt) return 1;
                            return 0;
                        })
            this.setState({comments:  _.uniqBy(comments, 'id')})
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.post !== nextProps.post ||
            this.state !== nextState
    },

	render() {
		const self = this,
        { post : {id, author, hasSecret, liked, nbLikers, nbQuestioners,}, 
        commentsStore, userId, dispatch }   = this.props,
        { comments, questionBox, boxPlacement, pendingComments, secretView }  = this.state,
          authorId  = author.id;
		return(
			<div className={this.props.editPostFormFocus && this.props.editing ? `fooPost editing`: `fooPost`}>
                <div className="fooPost-a">
                    <div className="fooPost-b" >
                        <div className="fooPost-c">
                            <div className="postQuestionDiv item deg270">
                                <span className="postQuestion-icon-form" onClick={this.toggleQuestion}>
                                    <span className="glyphicon glyphicon-question-sign"></span>
                                    <span className="txt">secret</span>
                                </span>
                                {hasSecret && 
                                    <span className="pst-qst-noti">
                                        <i className="fa fa-circle" aria-hidden="true"></i>
                                    </span>
                                }
                                {questionBox && 
                                    <QuestionBox 
                                        {...this.props}
                                        refer="post"
                                        view={secretView} 
                                        post={this.props.post}
                                        placement={boxPlacement}
                                        changeView={this.changeView}
                                        toggleQuestion={this.toggleQuestion} 
                                        changeQuestionId={this.changeQuestionId}
                                        />
                                }
                            </div>
                            <div className="postShareDiv  item deg0">
                                <span className="postShare-icon-form" onClick={this.onShare.bind(this, id)}>
                                    <i className="fa fa-share-alt"></i>
                                    <span className="txt">share</span>
                                </span>                           
                            </div>
                            <div className="pCommentDiv item deg315" >
                                <span className="linkPcomment" >
                                    <i className="fa fa-comment"></i>
                                    <span className="txt">comment</span>
                                </span>
                            </div>
                            <div className="plikeDv item center" >
                                <LikeButton 
                                    {...this.props}
                                    object={this.props.post} 
                                    refer="post" 
                                    liked={liked} 
                                    onLike={this.onLike} 
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="fooPost-b-r" >
                        <div className="postDetail">
                            {( nbQuestioners && author.id == userId) || nbLikers && 
                                <div style={{width: 'auto', overflow: 'visible', backgroundColor: '#f6f7f8'}}>
                                    <div style={{display: 'block'}}>
                                        <span></span><a href=""></a>
                                        <span></span>
                                    </div>
                                </div>
                            }
                            {!!nbQuestioners && <div className="pst-qst-nb">{nbQuestioners} question</div>}
                            {!!nbLikers && <div className="pst-likes-nb">{nbLikers} likes</div>}
                        </div>
                    </div>
                </div>
                <div className="pst-cmt-ctnr">
                    <div className="pst-cmt-ctnr-a">
                        {comments.length > 0 &&
                            <div className="containerComments" >
                                <div className="gComment" >
                                    <Comments 
                                        {...this.props} 
                                        comments={comments} 
                                        onLike={this.onLike}
                                        postAuthorId={author.id}
                                        reSubmitComment={self.reSubmitComment}
                                        editingComment={this.state.editingComment}
                                        handleCommentEdit={this.handleCommentEdit} 
                                        refer='post'
                                        />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="pst-cmt-frm">
                    <div className="pst-cmt-frm-a">
                        <div className="pst-cmt-frm-b">
                            <div className="pst-cmt-frm-ctnr">
                                {!this.state.editingComment && 
                                    <CommentForm 
                                        {...this.props}
                                        refer='post'
                                        dispatch={dispatch}
                                        onComment={this.onComment}
                                        post={this.props.post} 
                                        recomputePostHeight={this.props.recomputePostHeight}
                                        postId={id} />}
                                {this.state.editingComment && 
                                    <EditCommentForm 
                                        {...this.props}
                                        key={id} 
                                        postId={id}
                                        refer='post'
                                        post={this.props.post} 
                                        onComment={this.onComment}
                                        comment={this.state.editedComment}
                                        commentEdited={this.commentEdited} 
                                        recomputePostHeight={this.props.recomputePostHeight}
                                        />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
})
//////
export default connect(state => ({
    editPostFormFocus: state.App.editPostFormFocus,
    userId: state.User.user.id,
    commentsStore: state.Comments.comments
}))(Foot);