import React 					from 'react'
import createReactClass 		from 'create-react-class'
import { connect } 				from 'react-redux'
import { Sticky } 				from 'react-sticky'
import Dropdown 				from 'react-dropdown'


const StickyMenu = createReactClass({

	getInitialState() {
		const firstname = this.props.profile.firstname
		return {
			optionsYears: [
			  	'2018', '2017', '2016'
			],
			optionsCreatedBy: [
				'all', firstname
			],
		}
	},

	_onSelectYears(e) {
		console.log('selected years', e.target)
	},

	_onSelectCreatedBy(e) {
		console.log('selected createdBy', e.target)
	},

	render() {
		const { optionsYears, optionsCreatedBy } = this.state
		return (
			<Sticky topOffset={62}>
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
                				className="act-period-dv-a" 
                				style={{...style, marginTop: top, zIndex:15, left:10, position: position}} >
								<div className="act-period-ctnr">
									<div className="act-period-h-ctnr">
										<div className="act-period-h-ctnr-a">
											<div className="mnu-chd-lk active">
												<Dropdown 
													options={optionsYears} 
													onChange={this._onSelectYears} 
													value={optionsYears[0]} 
													placeholder="Year"
													className="drop-down-slt-year"
													/>
											</div>
										</div>
										<div className="act-period-h-ctnr-a">
											<div className="mnu-chd-lk active">
												<Dropdown 
													options={optionsCreatedBy} 
													onChange={this._onSelectCreatedBy} 
													value={optionsCreatedBy[0]} 
													placeholder="createdBy" 
													className="drop-down-slt-crtd-by"
													/>
											</div>
										</div>
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