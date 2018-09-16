import React  			from 'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'
import { Link } 		from 'react-router-dom'
import Photos 			from './Photos' 
import axios 			from 'axios'
import _  				from 'lodash'
import { 
	BuildContent, Editors, Author, 
	TimeAgo, AddPostForm, Videos,
}    					from '../../../components'
import { Option } 		from './Head'
import { BASE_PATH } 	from '../../../config/api'
import { 
	Posts as PostsActions,
	Authors as AuthorsActions 
} 							from '../../../actions'

const Allie  = createReactClass({
	getInitialState() {
		return {
			option: false,
			editing: false,
			allie: undefined,
			nextPostForm: false,
		}
	},

	getDefaultProps() {
		return {
			selectedText: ''
		}
	},

	onAddToPost () {
		this.props.onAddToPost();
	},

	nextPost(e) {
		this.props.nextPost();
    },

	componentWillMount() {
		const { mainPost: {id, nbAllies }, editor, allies} = this.props;
			const allie = allies.filter((allie, i) => {
				for(var prop in allie) {
					return allie[prop].mainAllieId === id && 
						   allie[prop].author.id === editor.id
				}
			})
			.map((allie, i) => {
                for(var prop in allie) {
                    return allie[prop];
                }
            })[0];
			this.setState({allie: allie})
	},

	componentWillUpdate(nextProps, nextState) {
		const { mainPost: {id, nbAllies }, editor} = this.props;
		if((this.props.allies !== nextProps.allies)) {
			const allie = nextProps.allies.filter((allie, i) => {
				for(var prop in allie) {
					return allie[prop].mainAllieId === id && 
						   allie[prop].author.id === editor.id
				}
			})
			.map((allie, i) => {
                for(var prop in allie) {
                    return allie[prop];
                }
            })[0];
			this.setState({allie: allie})
		}		
	},

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.nextPostForm !== nextProps.nextPostForm ||
			this.state !== nextState
	},

	cancelNextPost () {
		this.props.cancelNextPost();
	},

	render() {
		const { allie } = this.state, 
		{ editor, user, mainPost, nextPostForm } = this.props;

		if(allie) {
			const { nbAllies, content, participants, videos, images } = allie;
		}

		return(
			<div className="edtr-ctnr">
                <div className="edtr-ctnr-a">
                	<div className="lft-pst-ctnr">
                		<div className="lft-pst-ctnr-a">		               
		                	<Author.Photo author={editor} imgHeight={40} />  
		                </div>	                         
		            </div>                                                    
		            <div className="rght-pst-ctnr">
		                <div className="rght-pst-dv-aut">
		                	{allie !== undefined &&
			                   	<div className="multi-pst-ctnr-mdl-a">
		                           	<div className="multi-dv-txt-ctn">
		                               	<div className="multi-pst postContent" >
		                               		<BuildContent 
		                               			content={content} 
		                               			selectedText={this.props.selectedText}
		                               			/>
		                               	</div>
		                           	</div>
		                           	<div className="multi-pst-dv-img-ctn">
		                               	<div className="multi-pst-dv-img-ctn-a">
		                                   	<div className="multi-pst-dv-img-ctn-b">		                                       	
		                                       	{images.length > 0 && videos.length === 0 && 
		                                       		<div className="multi-pst-dv-img">
			                                       		<Photos 
			                                       			{...this.props}
			                                       			images={images}
			                                       			post={allie}
			                                       			/>
			                                       </div>
			                                    }
		                                       	{videos.length > 0 && 
		                                       		<div className="multi-pst-dv-vdeos">
			                                       		<Videos 
			                                       			{...this.props}
			                                       			videos={videos}
			                                       			post={allie}
			                                       			/>
			                                       </div>
			                                   }
		                                   </div>
		                               </div>
		                           </div>
		                        </div>
		                    }
		                    { allie === undefined && user.id !== editor.id &&
		                    	<div className="empty-content">...</div>}
		                    { allie === undefined && user.id === editor.id &&
		                    	<span className="add-content" onClick={this.nextPost}>add</span>}
		                </div>
		                {nextPostForm && editor.id === user.id && 
		                	<div className="nxt-frm-ctnr">
                                <div className="nxt-frm-ctnr-a">
                                    <span className="nxt-abord" onClick={this.cancelNextPost}>
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </span>
                                    <AddPostForm 
	                    				postId={mainPost.id}
	                    				refer="opinion"
	                    				user={this.props.user}
	                    				post={this.props.mainPost}
	                    				onAddToPost={this.onAddToPost}
	                    				/>
                                 </div>
                            </div>
                    	}
		           </div>
		        </div>
            </div>
		)
	}
})

