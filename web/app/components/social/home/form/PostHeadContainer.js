import React 			from 'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'
import ReactDOM 		from 'react-dom'

import SelectType 		from './SelectType'
import PostGap 			from './PostGap'
import { 
	App as AppActions,
	PostForm as PostFormActions
} from '../../../../actions/social'

/**
* @PostHeadContainer
*/
const PostHeadContainer  = createReactClass( {

	getInitialState() {
		return {
			postTypePane: false,
			postTypeHover: false,
			opinionTypeHover: false,
			activeType: 'post',
			errors: {}
		}
	},
 	
 	getDefaultProps() {
 		return {
			confidence : [
                { 
                    name:'Open', 
                    value: 'public',
                    icon: <i className="fa fa-pencil" aria-hidden="true"></i>
                }, 
                { 
                    name:'Private', 
                    value: 'private',
                    icon: <i className="fa fa-pencil" aria-hidden="true"></i>
                },
                { 
                    name:'Friends', 
                    value: 'friends',
                    icon: <i className="fa fa-pencil" aria-hidden="true"></i>
                }
            ],
 		}
	},

	toggleGapInput(e) {
        e.preventDefault();
        e.stopPropagation();
        const gapBtn = e.target;
        const gapContainer = $(gapBtn).parents('.postform').find('.gap-tm-cont');
        gapContainer.toggleClass('pst-select-hide');
    },

	onTypeChange(name, value, e) {
		const { dispatch } = this.props;
		dispatch(PostFormActions.setType(name, value))
		this.setState({activeType: value})
	},

	onBasicTypeHover(e) {
		this.setState({postTypeHover: true})
	},

	onBasicTypeOut(e) {
		this.setState({postTypeHover: false})
	},

	onOpinionTypeHover(e) {
		this.setState({opinionTypeHover: true})
	},

	onOpinionTypeOut(e) {
		this.setState({opinionTypeHover: false})
	},

	toggleConfidPane(e) {
        e.preventDefault(); 
        const { dispatch } = this.props;
        dispatch(AppActions.confidPane(!this.props.confidPane))
    },

    handleConfidOption(option, e) {
        e.preventDefault();      
        const { dispatch } = this.props;
        dispatch(AppActions.postFormFocus(true));
        dispatch(ConfidenceActions.set(option.name, option.value));
        dispatch(AppActions.confidPane(false))
    },
    
    componentWillMount () {
        
    },

    componentWillUnmount () {
        
    },

	render() { 
		const { postTypePane, postTypeHover, opinionTypeHover, activeType } = this.state
		return(
			<div>
				<div className="start-list-form-rgt"></div>
	            <div className="start-list-form-lft">
	            	<div className="dv-type-pst">
	                	<div 
	                		className={activeType === 'post' ? `type-dsply active`: `type-dsply`}
	                		onMouseOver={this.onBasicTypeHover} 
							onMouseOut={this.onBasicTypeOut} 
	                		onClick={this.onTypeChange.bind(this, 'Basic', 'post')}>
	                		<span className="dsply-name">Basic</span>
	                		{postTypeHover && 
	                			<div  
	                            	className="pst-frm-type-lk post" 
	                            	>
	                                <span className="type-opt-ctnr">
	                                	<span className="type-icon">
	                                		<i className="fa fa-pencil" aria-hidden="true"></i>
	                                	</span>
	                                	<span className="type-name">Basic</span>
	                                </span>
	                                <span className="txt-ctnr">
	                                	<span className="txt">
	                                		this allow your followers to comment, 
	                                		like, share traditionnaly...
	                                	</span>
	                                </span>                                                
	                            </div>
	                        }
                        </div>
                        <div 
                        	className={activeType === 'opinion' ? `type-dsply active`: `type-dsply`}
                        	onMouseOver={this.onOpinionTypeHover} 
							onMouseOut={this.onOpinionTypeOut} 
                        	onClick={this.onTypeChange.bind(this, 'Opinion', 'opinion')}>
	                		<span className="dsply-name">Opinion</span>
	                		{opinionTypeHover && 
	                			<div  
	                            	className="pst-frm-type-lk opinion" 
	                            	>
	                                <span className="type-opt-ctnr">
	                                	<span className="type-icon">
	                                		<i className="fa fa-pencil" aria-hidden="true"></i>
	                                	</span>
	                                	<span className="type-name">opinion</span>
	                                </span>
	                                <span className="txt-ctnr">
	                                	<span className="txt">
	                                		this allow to become neutral, there your followers 
	                                		will comment the position of your invited participant
	                                	</span>
	                                </span>                                                
	                            </div>
	                        }
                        </div>                        
	                </div>  
	            	<div className="frm-confid-ctnr" style={{display: 'inline-block'}}>
                        <div className="frm-confid-name">
                    		{this.props.confindenceName}
                    	</div>
                        <div 
                        	className="frm-confid-btn" 
                        	onClick={this.toggleConfidPane}>
                            <div className="ico" ></div>
                        </div>
                        {this.props.confidPane && 
                            <div className="confid-opt-ctnr-a">
                                <div className="confid-rel-ctnr">                                            
                                    <span className="confid-opt-ctnr-b">
                                        {this.props.confidence.map(function(option, i) {
                                            return (
                                                <div key={i} className="confid-opt-a" onClick={this.handleConfidOption.bind(this, option)}>
                                                    <span className="confid-opt-ico">{option.icon}</span>
                                                    <span className="confid-opt-txt">{option.name}</span>
                                                </div>
                                            );
                                        }.bind(this))}
                                    </span>
                                    <i className="confid-arraw"><i></i></i>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="lk-gl-gp-t">
                        <div className="ico" onClick={this.toggleGapInput}></div>
                    </div>
	                {this.props.initialized && this.props.form_focus && 
	                	<PostGap 
		                	onChange={this.props.gapChange} 
		                	gapHours={this.props.gapHours} 
		                	gapMinutes={this.props.gapMinutes} 
		                	/>
	                }           
	            </div>
	        </div>
		)
	}
})

export default connect(state => ({
	typeName: state.PostForm.typeName,
	typeValue: state.PostForm.typeValue,
	postTypePane: state.App.postTypePane,
	confidPane: state.App.confidPane,
    confidenceValue: state.Confidence.confidenceValue,
    confindenceName: state.Confidence.confindenceName,
}))(PostHeadContainer);