import React 				from 'react'
import createReactClass 	from 'create-react-class'
import _ 					from 'lodash'
import { connect } 			from 'react-redux'

import bindFunctions from '../../../utils/bindFunctions'

import Head from './Head'
import Body from './Body'
import Foot from './Foot'

import MyLoadable    from '../../../components/MyLoadable'
const EditPostForm = MyLoadable({loader: () => import('../post/form/EditPostForm')}),
AddPostForm 	= MyLoadable({loader: () => import('../post/form/AddPostForm')}),
WithAllies 	= MyLoadable({loader: () => import('./WithAllies')})


import { 
	Posts as PostsActions,
	Comments as CommentsActions
} from '../../../actions'

import '../../../styles/social/news.scss'

const Basic  = createReactClass({

	getInitialState(){
		return {
			option: false,
			editing: false,
			nextPostForm: false,
			submittingPost: false,
		}
	},

	getDefaultProps() {
		return {
			fullPage: false
		}
	},
	
	session: undefined,

	onLike(value, postId, refer) {
        this.props.onLike();
    },

    onShare(postId, e) {
        e.preventDefault();
        this.props.onShare(postId, 'post');
    },

    onComment(comment) {
        e.preventDefault();
        this.props.onComment(comment);
    },

	nextPost(e) {
		console.log('nextPost');
        this.setState({nextPostForm: true});
    },

	onShare(postId, refer) {
		this.props.onShare(postId, refer);
	},

	handleEdit(val) {
		if(this.props.editingPost) return;
        this.props.editPostFormFocus(val)
		this.setState({editing: val})
	},

	handleRemove () {
		const { post, dispatch } = this.props;
		dispatch(PostsActions.deletePost(post));
	},

	maskPost () {
		const { post, dispatch } = this.props;
		dispatch(PostsActions.maskPost(post));
	},

	favoritePost () {
		const { post, dispatch } = this.props;
		dispatch(PostsActions.favoritePost(post));
	},

	hasClass(element, cls) {
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	},

	postMouseHover(e) {
		this.setState({hover: true})
		$(e.target).find('.pst-opt-lk').css("opacity", "1");
	},

	postMouseOut(e) {
		this.setState({hover: false})
		$(e.target).find('.pst-opt-lk').css("opacity", "0.3");
	},

	toggleOption() {
		const self = this;
		this.setState({option: !self.state.option})
	},

	postClick(e) {
		this.setState({option: false})
	},

	componentWillMount() {
		
	},

	componentDidMount() {
		const self 		= this,
		webSocket 		= WS.connect("ws://127.0.0.1:8080"),
    	// news_containers = window.document.getElementsByClassName("new-pst"),
		{ post: {id, type, author, question_ids }, dispatch } = this.props,
		postAuthorId 	= author.id;

       	//animate opacity after prepreding data to news div container 
       	// COMMENTED FOR SERVER SIDE RENDERING
        // for (var i = 0; i < news_containers.length; i++) {
        // 	if(!this.hasClass(news_containers[i], 'appended')) {
        // 		window.getComputedStyle(news_containers[i]).opacity;
        //    		news_containers[i].className += ' appended';
        // 	}
        // }

        //realtime updates
		webSocket.on("socket/connect", (session) => {
		    this.session = session;
		    this.session.subscribe(`comment/channel/${id}/post`, function(uri, payload){
		    	if(payload.data) {
			        const comment = JSON.parse(payload.data).data
			        dispatch({type: 'PUBLISH_COMMENT', comment, uri})
		    	}
		    });

		    this.session.subscribe(`like/channel/${id}/post`, function(uri, payload){
		        if(payload.data) {
		    		console.log('ooooooooooooooooooo')
			        const like = JSON.parse(payload.data).data
			        dispatch({type: 'PUBLISH_LIKE', like, uri})
		    	}
		    });

		    this.session.subscribe(`share/channel/${id}/post`, function(uri, payload){
		        if(payload.data) {
		    		console.log('ooooooooooooooooooo')
			        const like = JSON.parse(payload.data).data
			        dispatch({type: 'PUBLISH_SHARE', like, uri})
		    	}
		    });

		    _.each(question_ids, (question_id) => {
			    this.session.subscribe(`question/channel/${id}/${question_id}`, function(uri, payload){
			        if(payload.data) {
			    		console.log('ooooooooooooooooooo')
				        const share = JSON.parse(payload.data).data
				        dispatch({type: 'PUBLISH_SECRET', share, uri})
			    	}
			    });		    	
		    })
		})

		webSocket.on("socket/disconnect", function(error){
			console.log("Disconnected for " + error.reason + " with code " + error.code);
		})
	},

	onAddToPost () {
		this.setState({nextPostForm: false});
	},

	getAuthor () {
		const { post, authors } = this.props;
		console.log(authors);
	},

	cancelNextPost () {
		this.setState({nextPostForm: false});
	},

	onComment(comment) {
        this.props.onComment(comment);
    },

	componentDidUpdate(prevProps, prevState) {
		if(this.props.editingPost != prevProps.editingPost && !this.props.editingPost) {
			this.setState({editing: false})
		}

		if( this.state.editing !== prevState.editing) {
            this.props.recomputePostHeight();
        }
	},

	componentWillUpdate(nextProps, nextState) {

	},

	toggleSubmittingPost() {
		const self = this
		this.setState({submittingPost: !self.state.submittingPost})
	},
	////
	////
	render() {
		const { post: { editors, author }, authors, serverSide } = this.props, 
			  { nextPostForm, editing, option, submittingPost } 		= this.state;

		if(serverSide) {
			return <PostHolder post={this.props} />
		}
		
		if(editors.length > 0 ) {
			return (
				<div 
					className={editing ? `pst-e editing` : `pst-e`} 
					onMouseOver={this.postMouseHover} 
					onMouseOut={this.postMouseOut} 
					onClick={this.postClick}>		
		            {editing && 
	                    <span className="edit-abord" onClick={this.cancelEdit}>
	                        <i className="fa fa-times" aria-hidden="true"></i>
	                    </span>
	            	}
		            <div className="pst-gap-ctnr">
		                 <div className={editing ? `pst-edt-out editing` : `pst-edt-out`}></div>
		            </div>
		            <div className="pst-f" >
		            	{nextPostForm && 
	                        <span className="nxt-abord" onClick={this.cancelNextPost}>
	                            <i className="fa fa-times" aria-hidden="true"></i>
	                        </span>
	                	}
		            	<div className={nextPostForm ? `add-black-drop in` : `add-black-drop out` }></div>
		                <div className="pst-g">
		                    {!this.state.editing &&
		                    	<div className="pst-h" >
			                        <div className="pst-i" >
			                            <div className="pst-j">
			                                <div className="pst-ctnr" >
			                                   	<WithAllies 
			                                   		{...this.props}
			                                   		option={option} 
		                                       		editing={editing}
		                                       		submittingPost={submittingPost}
		                                       		nextPost={this.nextPost} 
		                                       		maskPost={this.maskPost}
		                                       		onComment={this.onComment}
			                                   		mainPost={this.props.post}
			                                   		nextPostForm={nextPostForm}
		                                       		handleEdit={this.handleEdit} 
		                                       		onAddToPost={this.onAddToPost}
		                                       		toggleOption={this.toggleOption}
		                                       		favoritePost={this.favoritePost} 
		                                       		handleRemove={this.handleRemove}
		                                       		cancelNextPost={this.cancelNextPost}
			                                   		/>
			                                </div>
			                            </div>
			                        </div>
			                    </div>
		                 	}
		                 	{editing && 
		                 		<EditPostForm 
		                 			{...this.props}
		                 			type="WithAllies"
		                 			post={this.props.post} 
		                 			handleEdit={this.handleEdit}
		                 			editPostFormFocus={this.props.editPostFormFocus}
		                 			toggleSubmittingPost={this.toggleSubmittingPost}
		                 			recomputePostHeight={this.props.recomputePostHeight}
		                 			/>
		                 	}                  
	                    	<Foot 
		                    	{...this.props} 
		                    	type="WithAllies"
		                    	editing={editing}
		                    	onComment={this.onComment}
		                    	onLike={this.onLike}
		                    	onShare={this.onShare}
		                    	recomputePostHeight={this.props.recomputePostHeight}
		                    	/>
		                </div>
		            </div>
	        	</div>
			)
		}
		/////
		/////
		return(
			<div className={editing ? `pst-e editing` : `pst-e`} onMouseOver={this.postMouseHover} onMouseOut={this.postMouseOut} onClick={this.postClick}>		
	            <div className="pst-gap-ctnr">
	                 <div className={editing ? `pst-edt-out editing` : `pst-edt-out`}></div>
	            </div>
	            <div className="pst-f" >
	                <div className="pst-g">
	                    {!this.state.editing &&
	                    	<div className="pst-h" >
		                        <div className="pst-i" >
		                            <div className="pst-j">
		                                <div className="pst-ctnr" >
		                                   	<div>
		                                       	<Head {...this.props} 
		                                       		author={author}
		                                       		option={option} 
		                                       		editing={editing} 
		                                       		maskPost={this.maskPost}
		                                       		handleEdit={this.handleEdit} 
		                                       		toggleOption={this.toggleOption}
		                                       		favoritePost={this.favoritePost} 
		                                       		handleRemove={this.handleRemove}
		                                       		/>
		                                   	</div>
		                                   	<div className="pst-bdy-ctnr">
		                                    	<Body 
		                                    		{...this.props} 
			                                		submittingPost={this.state.submittingPost}
			                                		/>
		                                   	</div>
		                                </div>
		                            </div>
		                        </div>
		                    </div>
	                 	}
	                 	{editing && 
	                 		<EditPostForm 
	                 			type="Simple"
	                 			post={this.props.post}
	                 			handleEdit={this.handleEdit} 
	                 			editPostFormFocus={this.props.editPostFormFocus}
	                 			toggleSubmittingPost={this.toggleSubmittingPost}
	                 			recomputePostHeight={this.props.recomputePostHeight}
	                 			/>
	                 	}
	                    {!this.props.fullPage && 
	                    	<Foot 
		                    	{...this.props} 
		                    	type="Simple"
		                    	editing={editing}
		                    	onLike={this.onLike}
		                    	onShare={this.onShare}
		                    	onComment={this.onComment}
		                    	recomputePostHeight={this.props.recomputePostHeight}
		                    	/>
	                    }
	                </div>
	            </div>
        	</div>
		)
	}
})

export default connect(null)(Basic);