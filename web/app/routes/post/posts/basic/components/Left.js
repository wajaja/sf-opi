import React 			from	'react'
import createReactClass from 'create-react-class'
import { 
	Chat,
}            			from '../../../../../components'

const Left = createReactClass({

	render() {
		const { dispatch, exception, history, screenWidth } = this.props
		return(
			<div id="social-block-left">
		        <div className="view-ctnr">
		        	
		        </div>
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