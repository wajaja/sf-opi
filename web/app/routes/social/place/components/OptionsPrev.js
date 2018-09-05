import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'
import { connect }  	from 'react-redux'


const OptionsPrev = createReactClass({

	getInitialState() {
		return {

		}
	},

	render() {
		const { match, group, user } = this.props,
		address = group.address,
		about_me= group.about_me
		
		return (
			<div className="in-detail-about-ctnr">
				<div className="in-detail-cont">
				    <ul className="in-detail-ul">
						<li className="in-detail-ul-chd">
							<div className="cht-group-ky-ctnr">
								<div className="cht-group-ico"></div>
							</div>
						</li>
						<li className="in-detail-ul-chd">
							<div className="opi-group-ky-ctnr">
								<div className="opi-group-ico"></div>
							</div>
						</li>
						<li className="in-detail-ul-chd">
							<div className="cfg-group-ky-ctrn">
								<div className="cfg-group-ico"></div>
							</div>
						</li>
						<li className="in-detail-ul-chd">
							<div className="out-group-ctnr">
								<div className="out-group-ico"></div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		)
	}
})

export default OptionsPrev