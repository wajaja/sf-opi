import React 				from 'react'
import createReactClass 	from 'create-react-class'

import { Picture } 			from '../../media'
import { 
    Photos as PhotosActions
}                           from '../../../actions/media'
import StickyMenu 			from '../../../routes/user/profile/components/StickyMenu'


const CoverPic = createReactClass({

	getInitialState() {
		return{

		}
	},

	render() {
		const { profile : { username, cover_pic }, user } = this.props
		return(
            <div className="cov-a">
                <div className="cov-b">
                	<div 
                		className="act-period-dv"
                		style={{zIndex:15, left:'10px', width: '260px' }}>
	                	<StickyMenu
				        	{...this.props}
	                        profile={this.props.profile}
	                        user={user}
	                        />
	                </div>
                	<div className="cov-a">
            			<Picture 
                   			tag="cover_pics"
                   			image={cover_pic}
                   			username={username} 
                   			className="cov_pic_show" 
                   			pClassName="cov-b"
                   			{...this.props}
                   			/>
		            </div>
		        </div>
		    </div>
		)
	}
})

export default CoverPic