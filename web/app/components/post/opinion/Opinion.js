import React 				from 'react'
import createReactClass 	from 'create-react-class'
import _ 					from 'lodash'
import { connect } 			from 'react-redux'
import bindFunctions 		from '../../../utils/bindFunctions'
import { 
	Head as OHead, 
	Body as OBody, 
	Foot as OFoot
} from '../opinion'
import OpinionHolder from './OpinionHolder'

import MyLoadable    from '../../../components/MyLoadable'
const EditPostForm = MyLoadable({loader: () => import('../post/form/EditPostForm')}),
AddPostForm 	= MyLoadable({loader: () => import('../post/form/AddPostForm')})


import { 
	Posts as PostsActions,
	Comments as CommentsActions
} from '../../../actions'

import '../../../styles/social/news.scss'

const Opinion  = createReactClass({

	getInitialState(){

		return {
			info: false,
			option: false,
			editing: false,
			nextPostForm: false,
			submittingPost: false,
		}
	},

	getDefaultProps() {
		return {
			selectedText: '',
		}
	},

	onLike(value, postId, refer) {
        this.props.onLike(value, postId, refer);
    },

    onSideComment(comment, side) {
    	const postAuthorId = this.props.post.author._id["$id"]
        this.props.onSideComment(comment, side, postAuthorId)
    },

    onComment(comment) {
		const postAuthorId = this.props.post.author._id["$id"]
		this.props.onComment(comment, postAuthorId)
	},

	nextPost(e) {
        this.setState({nextPostForm: true});
    },

    subcribe(e) {
    	console.log('subcribing...')
    	const {userID, postId, dispatch } = this.props;
		dispatch(PostsActions.subcribe(postId, userID))
    },

	onShare(postId, refer) {
		this.props.onShare(postId, refer);
	},


	handleEdit(val) {
		if(this.props.editingPost) return;
        this.props.editPostFormFocus(val)
		this.setState({editing: val})
	},

	handleRemove() {
		const { post, dispatch } = this.props;
		dispatch(PostsActions.deletePost(post));
	},

	maskPost() {
		const { post, dispatch } = this.props;
		dispatch(PostsActions.maskPost(post));
	},

	favoritePost() {
		const { post, dispatch } = this.props;
		dispatch(PostsActions.favoritePost(post));
	},

	hasClass(element, cls) {
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	},

	postMouseHover(e) {
		$(e.target).find('.pst-opt-lk').css("opacity", "1");
		this.setState({hover: true})
	},

	postMouseOut(e) {
		$(e.target).find('.pst-opt-lk').css("opacity", "0.3");
		this.setState({hover: false})
	},

	toggleOption () {
		const self = this;
		this.setState({option: !self.state.option})
	},

	toggleInfo () {
		const self = this
		this.setState({info: !self.state.info})
	},

	postClick(e) {
		this.setState({option: false})
	},

	displayOpinion(order) {
		const { router, post } = this.props,
			route = `/opinions/${post.id}?allie_id=${order}`;

		router.push(route);
	},

	componentWillMount() {
		
	},

	componentDidMount() {
        const self 		= this,
		webSocket 		= WS.connect("ws://127.0.0.1:8080"),
        news_containers = window.document.getElementsByClassName("new-pst"),
		{ post: {id, type, author, allie_ids, opinionOrder }, dispatch } = this.props;

       	//animate opacity after prepreding data to news div container 
        for (var i = 0; i < news_containers.length; i++) {
        	if(!this.hasClass(news_containers[i], 'appended')) {
        		window.getComputedStyle(news_containers[i]).opacity;
           		news_containers[i].className += ' appended';
        	}
        }


		webSocket.on("socket/connect", (session) => {
		    this.socketSession = session;

		    this.socketSession.subscribe(`left/channel/${id}`, (uri, payload) => {
		    	if(payload.data) {
			        const comment = JSON.parse(payload.data).data
			        console.log(comment)
			        dispatch({type: 'PUBLISH_LEFT', comment, id, opinionOrder})
		    	}
		    });

		    this.socketSession.subscribe(`right/channel/${id}`, (uri, payload) => {
		    	if(payload.data) {
			        const comment = JSON.parse(payload.data).data
			        console.log(comment)
			        dispatch({type: 'PUBLISH_RIGHT', comment, id, opinionOrder})
		    	}
		    });

		    _.each(allie_ids, (allie_id, i) => {
		    	const order = i + 1
			    this.socketSession.subscribe(`left/channel/${allie_id}`, (uri, payload) => {
			    	if(payload.data) {
				        const comment = JSON.parse(payload.data).data
				        console.log(comment)
				        dispatch({type: 'PUBLISH_LEFT', comment, id, order})
			    	}
			    });

			    this.socketSession.subscribe(`right/channel/${allie_id}`, (uri, payload) => {
			    	if(payload.data) {
				        const comment = JSON.parse(payload.data).data
				        console.log(comment)
				        dispatch({type: 'PUBLISH_RIGHT', comment, id, order})
			    	}
			    });
		    })

		    this.socketSession.subscribe(`rate/channel/${id}`, (uri, payload) => {
		        if(payload.data) {
			        const rate = JSON.parse(payload.data).data
			        dispatch({type: 'PUBLISH_RATE', rate, id, opinionOrder})
		    	}
		    });

		    this.socketSession.subscribe(`share/channel/${id}/post`, (uri, payload) => {
		        if(payload.data) {
			        const share = JSON.parse(payload.data).data
			        dispatch({type: 'PUBLISH_SHARE', share, id, opinionOrder})
		    	}
		    });

		    this.socketSession.subscribe(`nextPost/channel/${id}`, (uri, payload) => {
		        if(payload.data) {
			        const nextPost = JSON.parse(payload.data).data
			        dispatch({type: 'PUBLISH_NEXT_POST', nextPost, id, opinionOrder})
		    	}
		    });
		})

		webSocket.on("socket/disconnect", function(error){
			console.log("Disconnected for " + error.reason + " with code " + error.code);
		})   
	},

	onAddToPost(post) {
		this.setState({nextPostForm: false})
	},

	toggleSubmittingPost() {
		const self = this
		this.setState({submittingPost: !self.state.submittingPost})
	},

	cancelNextPost () {
		this.setState({nextPostForm: false})
	},

	componentDidUpdate(prevProps, prevState) {
		if(this.props.editingPost != prevProps.editingPost && !this.props.editingPost) {
			this.setState({editing: false})
		}
	},

	componentWillUpdate(nextProps, nextState) {

	},

	render () {
		const { post, authors, dispatch } = this.props,
		 	  { nextPostForm, editing, info, option, submittingPost } 		= this.state, 
		author = post.author,
		authorId = author.id;
		return(
			<div className={editing ? `pst-e editing` : `pst-e`} onMouseOver={this.postMouseHover} onMouseOut={this.postMouseOut} onClick={this.postClick}>           
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
		        	<div className={ nextPostForm ? `add-black-drop in` : `add-black-drop out` }></div>
		            <div className="pst-g">
		                {!this.state.editing && 
			                <div className="pst-h">
			                    <div className="pst-i" >
			                        <div className="pst-j">
			                            <div className="pst-ctnr" >
			                               <div>
			                                   	<OHead 
			                                   		info={info}
			                                   		{...this.props}
			                                   		author={author}
			                                   		option={option} 
			                                   		editing={editing}
			                                   		maskPost={this.maskPost}
			                                   		toggleInfo={this.toggleInfo} 
			                                   		handleEdit={this.handleEdit} 
			                                   		toggleOption={this.toggleOption}
			                                   		favoritePost={this.favoritePost}
			                                   		handleRemove={this.handleRemove} 
			                                   		/>
			                               </div>
			                               <div className={ nextPostForm ? `pst-bdy-ctnr in` : `pst-bdy-ctnr out` }>
			                                	<OBody 
			                                		{...this.props} 
			                                		mainPost={post}
			                                		submittingPost={submittingPost}
			                                		displayOpinion={this.displayOpinion}
			                                		nextPostForm={nextPostForm}
			                                		/>
			                                	{nextPostForm && 
			                                		<div className="nxt-frm-ctnr">
				                                        <div className="nxt-frm-ctnr-a">
				                                            <AddPostForm 
			                                    				postId={post.id}
			                                    				refer="opinion"
			                                    				post={post}
			                                    				onShare={this.onShare}
			                                    				user={this.props.user}
			                                    				onAddToPost={this.onAddToPost}
			                                    				/>
				                                         </div>
				                                    </div>
		                                    	}
			                               </div>
			                             </div>
			                         </div>
			                     </div>
			                </div>
			            }
		                {this.state.editing && 
		                	<EditPostForm 
		                		post={post} 
		                		handleEdit={this.handleEdit} 
		                		toggleSubmittingPost={this.toggleSubmittingPost}
		                		/>}
		                <OFoot 
		                	nextPostForm={nextPostForm}
		                	onRate={this.onRate}
		                	nextPost={this.nextPost}
		                	subscribe={this.subscribe}
		                	editing={this.state.editing}
		                	onLike={this.onLike}
		                	onComment={this.onComment}
		                	onSideComment={this.onSideComment}
		                	{...this.props} 
		                	/>
		            </div>
		        </div>
		    </div>
	    )
	}
})

export default connect(null)(Opinion);