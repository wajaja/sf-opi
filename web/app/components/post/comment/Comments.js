import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'
import bindFunctions 		from '../../../utils/bindFunctions'

import Comment 				from './Comment'

const Comments  = createReactClass({

	onLike () {
		this.props.onLike();
	},

	handleCommentEdit(status, editedComment) {
		this.props.handleCommentEdit(status, editedComment)
	},

	recomputePostHeight(){
		// this.recomputePostHeight
	},

	render() {
		const { comments, postAuthorId } = this.props;
		const self = this;
		return(
			<div className="gComment-s">
				{comments.map(function(comment, i) {
					return <Comment key={i} 
								comment={comment}
								onLike={self.onLike}
								recomputePostHeight={self.recomputePostHeight}
								handleCommentEdit={self.handleCommentEdit}
								editingComment={self.props.editingComment}
								{...self.props}
								/>
				})}
			</div>
		)
	}
})

export default connect(state =>({
	user: state.User.user
}))(Comments)