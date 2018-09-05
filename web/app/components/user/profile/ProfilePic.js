import React 			from 'react'
import createReactClass from 'create-react-class'

import { Picture } 			from '../../media'
import { 
    Photos as PhotosActions
}                           from '../../../actions/media'


const ProfilePic = createReactClass({

	getInitialState() {
		return{

		}
	},

	render() {
		const { profile : { username, profile_pic } } = this.props
		return(
            <div className="pro-pic-a">
                <div className="pro-pic-b">
                	<div className="pro-pic-ctnr">
            			<Picture 
                   			tag="profile_pics"
                   			image={profile_pic}
                   			username={username} 
                   			className="in-top-plus-pic" 
                   			pClassName="pro-pic-show"
                   			{...this.props}
                   			/>
		            </div>
		        </div>
		    </div>
		)
	}
})

export default ProfilePic