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
	        const nb_img = images.length - 3;
	        return (
	        	<div className="msg-img-ul dv-pls-img">
		            {images.map(function(image, i) {
		            	return(
		            		<div key={i} className="img-dv">
		            			{i === 0 && <Photo 
					                   			key={i} 
					                   			image={image} 
					                   			username={username} 
					                   			className="jst-pls-img" 
					                   			pClassName="li-msg-img first"
					                   			{...self.props}
					                   			/>
					            }
				                {i === 1 && 
				                	<div className="dv-pls-img-lft">
				                		<Photo 
				                   			key={i} 
				                   			image={image} 
				                   			username={username} 
				                   			className="jst-pls-img" 
				                   			pClassName="li-msg-img scond"
				                   			{...self.props}
				                   			/>
			                        </div>
				                } 
				                {i === 2 &&
				                    <div className="dv-thir-img">
			                    		<Photo 
				                   			key={i} 
				                   			image={image} 
				                   			username={username} 
				                   			className="jst-pls-img" 
				                   			pClassName="li-msg-img thir"
				                   			{...self.props}
				                   			/>
			                            <Link to={{pathname: '/messages', 
			                            	  state:{id: id} }} 
			                            	  className={nb_img ? `see-mr-img` : `see-mr-img none-see-mr-img`}
			                            	  >
			                               	<i className="fa fa-plus" aria-hidden="true"></i>
			                               	<span className="nb-img-txt">{nb_img}</span>
			                            </Link>
			                        </div>
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