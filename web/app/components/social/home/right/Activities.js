import React 			from 'react'
import { connect } 		from 'react-redux'
import createReactClass from 'create-react-class'
import '../../../../styles/social/right/activities.scss'


const Activities  = createReactClass( {

	render() {
		return(
			<div className="activities-ctnr" >
				<div id="pop-sugg" className="pop-sugg">
	                <div id="pop-sugg-co" className="pop-sugg-co">
	                    <span className="pop-sugg-hdr"><a href="" className="pop_sugg_ctry">freind with Me</a><a href="" className="pop_sugg_wld">On Opinion</a></span>
	                    <div id="pop_sugg_ctry" className="pop-sugg-ctry">friends with Me</div>
	                    <div id="pop_sugg_wld" className="pop-sugg-wld">the activity on opinion</div>
	                </div>
	            </div>
	            <div id="frei-sugg" className="frei-sugg"><div id="frei_sugg_co" className="frei_sugg_co"></div></div>
			</div>
		)
	}
})


export default Activities;