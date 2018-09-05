import React from 'react'
import createReactClass from 'create-react-class'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as moments from 'moment'

import { Editor, Author } from '../post/avatars'
import { TimeAgo } from '../../social/commons'


const Head  = createReactClass( {

	render() {
		const post = this.props.post;
		return(
			<div className="pst-ctnr-tp" >
                <div className="lft-pst-ctnr-tp" data-aut-arr="">
                    <div className="pst-dv-pic" data-aut-id="{{post.author.id}}">
                        <Author author={this.props.author} />
                    </div>                             
                </div>                                                    
                <div className="rght-pst-ctnr-tp">
                    <div className="rght-pst-dv-aut" data-usr-id='+post.author.id+'>
                       	<a className="pst-aut-nm" href='post.author.username+' data-userurl={post.author.username}> 
                       		{author.firstname} {author.lastname}
                       	</a>
                       <a href="" className="pst-aut-pub">{post.author.username}</a>
                    </div>
                </div>
                <div className="rght-pst-ctnr-tp-abs">
                  	<div className="rght-pst-ctnr-tp-abs-a">
                    	<div className="pst-dv-dte" data-dte-cmp="">                                                            
                       		<span className="pst-dte">
                       			<TimeAgo timestamp={post.createdAt} />
                       		</span>
                    	</div>
	                    <div className="pst-opt" data-pst-id='+ post.id +'>
	                       	<a href="" className="pst-opt-lk" data-pst-id={post.id} data-auth-id={post.author.id} >
	                       		<i className="fa fa-chevron-down" aria-hidden="true"></i>
	                       	</a>
	                    </div>
                  	</div>
               	</div>
           </div>
	}
})
export default Head;