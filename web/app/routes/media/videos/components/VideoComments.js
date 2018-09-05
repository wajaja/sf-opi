import React  					from 'react'
import createReactClass  		from 'create-react-class'
import { connect } 				from 'react-redux'
import { Scrollbars } 				from 'react-custom-scrollbars';
import { Comments, CommentForm,
		 EditCommentForm } 		from '../../../../components'

const VideoComments  = createReactClass({

	getInitialState() {
		return {
			comments: [],
			scroll_height: 300,
			editingComment: false
		}
	},

	handleCommentEdit(){

	},

	componentDidMount() {
		const winHeight = window.innerHeight,
        photo_height = (winHeight - (25 * 2)),
        scroll_height = (photo_height - 60 - 60 - 23 );
        this.setState({
            scroll_height: scroll_height
        })
        console.log('my scroll in comments', scroll_height)
	},

	render() {
		const { editingComment, scroll_height } = this.state,
		{ photo: { author, id }, comments } = this.props;
		return (
			<div className="cmts-ctnr">
                <div className="cmts-ctnr-a">
                	{id && comments.length > 0 &&
	                	 <Scrollbars
                			style={{ height: scroll_height }}>
                            <Comments 
                                comments={comments} 
                                postAuthorId={author.id}
                                editingComment={editingComment}
                                handleCommentEdit={this.handleCommentEdit} 
                                postId={id}
                                {...this.props} />
	                   	</Scrollbars>
                    }
                </div>
                <div className="frm-ctnr">
	                {id && 
	                	<div className="frm-ctnr-a">
		                    {!editingComment && 
		                    	<CommentForm 
	        						postId={id} 
	        						post={this.props.photo} 
	        						refer='photo'/>}
			                {editingComment && 
			                    <EditCommentForm 
			                        post={this.props.photo} 
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
}))(VideoComments)