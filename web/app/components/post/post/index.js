import React  			from 'react'
import { connect } 		from 'react-redux'
import createReactClass from 'create-react-class'

import bindFunctions 	from '../../../utils/bindFunctions'
import Basic 			from './Basic'
import { Opinion } 		from '../opinion'

import '../../../styles/social/news.scss'

const Post  = createReactClass({

	getInitialState(props){
		return {
			socketSession: {}
		}
	},

	onComment(comment) {
		const post = this.props.post
		this.props.onComment(comment, post)
	},

	onSideComment(comment, side) {
    	const post = this.props.post
        this.props.onSideComment(comment, side, post)
    },

	onLike(data) {
		const post = this.props.post
		this.props.onLike(data, post)
	},

	onShare(postId, refer) {
        this.props.onShare(postId, refer)
    },

    editPostFormFocus(val) {
    	this.props.editPostFormFocus(val)
    },

	shouldComponentUpdate(nextProps) {
		return (this.props.post !== nextProps.post);
	},

	recomputePostHeight(){
		const index = this.props.index;
		this.props.recomputePostHeight(index);
	},

	render () {
		return(
			<div className="pst-d" >
				{this.props.post.type == 'post' && 
					<Basic 
						{...this.props}
						onLike={this.onLike}
						onShare={this.onShare}
						onComment={this.onComment}
						editPostFormFocus={this.editPostFormFocus}
						recomputePostHeight={this.recomputePostHeight}
						/>
				}
				{this.props.post.type == 'opinion' && 
					<Opinion 
						{...this.props}
						onLike={this.onLike}
						onShare={this.onShare}
						onComment={this.onComment}
						onSideComment={this.onSideComment}
						editPostFormFocus={this.editPostFormFocus}
						recomputePostHeight={this.recomputePostHeight}
						/>
				}
            </div>    
		)
	}
})
////
////
export default connect(state => ({
	editingPost: state.App.editingPost,
	// editPostFormFocus: state.App.editPostFormFocus,
	authors: state.Authors.authors,
}))(Post);