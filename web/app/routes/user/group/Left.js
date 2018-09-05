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
		const { 
			dispatch, exception, history, screenWidth, renderNavLinks,
			hasOwnDiary, group, newsRefs, photos, user, loading
		} 						= this.props
		return(
			<div className="grp-blc-lft">
				{!renderNavLinks &&
					<div className="grp-blc-lft-a">
                		<div className="show-grp-plus">
		                    <div className="show-grp-plus-a">
		                        <div className="show-grp-plus-intro">
		                        	<IntroPrev
										{...this.props}	
										group={group}
										user={user}
										/>
		                        </div>
                                <div className="show-grp-plus-opt">
                                    
                                </div>
		                        <div className="show-grp-plus-pho">
		                        	
		                        </div>
		                        <div className="show-grp-plus-mbr">
		                        </div>
		                    </div>
		                </div>
                	</div>
				}
		        {renderNavLinks && <div className="view-ctnr">
			        	<NavLinks 
			        		{...this.props}
			        		/>
			        </div>
			    }
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