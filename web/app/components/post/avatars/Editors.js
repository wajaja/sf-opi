import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'
import { connect } 		from 'react-redux'

import * as Author		from './Author'

const Editors  = createReactClass({
	render() {
		const self = this,
			{ side, editors, post } = this.props
		return (
	        <div className="div-edtrs-ctnr">
	            {editors.map(function(editor, i) {
	            	return (
	            		<div className="div-edtr-ctnr" key={i}>
	                       	<div className="edt-rght-ctnr edt-pic-lk" >
	                           	<Author.Photo type='comment' author={editor} className="edt-pic" imgHeight={32} />
	                       	</div>
	                       	<div className="edt-lft-ctnr">
	                       		<Author.Name  author={editor} className="com-link-name" />
	                       		<div className="side">{side}</div>
	                       	</div>
	                    </div>
	            	)
	            })}		
	        </div>
		)
	}
})

export default Editors;