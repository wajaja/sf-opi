import React 				from 'react'
import createReactClass  	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import { connect } 			from 'react-redux'

import { Image } 			from '../../media'
import { 
    Photos as PhotosActions
}                           from '../../../actions/media'
import { 
    App as AppActions
}                           from '../../../actions/media'

//////
/////
const Photos  = createReactClass({

	getInitialState() {
		return {}
	},

	//////
	//////
	render() {
		const self 						= this,
		{ post: {id, author}, images } 	= this.props,
		username 						= author.username;
		if(!images.length) return(<div></div>);
		////
		////
        if (images.length === 1) {
           return (
           		<div className="pst-dv-one-img">
	               {images.map(function(image, i){
	                   return <Image 
	                   			key={i}
	                   			postId={id}
	                   			image={image}
	                   			username={username} 
	                   			className="pst-jst-oe-img" 
	                   			pClassName="pst-img-lk"
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
	        	<div className="pst-dv-two-img">
		            {images.map(function(image, i) {
		                return (
		                	<div key={i} className="img-dv">
			                	<Image
		                			key={i}
		                			postId={id}
		                			image={image} 
		                			username={username} 
		                			pClassName="pst-img-lk" 
		                			className="pst-jst-to-img"
		                			{...self.props}
		                			/>
            					{i === 0 && <div className="cter-sep"></div>}
		                	</div>
	                	)
		            })}
		        </div>
		    )
	    }
	    ////
	    ////
	    if (images.length > 2) {
	        const nb_img = images.length - 3;
	        return (
	        	<div className="pst-dv-pls-img">
		            {images.map(function(image, i) {
		            	return(
		            		<div key={i} className="img-dv">
		            			{i === 0 && <Image 
	            								key={i}
	            								postId={id} 
	            								image={image} 
	            								username={username} 
	            								pClassName="pst-img-lk first" 
	            								className="pst-jst-pls-img"
	            								{...self.props}
	            								/>
					            }
					            {i === 0 && <div className="cter-sep"></div>}
				                {i === 1 && <div className="pst-dv-pls-img-lft">
												<Image
													key={i} 
													postId={id}
													image={image} 
													username={username} 
													pClassName="pst-img-lk scond" 
													className="pst-jst-pls-img"
													{...self.props}
													/>
											</div>
				                } 
				                {i === 1 && <div className="lft-mdl-sep"></div>}
				                {i === 2 && <div className="pst-dv-thir-img">
				                				<Image 
													key={i} 
													postId={id}
													image={image} 
													username={username} 
													pClassName="pst-img-lk thir" 
													className="pst-jst-pls-img"
													{...self.props} 
													/>
					                            <Link to={{pathname: `/posts/${id}/photos`, state:{id: id} }} className={nb_img ? `see-mr-pst-img` : `see-mr-pst-img none-see-mr-img`}>
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
/////
////
export default connect(state=>({
	modal: state.App.modalPhoto,
}))(Photos);