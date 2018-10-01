import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import { connect } 			from 'react-redux'

import { Photo } 			from '../media'
import { 
    Photos as PhotosActions
}                           from '../../actions/media'

const Photos  = createReactClass( {

	render() {
		const {message: {id, images, sender}}  = this.props,
		self 								= this,
		username 							= sender.username;
		if(!images.length) return(<div></div>);
		////
		////
        if (images.length === 1) {
           return (
           		<div className="msg-img-ul dv-one-img">
	               {images.map(function(image, i){
	                   return 	<Photo 
		                   			key={i} 
		                   			image={image} 
		                   			username={username} 
		                   			className="jst-oe-img" 
		                   			pClassName="li-msg-img"
		                   			{...self.props}
		                   			/>
	                })}
	           </div>
	        )
	    }
	    ////
	    ////
	    if(images.length === 2) {
	        return (
	        	<div className="msg-img-ul dv-two-img">
		            {images.map(function(image, i) {
		                return(
		                	<div key={i} className="img-dv">
		                		<Photo 
		                   			key={i} 
		                   			image={image} 
		                   			username={username} 
		                   			className="jst-to-img" 
		                   			pClassName="li-msg-img"
		                   			{...self.props}
		                   			/>
		                    </div>
	                    )
		            })}
		        </div>
		    )
	    }

	    if (images.length > 2) {
	        return (
	        	<div className="msg-img-ul dv-pls-img">
		            {images.map(function(image, i) {
		            	return(
		            		<div key={i} className="img-dv">
		            			<Photo 
		                   			key={i} 
		                   			image={image} 
		                   			username={username} 
		                   			className="jst-pls-img" 
		                   			pClassName="li-msg-img multiple"
		                   			{...self.props}
		                   			/>
					            }
		            		</div>
		            	)
		            })}
		        </div>
		    )
	    }
	}
})

export default Photos;