import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'
import Photos 			from './Photos' 
import axios 			from 'axios'
import _  				from 'lodash'
import { 
	BuildContent, Editors, Author, Videos
}    					from '../../../components'
import { BASE_PATH } 	from '../../../config/api'
import { 
	Posts as PostsActions,
	Authors as AuthorsActions 
} 							from '../../../actions'

const  he = require('he');

const Body  = createReactClass({

	getInitialState() {
		return {

		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.post !== nextProps.post;
	},
 
	render() {
		let contentClassnames = 'postContent',
		{ post, nextPostForm, dispatch, submittingPost } = this.props,
			{ nbAllies, content, participants, videos, images } = post;

		if(typeof content === 'string') {
			const stripedHtml = content.replace(/<[^>]+>/g, ''),
			// myString.replace(/<(?:.|\n)*?>/gm, '');
			chars = he.decode(stripedHtml).length

			if(chars === 0)
	        	contentClassnames = 'postContent';
	        else if(chars <= 120)
	        	contentClassnames = 'big postContent';
	        else if(chars <= 300)
	        	contentClassnames = 'normal postContent';
	        else
	        	contentClassnames = 'small postContent';
	    }
		return (
        	<div className="pst-ctnr-mdl">	        	
        		<div className="simple">
	        		{post.images.length > 0 && 
		                <div className="rght-pst-ctnr-mdl-a">
		                    <div className="pst-dv-txt-ctn">
		                       <div id="postContent" className={contentClassnames} >
		                       		<BuildContent 
		                       			content={content} />
		                       </div>
		                   	</div>
		                   	<div className="pst-dv-img-ctn">
		                       	<div className="pst-dv-img-ctn-a">
		                           	<div className="pst-dv-img-ctn-b">
		                               	{images.length > 0 && videos.length === 0 && 
		                               		<div className="pst-dv-img">
		                                    <Photos 
			                                   		{...this.props}
			                                   		images={post.images}
			                                   		post={post}
			                                   		 />
			                               </div>
			                            }
		                                {videos.length > 0 && 
		                                	<div className="pst-dv-vdeos">
			                                    <Videos 
			                                   		{...this.props}
			                                   		videos={videos}
			                                   		post={post}
			                                   		 />
			                               </div>
			                           }
		                           </div>
		                       </div>
		                   </div>
		                   {participants.length > 0 && 
	                        	<div className="pst-dv-partic-ctn">
		                        	<div className="pst-dv-partic-ctn">
			                        	<span className="partic-msg" >partics : </span>
				                        {participants.map(function(user, i) {
				                        	if(i > 2 && i < post.participants.length - 2) return;
				                        	if(i > 2 && i == post.participants.length - 1 ) return <a key={i} href="" className="pls-partic-lk">and {post.participants.length - 3} persons</a>;
											return (
												<Link key={i} to={user.username} className="partic-usr">{user.firstname} {user.lastname}</Link>
											)
										})}
									</div>
								</div>
							}
		               </div>
		           }
	               {post.images.length == 0 && 
		            	<div className="rght-pst-ctnr-mdl-a">
	                        <div className="pst-dv-txt-ctn">
	                           	<div id="postContent" className={contentClassnames} >
                           			<BuildContent content={post.content} />
	                           	</div>
	                        </div>
	                        <div className="pst-dv-img-ctn">
		                       	<div className="pst-dv-img-ctn-a">
		                           	<div className="pst-dv-img-ctn-b">
				                        {videos.length > 0 && 
			                            	<div className="pst-dv-vdeos">
			                                    <Videos 
			                                   		{...this.props}
			                                   		videos={videos}
			                                   		submittingPost={submittingPost}
			                                   		post={post}
			                                   		 />
			                               </div>
			                           }
		                            </div>
                        		</div>
	                        </div>
	                       	{participants.length > 0 && 
	                        	<div className="pst-dv-partic-ctn">
		                        	<div className="pst-dv-partic-ctn">
			                        	<span className="partic-msg" >partics : </span>
				                        {participants.map(function(user, i) {
				                        	if(i > 2 && i < post.participants.length - 2) return;
				                        	if(i > 2 && i == post.participants.length - 1 ) return <a key={i} href="" className="pls-partic-lk">and {post.participants.length - 3} persons</a>;
											return (
												<Link key={i} to={user.username} className="partic-usr">{user.firstname} {user.lastname}</Link>
											)
										})}
									</div>
								</div>
							}
	                   </div>
            		}
            	</div>		                    
	      	</div>
        )
	}
})

export default Body;