import React                from 'react'
import { connect }          from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import createReactClass     from 'create-react-class';
import PropTypes            from 'prop-types';
import Select               from 'react-select';


const datas = require('countries-list/dist/data')
import  '../../../styles/react-select.scss'
import  '../../../styles/custom-react-select.scss'

export const LangForm = createReactClass({
    getDefaultProps () {
        return {
            label: 'States:',
            searchable: true,
        };
    },
    getInitialState () {
        const options = [],
        language     = datas["languages"];

        Object.keys(language).map(function(elem) {
            const o  = {};
            o.value  = elem.toUpperCase();
            o.label  = language[elem].name;
            o.native = language[elem].native;
            options.push(o);
        });

        return {
            disabled: false,
            searchable: this.props.searchable,
            selectValue: 'english',
            clearable: true,
            rtl: false,
            options: options,
        };
    },
    
    updateValue (newValue) {
        this.setState({
            selectValue: newValue,
        });
    },
    
    focusStateSelect () {
        this.refs.stateSelect.focus();
    },

    handleSubmit(e) {
        e.preventDefault();
        if(!this.state.selectValue) return
        this.props.handleSubmit(this.state.selectValue)
    },
    
    render () {
        const { 
            options, clearable,
            disabled, selectValue,
            searchable
        }               = this.state;
        return (
            <form 
            className="lang-form"
            onSubmit={this.handleSubmit}>
            <div className="bdy">
                <div className="section-label">
                    
                </div>
                <div className="section-inp">
                    <div className="lang-inp-ctnr">
                        <Select
                            id="state-select"
                            ref={(ref) => { this.select = ref; }}
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            autoFocus
                            options={options}
                            simpleValue
                            clearable={clearable}
                            name="selected-language"
                            disabled={disabled}
                            value={selectValue}
                            onChange={this.updateValue}
                            rtl={this.state.rtl}
                            searchable={searchable}
                        />
                    </div>
                </div>
            </div>
            <div className="btm">
                <button  
                    className="btn btn-primary btn-sm" 
                    type="submit" 
                    disabled={this.props.submitting}>
                    Submit
                </button>
            </div>
        </form>
        );
    }
});

/////////////
export default connect(state=> ({

}))(LangForm)