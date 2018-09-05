import React 				from 'react'
import createReactClass 	from 'create-react-class'
import axios 				from 'axios'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'
import ReactDOM 			from 'react-dom'
import onClickOutside 		from 'react-onclickoutside'

import { TimeAgo } from '../../social/commons'
import { BASE_PATH } from '../../../config/api'
import bindFunctions from '../../../utils/bindFunctions'

import { Editors, Author } from '../avatars'
import { 
	App as AppActions,
	PostForm as PostFormActions
} from '../../../actions/social'

const clickOutsideConfig = {
  	excludeScrollbar: true
};

export const Option  = onClickOutside(
	createReactClass({

		getInitialState() {
			return {
				option: false
			}
		},

		//method from 'react-onclickoutside' module
		handleClickOutside(e) {
		    // ..handling code goes here... 
		    this.props.toggleOption(e)
		},

		getPost() {
			const self 	= this;
			return axios.get(`${BASE_PATH}/api/posts/edit/${self.props.post.id}`);
		},

		handleEdit(e) {
			e.preventDefault();
			if(!this.props.editingPost) {
				const { dispatch } = this.props;
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
		                    <a href="" className="pst-opt-favorite" data-pst-id={this.props.post.id} onClick={this.favoritePost}>
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
	}), clickOutsideConfig
)


const Head  = createReactClass({

	getInitialState() {
		return {
			option: false
		}
	},

	handleEdit() {
		this.props.handleEdit(true);
	},

	handleRemove() {
		this.props.handleRemove();
	},

	maskPost() {
		this.props.maskPost()
	},

	favoritePost() {
		this.props.favoritePost();
	},

	toggleOption(e) {
		e.stopPropagation();
		this.props.toggleOption();
	},

	componentDidUpdate(prevProps, prevState) {
		// if(this.props.authors != prevProps.authors) {
		// 	this.props.authors.forEach(function(author){
		// 		console.log(author);
		// 	});
		// }
	},

	render() {
		const { post, author, userId, dispatch } = this.props;		
		return (
			<div>
		        <div className="pst-ctnr-tp" >
		           <div className="lft-pst-ctnr-tp">	               
		                <Author.Photo author={author} imgHeight={40} />                           
		           </div>                                                    
		           <div className="rght-pst-ctnr-tp">
		               <div className="rght-pst-dv-aut">
		               		<Author.Name author={author} className="pst-aut-nm" />
		               </div>
		           </div>
		           <div className="rght-pst-ctnr-tp-abs">
		              <div className="rght-pst-ctnr-tp-abs-a">
		                <div className="pst-dv-dte" data-dte-cmp="">                                                            
		                   <span className="pst-dte">
		                   		<TimeAgo timestamp={post.createdAt} />
		                   </span>
		                </div>
		                <div className="pst-opt">
		                   	<span className="pst-opt-lk" onClick={this.toggleOption}>
		                   	</span>
		                   	{this.props.option && 
		                   		<Option 
		                   			userId={userId}
		                   			post={this.props.post} 
		                   			dispatch={dispatch}
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
		       </div>
			</div>
	    )	
	}
})
//////
export default connect(state =>({
	userId: state.User.user.id,
	editPostFormFocus: state.App.editPostFormFocus,
	editingPost: state.App.editingPost,
}))(Head);