//////
/////
const WithAllies  = createReactClass({

	getInitialState() {
		return {}
	},

	nextPost () {
		this.props.nextPost();
    },

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

	onShare(postId, refer) {
		this.props.onShare(postId, refer);
	},

	componentWillMount() {
		
	},

	componentWillUpdate(nextProps, nextState) {
		const { mainPost: {id, nbAllies }} = this.props;
		// if((this.props.allies !== nextProps.allies) && (nbAllies > 0)) {
		// 	const allies = nextProps.allies.filter((allie, i) => {
		// 		for(var prop in allie) {
		// 			return allie[prop].mainAllieId === id && 
		// 				   allie[prop].opinionOrder === nbAllies
		// 		}
		// 	})
		// 	.map(function(allie, i) => {
  //               for(var prop in allie) {
  //                   return allie[prop];
  //               }
  //           })[0];
		// 	console.log(recentAllie)
		// 	this.setState({allies: allies})
		// }
	},

	shouldComponentUpdate(nextProps) {
		return this.props.mainPost !== nextProps.mainPost ||
			this.props.option !== nextProps.option ||
			this.props.nbAllies !== nextProps.nbAllies;
	},

	render() {
		let { mainPost:
				{editors, participants, createdAt, content, author, videos, images }, 
			 nextPostForm, option, nbAllies } = this.props,
			self 					= this;

		return(
			<div className="multi">
				<div className="pst-ctnr-tp" >
		            <div className="rght-pst-ctnr-tp-abs">
			            <div className="rght-pst-ctnr-tp-abs-a">
			                <div className="pst-dv-dte">                                                            
				                <span className="pst-dte">
				                    <TimeAgo timestamp={createdAt} />
				                </span>
				            </div>
				            <div className="pst-opt">
				                <span href="" className="pst-opt-lk" onClick={this.toggleOption}></span>
				                {option && 
				                   	<Option 
			                   			post={this.props.post} 
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
				<div className="pst-ctnr-mdl pls-edtrs">
					<div className="pst-ctnr-mdl-main">
						<div className="main-ctnr">
			                <div className="main-ctnr-a">
			                	<div className="lft-pst-ctnr">
			                		<div className="lft-pst-ctnr-a">
							        	{editors.map(function(editor, i) {
											return <Author.Name author={editor} className="pst-aut-nm" />
							        	})}                     
					            	</div>
					            </div>                                                    
					            <div className="rght-pst-ctnr">
					                <div className="rght-pst-dv-aut">	
					               </div>
					           </div>
					        </div>
			            </div>
			        </div>
			        <div className="pst-ctnr-mdl-edtrs">
				        <div className="edtr-ctnr">
			                <div className="edtr-ctnr-a">
			                	<div className="lft-pst-ctnr">
			                		<div className="lft-pst-ctnr-a">		               
					                	<Author.Photo author={author} imgHeight={40} />  
					                </div>	                         
					            </div>                                                    
					            <div className="rght-pst-ctnr">
					                <div className="rght-pst-dv-aut">
								        <div className="multi-pst-ctnr-mdl-a">
					                       	<div className="multi-dv-txt-ctn">
					                           	<div className="multi-pst postContent" >
					                           		<BuildContent 
					                           			content={content}
					                           			selectedText={this.props.selectedText}
					                           			/>
					                           	</div>
					                       	</div>
					                       	<div className="multi-pst-dv-img-ctn">
					                           	<div className="multi-pst-dv-img-ctn-a">
					                               	<div className="multi-pst-dv-img-ctn-b">
					                               		{images.length > 0 && videos.length === 0 && 
					                                   		<div className="multi-pst-dv-img">
					                                       		<Photos 
					                                       			{...this.props}
					                                       			images={this.props.mainPost.images}
					                                       			post={this.props.mainPost}
					                                       			/>
					                                       </div>
					                                    }
					                                   	{videos.length > 0 && 
					                                   		<div className="multi-pst-dv-vdeos">
					                                       		<Videos 
					                                       			{...this.props}
					                                       			videos={this.props.mainPost.videos}
					                                       			post={this.props.mainPost}
					                                       			/>
					                                       </div>
					                                   }
					                               </div>
					                           </div>
					                       </div>
					                   </div>
				                   </div>
	                           </div>
	                       </div>
	                    </div>
			        	{editors.map(function(editor, i) {
							return <Allie 
										key={i} 
										{...self.props} 
										editor={editor} 
										nextPost={self.nextPost}
										nextPostForm={nextPostForm}
										onAddToPost={self.onAddToPost}
										/>
			        	})}
				    </div>
				</div>
				<div className="pst-ctnr-btm">
            		{participants.length > 0 && 
            			<div className="pst-dv-partic-ctn">
                			<div className="pst-dv-partic-ctn">
                        		{participants.map(function(user, i) {
		                        	if(i > 2 && i < participants.length - 2) return;
		                        	if(i > 2 && i == participants.length - 1) return <a key={i} href=""  className="pls-partic-lk">and {post.participants.length - 3} persons</a>;
									return (
										<Link key={i} to={user.username} className="partic-usr">
											{user.firstname} {user.lastname}
										</Link>
									)
								})}
							</div>
						</div>
					}
				</div>
			</div>
		)
	}
})

////
////
export default connect(state => ({
	allies: state.Posts.allies,
	user: state.User.user,
}))(WithAllies)