import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'
import _ 					from 'lodash'
import axios 				from 'axios'
import * as moment 			from 'moment'
import onClickOutside 		from 'react-onclickoutside'

import Photos 				from './Photos'
import { Author } 			from '../avatars'
import { TimeAgo } 			from '../../social/commons'
import { BuildContent } 	from '../../social'
import bindFunctions 		from '../../../utils/bindFunctions'
import EditCommentForm 		from './EditCommentForm'
import { LikeButton } 		from '../like'
import { 
	ReplyForm, EditReplyForm, Reply 
} 							from '../reply'
import { BASE_PATH } 				from '../../../config/api'
import { 
	ReplyForm as FormActions,
	Authors as AuthorsActions,
	Comments as CommentsActions,
	UnderComments as ReplyActions,
} 									from '../../../actions/post'

import '../../../styles/post/comment.scss'

const clickOutsideConfig = {
  	excludeScrollbar: true
};

const Option  = onClickOutside(
	createReactClass({
		getInitialState() {
			return {
				option: false,
				replies: [],
				editedReply: {},
	            editingReply: false
			}
		},

		//method from 'react-onclickoutside' module
		handleClickOutside(e) {
		    // ..handling code goes here... 
		    this.props.toggleOption(e)
		},

		handleEdit(e) {
			e.preventDefault();
			this.props.handleEdit();
		},
		

		handleRemove(e) {
			e.preventDefault();
			this.props.handleRemove();
		},

		maskComment(e) {
			e.preventDefault();
			this.props.maskPost();
		},

		renderForAuthor() {
			return(
				<div className="cmt-opt-ctnr-a">
	                <div className="opt-rel-ctnr">
	                    <i className="opt-arraw"><i></i></i>
	                    <span className="cmt-opt-ctnr-b">
	                        <a href="" className="cmt-opt-edit" onClick={this.handleEdit}>
	                            <span className="cmt-opt-edit-ico"><i className="fa fa-pencil" aria-hidden="true"></i></span>
	                            <span className="cmt-opt-edit-txt"> Edit</span>
	                        </a>
	                        <a href="" className="cmt-opt-remove" onClick={this.handleRemove}>
	                            <span className="cmt-opt-remove-ico"><i className="fa fa-times" aria-hidden="true"></i></span>
	                            <span className="cmt-opt-remove-txt"> Trash</span>
	                        </a>
	                    </span>
	                </div>
	            </div>
			)
		},
		///
		///
		renderForPostAuthor() {
			return (
				<div className="cmt-opt-ctnr-a">
	                <div className="opt-rel-ctnr">
	                    <i className="opt-arraw"><i></i></i>
	                    <span className="cmt-opt-ctnr-b">
	                        <a href="" className="cmt-opt-remove" onClick={this.handleRemove}>
	                            <span className="cmt-opt-remove-ico"><i className="fa fa-times" aria-hidden="true"></i></span>
	                            <span className="cmt-opt-remove-txt"> Trash</span>
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
				<div className="cmt-opt-ctnr-a">
	                <div className="opt-rel-ctnr">
	                    <i className="opt-arraw"><i></i></i>
	                    <span className="cmt-opt-ctnr-b">                                    
	                        <a href="" className="cmt-opt-mask" onClick={this.maskComment}>
	                            <span className="cmt-opt-mask-ico"><i className="fa fa-trash" aria-hidden="true"></i></span>
	                            <span className="cmt-opt-mask-txt">Mask</span>
	                        </a>
	                    </span>
	                </div>
	            </div>
			)
		},

		///
		///
		render() {
			if(this.props.authorId === this.props.userId) {
				return this.renderForAuthor();
			} 
			else if(this.props.postAuthorId === this.props.userId) {
				return this.renderForPostAuthor();
			}
			else {
				return this.renderForUser();
			}
		}
	}), clickOutsideConfig
)


