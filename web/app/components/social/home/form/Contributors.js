import React 			from 'react'
import { connect } 		from 'react-redux'
import createReactClass from 'create-react-class'
import BasicEditor 		from './BasicEditor'
import OpinionEditor 	from './OpinionEditor'
import EditorsBox 		from './EditorsBox'
import LeftEditorsBox 	from './LeftEditorsBox'
import RightEditorsBox 	from './RightEditorsBox'


const Contributors  = createReactClass({

	getInitialState() {
		return {
			currentEditor: '',
			typeName: 'Basic',
			typeValue: 'post'
		}
	},

	getDefaultProps() {
		return {
			type : [
				{ name:'Basic', value: 'post'}, 
				{ name:'Opinion', value: 'opinion'}
			],
		}
	},

	handleClick() {
		e.preventDefault();
		this.props.changeEditor(editor);
	},

	handleTypeChange(type) {
		this.setState({
			typeName: type.name,
			typeValue: type.value
		})
	},

	render() {
		return (
			<div>
				<div className="gl-frm-bd-usr-lk" id="_gl_frm_bd_usr_lk">
	                {this.props.typeValue === 'post' && <BasicEditor {...this.props} />}
	                {this.props.typeValue === 'post' && this.props.form_focus && 
						<div  className={this.props.currentEditor == 'editor' ? `frm-contrib-ctnr view` : `frm-contrib-ctnr`} id="pst_form_editors">
							<EditorsBox 
								{...this.props}
								addEditor={this.props.addEditor}
								/>
						</div>  
	                }
	                {this.props.typeValue === 'opinion' && <OpinionEditor {...this.props} />}
		            {this.props.typeValue === 'opinion' && this.props.form_focus && 
	            	<div>
		            	<div className={this.props.currentEditor == 'leftEditor' ? `frm-contrib-ctnr view` : `frm-contrib-ctnr`} id="pst_form_lft_editors">
	    	            	<LeftEditorsBox 
	    	            		{...this.props}
	    	            		addLeftEditor={this.props.addLeftEditor}
	    	            		/>
	    	            </div>
	    	            <div className={this.props.currentEditor == 'rightEditor' ? `frm-contrib-ctnr view` : `frm-contrib-ctnr`} id="pst_form_rgt_editors">
	    	            	<RightEditorsBox 
	    	            		{...this.props}
	    	            		addRightEditor={this.props.addRightEditor}
	    	            		/>
	    	            </div>
	    	        </div>
		            }		                            
	            </div>	            
			</div>
		)
	}
})

export default connect(state => ({
    user: state.User.user,
	typeName: state.PostForm.typeName,
    typeValue: state.PostForm.typeValue,
    currentEditor: state.PostForm.currentEditor
}))(Contributors);