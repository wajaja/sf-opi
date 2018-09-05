import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import classnames 			from 'classnames'
import Photos 		 		from '../post/Photos'
import axios 			   	from 'axios'
import { 
	BuildContent, Editors, Author, Videos
}    						from '../../../components'
import { BASE_PATH } 	   	from '../../../config/api'
import { 
	Posts as PostsActions,
	Authors as AuthorsActions 
} 							from '../../../actions'
const  he = require('he');

const Body  = createReactClass( {

	getInitialState() {
		return {
			recentAllie: undefined,
		}
	},

	displayOpinion(order) {
		this.props.displayOpinion(order)
	},

	componentDidMount() {
		const { mainPost: {id, nbAllies }, allies, } = this.props,
		recentAllie = allies.filter((allie, i) => {
			for(var prop in allie) {
				return allie[prop].mainAllieId === id && 
					   allie[prop].opinionOrder === nbAllies
			}
		})
		.map((allie, i) => {
            for(var prop in allie) {
                return allie[prop];
            }
        })[0];
		this.setState({recentAllie: recentAllie})
	},

	componentWillReceiveProps(nextProps) {
		const { mainPost: {id }} = this.props;
		if(this.props.allies !== nextProps.allies ) {
			console.log(nextProps.mainPost.nbAllies)
			const post = nextProps.allies.filter((p, i) => {
				for(var prop in p) {
					return p[prop].mainAllieId === id && 
						   p[prop].opinionOrder === nextProps.mainPost.nbAllies
				}
			})
			.map((p, i) => {
                for(var prop in p) {
                    return p[prop];
                }
            })[0];
			this.setState({recentAllie: post})
		}
	},
 
	render() {
		let post,
		{ mainPost, nextPostForm, submittingPost } = this.props,
			{ leftEditors, rightEditors,
			  nbAllies } = mainPost,
			{ recentAllie } 			 = this.state;

		if(!recentAllie)
			post = mainPost;
		else
			post = recentAllie;

		let arrNbAllies = [];
        for (var i = nbAllies - 1; i >= 0; i--) {
        	arrNbAllies.push(i);
        }

        let contentClassnames = 'postContent';

		if(typeof post.content === 'string') {
			const stripedHtml = post.content.replace(/<[^>]+>/g, ''),
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

		return(
			<div className="pst-ctnr-mdl opi">
				<div className="lft-pst-ctnr ">
	                <div className="lft-pst-ctnr-a" >
	                	<div>
	                    	
	                    </div>
	                </div>
	            </div>
            	<div className={nextPostForm ? `pst-dv-txt-ctn nxt-pst` : `pst-dv-txt-ctn`}>
            		<div>
            			{nbAllies > 0 && 
            				<div className="old-allies-ctnr">
            					{arrNbAllies.map((val, i) => {
            						let pad = val === 0 ? 0 : (val + 2) + "px";
            						return (
	            						<div key={i} 
	            							className={classnames("old-allie-ctnr ", val)} 
	            							style={{paddingLeft: pad, paddingRight: pad}}
	            							onClick={this.displayOpinion.bind(this, i)}>
	            							<div></div>
	            						</div>
	            					)
            					})}
            				</div>
            			}
	                    <div 
	                    	className={contentClassnames} 
	                    	onClick={this.displayOpinion.bind(this, post.opinionOrder)}>
	                    	<BuildContent 
	                    		content={post.content} 
	                    		selectedText={this.props.selectedText}
	                    		/>
	                    	<div className="multi-pst-dv-img-ctn">
		                       	<div className="multi-pst-dv-img-ctn-a">
		                           	<div className="multi-pst-dv-img-ctn-b">
		                           		{post.images.length > 0 && post.videos.length === 0 && 
                                       		<div className="multi-pst-dv-img">
	                                       		<Photos 
	                                       			{...this.props}
	                                       			images={post.images}
	                                       			post={post}
	                                       			/>
	                                       </div>
	                                    }
                                       	{post.videos.length > 0 && 
                                       		<div className="multi-pst-dv-vdeos">
	                                       		<Videos 
	                                       			{...this.props}
	                                       			videos={post.videos}
	                                       			submittingPost={submittingPost}
	                                       			post={post}
	                                       			/>
	                                       </div>
	                                   }				            
					        		</div>
				                </div>					            
					        </div>
	                    </div>
	                    
				    </div>
                </div>						
	            <div className="rght-pst-ctnr">
	                <div className="rght-pst-ctnr-a">
	                    <div>
	                    </div>
	                </div>
	            </div>
            </div>
		)
	}
})

export default connect(state => ({
	allies: state.Posts.allies,
}))(Body);