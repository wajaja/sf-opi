import React        from 'react'
import createReactClass from 'create-react-class'
import { connect }  from 'react-redux'


const VideoLikes  = createReactClass({

	render() {
		return (
			<div className="ph-pls-likes">
                <div className="ph-pls-likes-a">
                    <div className="pls-statistic">      
                     sommething                                                                                                                  
                    </div>                                                                                                                                                                               
                </div>                               
            </div>
		)
	}
})
/////////
export default connect(null)(VideoLikes)