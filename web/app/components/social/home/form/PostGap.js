import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'

import NumberType       from './NumberType'


const PostGap  = createReactClass({

    getInitialState() {
        return {
            gapHours: "0",
            gapMinutes: "0"
        }
    },

    handleClick(e) {
        e.preventDefault();
        const $elem     = $(e.target),
        $gapContainer   = $elem.parents('.gap-tm-cont'),
        $gapHour        = $gapContainer.find('.frm-gapHours-content');
        $gapHour.toggleClass('pst-select-hide');
        $elem.hide();
    },

    onChange(e) {
        const $field = $(e.target);
        if(e.target.name == 'gapHours') {            
            const val = parseInt(e.target.value) > 23 ? 23 : e.target.value;
            if(e.target.validity && e.target.validity.badInput || $field.is('invalid')){
                return;                
            }
            this.setState({ [e.target.name]: val });
            this.props.gapChange(val, this.props.gapMinutes);
        }
        else if(e.target.name == 'gapMinutes') {
            const val = parseInt(e.target.value) > 59 ? 59 : e.target.value;
            if(e.target.validity && e.target.validity.badInput || $field.is('invalid')){
                return;                
            }
            this.setState({ [e.target.name]: val });
            this.props.gapChange(this.props.gapHours, val);
        }
    },

    componentDidUpdate(prevProps, prevState) {

    },

	render() {
		return(
			<div className="gap-tm-cont pst-select-hide">
                <div className="gap-tm-bd">
                    <span className="gap-txt">After</span>                            
                    <span className="frm-gapHours-content pst-select-hide" data-toggle="tooltip" data-placement="top" title="Hours">
                        <NumberType 
                            onChange={this.onChange}
                            value={this.props.gapHours}
                            name= "gapHours"
                            min="0"
                            max="23"
                            placeholder="Hours"
                            customClassName="frm-gapHours frm-gap"
                            />
                    </span>
                    <span className="frm-gapMinutes-content" data-toggle="tooltip" data-placement="top" title="Minutes">
                        <NumberType 
                            onChange={this.onChange}
                            value={this.props.gapMinutes}
                            name= "gapMinutes"
                            min="0"
                            max="59"
                            placeholder="Minutes"
                            customClassName="frm-gapMinutes frm-gap"
                            />
                    </span>
                    <a href="" className="frm-add-time" onClick={this.handleClick}><i className="fa fa-plus"></i></a>
                </div>
            </div>
		)
	}
})
////////////
export default connect (state => ({
    resseting: state.PostForm.resseting
}))(PostGap);