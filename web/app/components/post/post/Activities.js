import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'

const Activities  = createReactClass({

	getInitialState() {
		return {}
	},

	renderCommented() {
		return(
			<div className="comted-div-a">
             	<div className="com-div-left" data-auth-id={comment.author.id}>
                 	<a className="com-profile-link-img">
                     	<img className="com-profile-img" src={comment.author.profilePic.cropPath} />
                 	</a>
             	</div>
             	<div className="com-div-right-a" data-cmt-id={comment.id}>
                 	<div className="com-head-name">
                     	<span className="com-sp-nm-ct">
                         	<a href={comment.author.username} className="com-link-name usr-name-lk">
                             	<span>{comment.author.firstname} {comment.author.lastname}<span>
                         	</a>
                     	</span>                        
                     	<span className="contentComment">
                         	<span> comment.content + </span><br/>
                    	</span>
                 	</div>
                 	<div className="com-img-container" >
                     	<a href="" data-cmt-id={comment.id} className="lk-cmt-img see-img-lk" >See Image</a>
                 	</div>
             	</div>
             	<div className="comted-head-btm">
                 	<div data-cmt-id={comment.id}>
                     	<span className="com-dv-dte"></span>
                     	<span className="op-dte" ></span>
                     	<span className="com-head-time" >comment on :</span>   
                	</div>
             	</div>
         	</div>
		)
	},
	
	renderCommeneted() {
		return(
			
		)
	},

	renderCommeneted() {
		return(
			
		)
	},

	renderCommeneted() {
		return(
			
		)
	},

	render() {
		return(

		)
	}
})

//////
export default connect(state => ({
	post: state.Posts.postsById
}))(Activities);