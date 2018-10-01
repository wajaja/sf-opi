import React 			from	'react'
import createReactClass from 'create-react-class'
import { 
	Chat,
}            			from '../../../components'
import {
	Foot, IntroPrev, PhotosPrev, StickyMenu,
	StickyNavLinks, MembersPrev,
    OptionsPrev, NavLinks
}                         	from './components'

const Left = createReactClass({

	getDefaultProps() {
		return {
			renderNavLinks : true
		}
	},

	render() {
		return(
			<div className="grp-blc-lft">
		        <div id="_8" className="online_8">
                    <Chat 
                        {...this.props}
                        />
                </div>        
		    </div>
		)
	}
})

export default Left