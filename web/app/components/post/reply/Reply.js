import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'

import Photos 				from './Photos'
import { Author } 			from '../avatars'
import { TimeAgo } 			from '../../social/commons'
import { BuildContent } 	from '../../social'
import bindFunctions 		from '../../../utils/bindFunctions'
import { LikeButton } 			from '../like'
import { 
	UnderComments as CommentsActions
} 							from '../../../actions/post'

import '../../../styles/post/comment.scss'

const _Option  = createReactClass({

	getInitialState() {
		return {
			option: false
		}
	},

	handleEdit(e) {
		e.preventDefault();
		this.props.handleEdit();
	},
	

	handleRemove(e) {
		e.preventDefault();
		this.props.handleRemove();
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
})
const Option = connect(state => ({
	userId: state.User.user.id
}))(_Option)


const Reply  = createReactClass({

	getInitialState() {
		return {
			option: false,
			editing: false,
			replyForm: false,
			editingReply: false,
			replies: []
		}
	},

	reSubmitReply() {
		const { commentId, data } = this.props.reply
    	this.props.reSubmitReply(commentId, data)
	},

	onLike() {

	},

	commentMouseHover(e) {
		$(e.target).find('.und-opt-lk').css("opacity", "1");
	},

	commentMouseOut(e) {
		$(e.target).find('.und-opt-lk').css("opacity", "0.1");
	},

	handleEdit(e) {
		if(this.state.editing) return;
		const { reply } = this.props;
		this.setState({editing: true});
		this.props.handleReplyEdit(true, reply)
	},

	handleRemove() {
		const { reply, dispatch } = this.props;
		dispatch(CommentsActions.deleteComment(reply));
	},

	maskComment() {
		const { reply, dispatch } = this.props;
		dispatch(CommentsActions.maskComment(reply));
	},

	toggleOption(e) {
		e.preventDefault();
		const self = this;
		this.setState({option: !self.state.option})
	},

	componentDidUpdate(prevProps) {
		if(this.props.editingReply != prevProps.editingReply && !this.props.editingReply) {
			this.setState({
				editing: false, 
				option: false
			});
		}

		if(this.props.reply !== prevProps.reply) {
            this.props.recomputePostHeight();
        }
	},

	render() {
		const self = this,
		{ reply: {id, author, content, createdAt, liked, updated, images, failed, retrying }, dispatch } = this.props;
		return(
			<div className="und-div-a" onMouseOver={this.commentMouseHover} onMouseOut={this.commentMouseOut}>
				{!this.state.editing && 
					<div className="und-div-b">
		                <div className="und-div-left">
		                    <div className="und-div-profile-a" >
		                    	<Author.Photo type='undercomment' imgHeight={32} author={author} />
		                    </div>
		                </div>
		                <div className="und-div-right-a">
		                    <div className="und-head-a">
		                        <div className="und-head-name">
		                            <span className="und-sp-nm-ct">
		                            	<Author.Name className="und-link-name" author={author} />
		                            </span>
		                            <span className="under-content">
		                            	<BuildContent content={content} />
		                            </span>
		                        </div>
		                        {!!id && 
		                        	<div className="und-head-opt">
				                        <a href="" className="und-opt-lk" onClick={this.toggleOption}>
				                         	<i className="fa fa-chevron-down" aria-hidden="true"></i>
				                        </a>
				                     	{this.state.option && 
				                   			<Option 
					                   			reply={this.props.reply} 
					               				toggleOption={this.toggleOption} 
					               				handleEdit={this.handleEdit} 
					               				editing={this.props.editing} 
					               				handleRemove={this.handleRemove}
					               				maskReply={this.maskReply} 
					               				postAuthorId={this.props.postAuthorId}
					               				authorId={author.id} />
					                   	}
			                        </div>
			                    }
		                    </div>
		                    {images && images.length > 0 && 
		                    	<div className="und-img-container">
			                        <Photos 
			                        	{...this.props}
			                        	reply={this.props.reply} 
			                        	/>
			                    </div>
			                }
		                    {!!id && 
		                    	<div className="und-foo" >
			                        <div className="und-foo-left">
			                        	<span className="com-like-ctnr">
				                            <LikeButton 
				                            	object={this.props.reply} 
				                            	refer="undercomment" 
				                            	liked={liked} 
				                            	onLike={this.onLike}/>
				                        </span>
			                        </div>
			                        <span className="und-dv-dte">
		                                <span className="und-head-time" >
		                                	<span className={updated ? `op-dte dte-mdf` : `op-dte`}>
		                                   	 	<TimeAgo timestamp={createdAt} />
		                                 	</span>
		                                </span>
		                            </span>
			                    </div>
			                }
			                {!id &&
		                    	<div className="re-sbm-sp">
		                    		{failed && 
		                    			<div 
		                    				onClick={this.reSubmitReply} 
		                    				className="re-sbm-lk">
		                    				retry
		                    			</div>
		                    		}
		                    		{retrying && 
		                    			<div className="re-sbm-lk">retrying...</div>
		                    		}
		                    	</div>
		                    }
	                	</div>
	                </div>
                }
            </div>
		)
	}
})

//////
export default connect(state => ({
	authors: state.Authors.authors,
	user: state.User.user,
}))(Reply);