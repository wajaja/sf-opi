import React 					from 'react'
import createReactClass 		from 'create-react-class'
import { connect } 				from 'react-redux'
import { Sticky } 				from 'react-sticky'
import Dropdown 				from 'react-dropdown'


const StickyMenu = createReactClass({

	getInitialState() {
		const firstname = this.props.profile.firstname
		return {
			
		}
	},

	render() {
		const { profile } = this.props
		return (
			<Sticky topOffset={242}>
          		{({
					style,

					// the following are also available but unused in this example 
					isSticky,
					wasSticky,
					distanceFromTop,
					distanceFromBottom,
					calculatedHeight
            		}) => {
          				const top = isSticky ? 62 : 0
          				const position = isSticky ? 'fixed' : 'absolute' 
              			return (
                			<div 
                				className="stc-mnu-dv" 
                				style={{...style, marginTop: top, zIndex:15, left:10, position: position}} >
								<div className="stc-mnu-dv-a">
									<div className="stc-mnu-dv-b">
										<img 
											src={profile.profile_pic.web_path}
											className="stc-mnu-img" />
										<div className="stc-mnu-nm">{profile.firstname}</div>
									</div>
								</div>
							</div>
              			)
            		}
          		}
        	</Sticky>
		)
	}
})

export default StickyMenu