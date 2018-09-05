import React 					from 'react'
import createReactClass 		from 'create-react-class'
import { NavLink } 				from 'react-router-dom'
import { connect } 				from 'react-redux'
import { Sticky } 				from 'react-sticky'


const StickyNavLinks = createReactClass({

	getInitialState() {
		const firstname = this.props.profile.firstname
		return {
			optionsYears: [
			  	'2018', '2017', '2016'
			],
			optionsCreatedBy: [
				'all', firstname
			],
			periodActive: false,
		}
	},

	togglePerBox(e) {
		this.setState({periodActive: !this.state.periodActive})
	},

	_onSelectYears(e) {
		console.log('selected years', e.target)
	},

	_onSelectCreatedBy(e) {
		console.log('selected createdBy', e.target)
	},

	render() {
		const { match } = this.props,
		{ periodActive, optionsYears, optionsCreatedBy } = this.state
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
              			return (
                			<div className="stk-mnu-dv" style={{...style, marginTop: top }}>
								<div className="stk-mnu-dv-a">
									<div className="stk-mnu-ctnr">
										<div className="stk-mnu-h-ctnr">
											<div className="stk-mnu-h-ctnr-a">
												<NavLink 
													to={`${match.url}`} 
													className="mnu-chd-lk"
													activeStyle={{
														    background: '#f0f6f7',
    														border: '1px solid #cfe0e3'
													}}
													>
													<span className="mnu-ico-ctnr"></span>
													<span className="mnu-txt-ctnr">Home</span>
												</NavLink>
											</div>
											<div className="selct-per-ctnr">
												<div 
													onClick={this.togglePerBox}
													className="selct-per">...</div>
												{periodActive && 
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
												}
											</div>
										</div>
										<div className="stk-mnu-info-ctnr">
											<div className="stk-mnu-info-ctnr-a">
												<NavLink 
													to={`${match.url}?tag=infos`} 
													className="mnu-chd-lk"
													activeStyle={{
														background: '#f0f6f7',
														border: '1px solid #cfe0e3'
													}}
													>
													<span className="mnu-ico-ctnr"></span>
													<span className="mnu-txt-ctnr">About</span>
												</NavLink>
											</div>
										</div>
										<div className="stk-mnu-photos-ctnr">
											<div className="stk-mnu-photos-ctnr-a">
												<NavLink 
													to={`${match.url}?tag=photos`} 
													className="mnu-chd-lk"
													activeStyle={{
														background: '#f0f6f7',
														border: '1px solid #cfe0e3'
													}}
													>
													<span className="mnu-ico-ctnr"></span>
													<span className="mnu-txt-ctnr">Photos</span>
												</NavLink>
											</div>
										</div>
										<div className="stk-mnu-frds-ctnr">
											<div className="stk-mnu-frds-ctnr-a">
												<NavLink 
													to={`${match.url}?tag=relationship`} 
													className="mnu-chd-lk"
													activeStyle={{
														background: '#f0f6f7',
														border: '1px solid #cfe0e3'
													}}
													>
													<span className="mnu-ico-ctnr"></span>
													<span className="mnu-txt-ctnr">Friends</span>
												</NavLink>
											</div>
										</div>
										<div className="stk-mnu-op-ctnr" style={{display: 'none'}}>
											<div className="stk-mnu-op-ctnr-a">
												<NavLink 
													to={`${match.url}?tag=opinions`} 
													className="mnu-chd-lk"
													activeStyle={{
														background: '#f0f6f7',
														border: '1px solid #cfe0e3'
													}}
													>
													<span className="mnu-ico-ctnr"></span>
													<span className="mnu-txt-ctnr">Opinions</span>
												</NavLink>
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

export default StickyNavLinks