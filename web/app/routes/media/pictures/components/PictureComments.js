import React  					from 'react'
import createReactClass  		from 'create-react-class'
import { connect } 				from 'react-redux'
import _ 					from 'lodash'
import * as moment      from 'moment'
import { Scrollbars } 				from 'react-custom-scrollbars';
import { Comments, CommentForm,
		 EditCommentForm } 		from '../../../../components'
import { Comments as CommentsActions } from '../../../../actions'

const PictureComments  = createReactClass({

	getInitialState() {
		return {
			comments: [],
			scroll_height: 300,
			editingComment: false
		}
	},

	handleCommentEdit(){

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
            postId, refer, data 
        },
        joined = this.state.comments;
        this.setState({
            comments: joined.concat(c) //
        })
    },

    //delete appended Comment by its unique identifier
    onCommentSuccess(unique) {
        // let coms = this.state.comments.filter((c, i) => {
        //     return c.unique  !== unique
        // })
        // this.setState({comments: coms}) 
    },

    //mark appended Comment fails by its unique identifier
    onCommentFail(unique) {
        let coms = this.state.comments.map((c, i) => {
                if(c.unique === unique) {
                    c.failed = true
                }
                return c
        })

        this.setState({comments: coms}) 
    },

    reSubmitComment(postId, refer, data) {

        this.props.dispatch(CommentsActions.submitComment(postId, refer, data)).then(comment => {
            this.onCommentSuccess()
            this.props.onComment(comment)
        }, (err) => {
            this.onCommentFail(data.unique)
        })

        // this.setState({
        //     comments: comments
        // }) 
    },

	componentDidMount() {
		//photoHeightCtnr - bottom_space_height - formComment_height - black_top_height - array_width
		const scroll_height = (this.props.height - 60 - 75 - 30 - 17 );
        this.setState({
            scroll_height: scroll_height
        })
        console.log('my scroll in comments', scroll_height)
	},

	componentWillReceiveProps(nextProps) {
        const { match:{params: {id}}, dispatch, commentsStore} = nextProps;
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

	render() {
		const { editingComment, comments, scroll_height } = this.state,
		{ photo: { author, id }, dispatch, showComments } = this.props,
		display = showComments ? 'block' : 'none';
		return (
			<div style={{display}} className="cmts-ctnr">
                <div className="cmts-ctnr-a">
                	{id && comments.length > 0 &&
	                	 <Scrollbars
                			style={{ height: scroll_height }}>
                            <Comments 
                                {...this.props} 
                                comments={comments} 
                                postAuthorId={author.id}
                                editingComment={editingComment}
                                reSubmitComment={this.reSubmitComment}
                                handleCommentEdit={this.handleCommentEdit} 
                                postId={id}
                                />
	                   	</Scrollbars>
                    }
                </div>
                <div className="frm-ctnr">
	                {id && 
	                	<div className="frm-ctnr-a">
		                    {!editingComment && 
		                    	<CommentForm 
		                    		{...this.props}
                                    postId={id}
	        						refer='photo'
                                    dispatch={dispatch}
                                    onComment={this.onComment}
	        						post={this.props.photo}
	        						/>
	        				}
			                {editingComment && 
			                    <EditCommentForm 
			                    	{...this.props}
			                        post={this.props.photo}
			                        dispatch={dispatch}
			                        onComment={this.onComment}
			                        refer='photo'
			                        key={id} 
			                        comment={editedComment} 
			                        commentEdited={this.commentEdited}
			                        postId={id}
			                    />}
		                </div>
		            }
	            </div> 
            </div>
		)
	}
})

export default connect(state =>({
	user: state.User.user
}))(PictureComments)