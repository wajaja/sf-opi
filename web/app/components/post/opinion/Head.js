import React 				from 'react'
import createReactClass 	from 'create-react-class'
import axios 				from 'axios'
import { connect } 			from 'react-redux'
import { ReactDOM } 		from 'react-dom'
import { TimeAgo } 			from '../../social/commons'
import { BASE_PATH } 		from '../../../config/api'
import bindFunctions 		from '../../../utils/bindFunctions'
import { Link } 			from 'react-router-dom'
import onClickOutside 		from 'react-onclickoutside'

import { Author } 			from '../avatars'
import Info 				from './Info'

import { 
	App as AppActions,
	PostForm as PostFormActions
} from '../../../actions/social'

const clickOutsideConfig = {
  	excludeScrollbar: true
};

const _Option  = onClickOutside(
	createReactClass({
		getInitialState() {
			return {
				option: false
			}
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
		////
		////
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

		////
		////
		render() {
			if(this.props.author.id === this.props.userId) {
				return this.renderForAuthor();
			} else {
				return this.renderForUser();
			}
		}
	}), clickOutsideConfig
)
const Option = connect(state => ({ userId: state.User.user.id }))(_Option)


const Head  = createReactClass({

	getInitialState() {

		return {
			option: false
		}
	},

	toggleOption(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.toggleOption();
	},

	toggleInfo () {
		this.props.toggleInfo();
	},

	handleEdit() {
		this.props.handleEdit(true);
	},

	handleRemove(e) {
		this.props.handleRemove();
	},

	maskPost() {
		this.props.maskPost();
	},

	favoritePost() {
		this.props.favoritePost();
	},

	render() {
		const { post, author, dispatch, info } = this.props;
		return (
			<div>
		        <div className="pst-ctnr-tp opn">
		           <div className="lft-pst-ctnr-tp" data-aut-arr="">	               
		                <Author.Photo author={author} imgHeight={40} />                           
		           </div>                                                    
		           <div className="rght-pst-ctnr-tp">
		               <div className="rght-pst-dv-aut" data-usr-id={author.id}>
		                   <Author.Name author={author} className="pst-aut-nm" />
		                   <a href="" className="pst-aut-pub">{author.username}</a>
		               </div>
		           </div>
		           <div className="rght-pst-ctnr-tp-abs">
		              <div className="rght-pst-ctnr-tp-abs-a">
		                <div className="pst-dv-dte" data-dte-cmp="">                                                            
		                   <span className="pst-dte">
		                   		<TimeAgo timestamp={post.createdAt} />
		                   </span>
		                </div>
		                <div className="op-opt-info">
						    <Info 
						    	post={post}
						    	info={info}
						    	dispatch={dispatch}
			                   	toggleInfo={this.toggleInfo} 
						    	/>
						</div>
		                <div className="pst-opt" data-pst-id={post.id}>
		                   	<span className="pst-opt-lk" onClick={this.toggleOption}>
		                   		
		                   	</span>
		                   	{this.props.option && 
		                   		<Option 
		                   			post={this.props.post} 
				                   	handleEdit={this.handleEdit} 
				                   	editing={this.props.editing} 
				                   	toggleOption={this.toggleOption} 
				                   	handleRemove={this.handleRemove}
				                   	favoritePost={this.favoritePost}
				                   	maskPost={this.maskPost} 
				                   	author={author} 
				                   	/>
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
	editPostFormFocus: state.App.editPostFormFocus,
	editingPost: state.App.editingPost
}))(Head);