const Comment  = createReactClass({

	getInitialState() {
		return {
			replies: [],
			option: false,
			editing: false,
			editedReply: {},
			replyForm: false,
			editingReply: false,
			pendingReplies: [],
		}
	},

	onLike(value, postId, refer) {
        this.props.onLike(value, postId, refer);
    },

	toggleReplyForm(e) {
		e.preventDefault();
		const self = this,
		{ comment, dispatch } = this.props;
		this.setState({replyForm: !self.state.true})
		//load replies
		const commentId = comment.id;
		if(!self.state.replies.length) {
			axios.get(`${BASE_PATH}/api/undercomments/load/${commentId}`)
			.then(
					function (res) {
				 	const comments = res.data.comments;
				 	_.forEach(comments, function(comment, i) {
						dispatch(ReplyActions.pushComment(comment));
						dispatch(AuthorsActions.pushAuthor(comment.author))
				 	})
				},  function(err) { 
						if(err.response) {
						console.log(err.response.data);	
							console.log(err.response.status);
							console.log(err.response.headers);				
						} else if(err.request) {
							console.log(err.request);
						} else {
							console.log(err.message);
						}
					console.log(err.config);
				}
			);
		}		
	},

	commentMouseHover(e) {
		$(e.target).find('.cmt-opt-lk').css("opacity", "1");
	},

	commentMouseOut(e) {
		$(e.target).find('.cmt-opt-lk').css("opacity", "0.1");
	},

	handleEdit(e) {
		if(this.state.editing) return;
		const { comment } = this.props;
		this.setState({editing: true});
		this.props.handleCommentEdit(true, comment)
	},

	onReply(commentId, data) {
		const { dispatch } = this.props;
		axios.post(`${BASE_PATH}/api/undercomments/add/`, data, {
			params :{commentId: commentId}
		})
		.then((res) => {
			 	const comment = res.data.comment;
				dispatch(ReplyActions.pushComment(comment));
				dispatch(AuthorsActions.pushAuthor(comment.author))
            	this.onReplySuccess(data.unique)
		}, (err) => { 
			if(err.response) {
			console.log(err.response.data);	
				console.log(err.response.status);
				console.log(err.response.headers);				
			} else if(err.request) {
				console.log(err.request);
			} else {
				console.log(err.message);
			}
			console.log(err.config);

            this.onReplyFail(data.unique)
		});

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
            commentId, refer: 'comment', data 
        }

        this.setState({
            replies: [...this.state.replies, c]
        })
    },

    //delete appended Comment by its unique identifier
    onReplySuccess(unique) {
        let coms = this.state.replies.filter((c, i) => {
                return c.unique  !== unique
        })
        this.setState({pendingReplies: coms})
    },

    //mark appended Comment fails by its unique identifier
    onReplyFail(unique) {
        let coms = this.state.replies.map((c, i) => {
                if(c.unique === unique) {
                    c.failed = true;
                    c.retrying = false;
                }
                return c
        })

        this.setState({
            pendingReplies: coms
        }) 
    },

    reSubmitReply(commentId, data) {
        axios.post(`${BASE_PATH}/api/undercomments/add/`, data, {
			params :{commentId: commentId}
		})
		.then((res) => {
			 	const comment = res.data.comment;
				dispatch(ReplyActions.pushComment(comment));
				dispatch(AuthorsActions.pushAuthor(comment.author))
            	this.onReplySuccess(data.unique)
		}, (err) => { 
			if(err.response) {
			console.log(err.response.data);	
				console.log(err.response.status);
				console.log(err.response.headers);				
			} else if(err.request) {
				console.log(err.request);
			} else {
				console.log(err.message);
			}
			console.log(err.config);

            this.onReplyFail(data.unique)
		});

		let replies = this.state.comments.map((c, i) => {
                if(c.unique === data.unique) {
                    c.retrying = true;
                    c.failed = false;
                }
                return c
        })

        this.setState({replies: replies})
    },

	handleRemove() {
		const { comment, dispatch } = this.props;
		dispatch(CommentsActions.deleteComment(comment));
	},

	replyEdited() {
        this.setState({editingReply: false})
    },

    //resubmit comment when failing
    reSubmitComment() {
    	const { postId, refer, data } = this.props.comment
    	this.props.reSubmitComment(postId, refer, data)
    },

    handleReplyEdit(status, editedReply) {
        this.setState({
            editingReply: status,
            editedReply: editedReply
        })
    },

	maskComment() {
		const { comment, dispatch } = this.props;
		dispatch(CommentsActions.maskComment(comment));
	},

	toggleOption(e) {
		const self = this;
		this.setState({option: !self.state.option})
	},

	componentDidMount() {
        const commentId = this.props.comment.id;
        const replies = this.props.repliesStore
            .filter(function(comment, i) {
                for(var prop in comment) {
                    return comment[prop].commentValid === commentId;
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
            this.setState({replies: replies})
    },

	componentDidUpdate(prevProps, prevState) {
		if(this.props.editingComment != prevProps.editingComment && !this.props.editingComment) {
			this.setState({
				editing: false, 
				option: false
			});
		}

		/*const commentId = this.props.comment.id;
        if(prevProps.repliesStore != this.props.repliesStore) {
            const replies = this.props.repliesStore
            .filter(function(comment, i) {
                for(var prop in comment) {
                    return comment[prop].commentValid === commentId;
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
            this.setState({replies: replies})
        }*/

        if((this.props.comment !== prevProps.comment) || 
            (this.state.replies.length !== prevState.replies.length)) {
            this.props.recomputePostHeight();
        }
	},

	componentWillReceiveProps(nextProps) {
        const  { comment: {id} } = this.props
        //update comments array in state (incomming & newly created)
        if(nextProps.repliesStore !== this.props.repliesStore) {
            const replies =  nextProps.repliesStore
                        .filter((r, i) => {
                            for(var prop in r) {
                                return r[prop].commentValid  === id;
                            }
                        }).map((r, i) => {
                            for(var prop in r) {
                                return r[prop];
                            }
                        }).sort((a, b) => {
                            if (a.createdAt < b.createdAt) return -1;
                            if (a.createdAt > b.createdAt) return 1;
                            return 0;
                        })
            this.setState({replies:  _.uniqBy(replies, 'id')})
        }
    },

	shouldComponentUpdate(nextProps, nextState) {
		return (this.state !== nextState ||
			this.props.comment !== nextProps.comment);
	},

	render() {
		const self 	= this,
		{ editing, option, editingReply, replyForm } = this.state,
		{ comment, authors, dispatch, postAuthorId, userId } = this.props,
		author 	= comment.author;
		return(
			<div className="com-div-a" 
				onMouseOver={this.commentMouseHover} 
				onMouseOut={this.commentMouseOut}>
			    {!editing && 
			    	<div className="com-div-b">
			    		{comment.id && <div className="com-head-opt">
		                        <div className="com-head-opt-a">
		                             <span className="cmt-opt-lk" onClick={this.toggleOption}></span>
		                        </div>
		                        {option && 
			                   		<Option 
			                   			userId={userId}
			                   			comment={comment} 
		                   				toggleOption={this.toggleOption} 
		                   				handleEdit={this.handleEdit} 
		                   				editing={this.props.editing} 
		                   				handleRemove={this.handleRemove}
		                   				maskComment={this.maskComment} 
		                   				postAuthorId={postAuthorId}
		                   				authorId={author.id} />
			                   	}
		                    </div>
		                }
				        <div className="com-div-left">
				            <Author.Photo type='comment' author={author} imgHeight={32} />
				        </div>
				        <div className="com-div-right-a">
				            <div className="com-div-right-b" >
				                <div className="com-head-a" >
				                    <div className="com-head-name">
				                        <span className="com-sp-nm-ct">
				                        	<Author.Name  author={author} className="com-link-name" />
				                        </span>                     
				                        <span className="contentComment">
				                         	<BuildContent content={comment.content} />
				                        </span>
				                    </div>
				                </div>
				                {comment.images.length > 0 && 
				                	<div className="com-img-container" >
					                 	<Photos 
					                 		images={comment.images}
					                 		{...this.props} 
					                 		/>
					                </div>
					            }
				                <div className="com-foo">
				                    {comment.id && 
				                    	<div className="com-foo-left">
					                        <div className="com-like-ctnr">
					                            <LikeButton  
						                            object={comment} 
						                            refer="comment" 
						                            liked={comment.liked} 
						                            onLike={this.onLike} />
						                            {comment.nbLikers > 0 && 
					                                	<span className="nb-likers">
					                                		<span>{comment.nbLikers}</span>
						                                </span>
						                            }
					                        </div>
					                        <div className="com-reply-ctnr" >
					                            <span className="com-reply" name="graphic" onClick={this.toggleReplyForm}>
					                                <i className="fa fa-reply"></i>
					                                <span className="txt">reply</span>                             
					                                {comment.nbUnders > 0 && 
					                                	<span className="nb-rplyr">
					                                		<span>{comment.nbUnders}</span>
						                                </span>
						                            }
					                            </span>
					                        </div>
					                        <div className="com-dv-dte">
				                             	<span className="com-head-time" >                                    
				                                 	<span className={comment.updated ? `op-dte dte-mdf` : `op-dte`}>
				                                   	 	<TimeAgo timestamp={comment.createdAt} />
				                                 	</span>
				                             	</span>
				                         	</div>
					                        <div className="com-und-cmt-ctnr" data-cmt-id={comment.id}>
				                            	{this.state.replies.map(function(reply, i) {
				                            		return <Reply 
				                            					key={i} 
				                            					postAuthorId={postAuthorId}
	                                    						editingReply={editingReply}
	                                    						handleReplyEdit={self.handleReplyEdit}
				                            					reply={reply}
				                            					onLike={self.props.onLike}
				                            					reSubmitReply={self.reSubmitReply}
				                            					{...self.props}
				                            					/>
				                            	})}
				                            </div>
				                            <div className="com-reply-frm-ctnr">
					                            {this.state.replyForm 
					                             	&& !editingReply 
					                             	&& <ReplyForm 
					                             			{...this.props}
					                             			comment={comment} 
					                             			onReply={this.onReply}
					                             			/>
					                            }
					                            {replyForm 
					                             	&& editingReply 
					                             	&& <EditReplyForm 
					                             			{...this.props}
					                             			reply={this.state.editedReply} 
					                                        replyEdited={this.replyEdited}
					                             			comment={comment} 
					                             			/>
					                            }
				                            </div>
				                    	</div>
				                    }
				                    {!comment.id &&
				                    	<span className="re-sbm-sp">
				                    		{comment.failed && 
				                    			<div 
				                    				onClick={this.reSubmitComment} 
				                    				className="re-sbm-lk">
				                    				retry 
				                    			</div>
				                    		}
				                    		{comment.retrying && 
				                    			<div className="re-try-msg">retrying...</div>
				                    		}
				                    	</span>
				                    }
				                </div>
				            </div>
				        </div>
			     	</div>
			    }
			</div>
		)
	}
})

export default connect(state => ({
	userId: state.User.user.id,
	authors: state.Authors.authors,
	repliesStore: state.UnderComments.comments
}))(Comment);