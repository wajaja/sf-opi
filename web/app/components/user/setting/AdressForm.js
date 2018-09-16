import React                from 'react'
import { connect }          from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import createReactClass     from 'create-react-class';
import PropTypes            from 'prop-types';
import AsyncSelect          from 'react-select/lib/Async';
// import VirtualizedSelect    from 'react-virtualized-select';
import { 
    CountryDropdown, RegionDropdown 
}                           from 'react-country-region-selector';

const cities = require('cities-list'),
datas = require('countries-list/dist/data')

import '../../../styles/lib/react-virtualized/styles.css'
import '../../../styles/lib/react-virtualized-select/styles.css'

/////////////
const AdressForm = createReactClass({

     getDefaultProps () {
        return {
            label: 'States:',
            searchable: true,
        };
    },
    getInitialState () {       

        return {
            disabled: false,
            searchable: true,
            clearable: false,
            country: '',
            region: '',
            city: '',
            rtl: false,
        };
    },
    
    selectCountry(value) {
        this.setState({country: value,});
    },

    selectRegion(value) {
        this.setState({region: value,});
    },

    updateCity(newValue, actionMeta) {
        // possible values: since v2
        // {
        //   action: 'select-option' |
        //     'deselect-option' |
        //     'remove-value' |
        //     'pop-value' |
        //     'set-value' |
        //     'clear' |
        //     'create-option';
        // }
        this.setState({
            city: newValue,
        });
    },

    focusStateSelect () {
        this.refs.stateSelect.focus();
    },

    handleSubmit(e) {
        e.preventDefault();
        const { city, country, region } = this.state
        if(!region || !country) return
        const data = {
            city: city,
            region: region,
            country: country,
        }
        this.props.handleSubmit(data)
    },

    // load asynchromous citie's data 
    // from big cities-list package 
    getCities (input) {
        if (!input) {
            console.log('no cities')
            return Promise.resolve({ options: [] });
        }

        const regex = new RegExp(input, 'g' ),
        matchedKeys = Object.keys(cities).map(function(elem) {
            if(elem.match(regex)) {
                console.log('element matched')
                return elem;
            }
        }).slice(1, 20) || [];

        const citiesOptions = matchedKeys.map(function(elem) {
            const o  = {};
            o.value  = elem;
            o.label  = elem;
            o.native = elem;
            return o
        });

        console.log('bottom cities print', citiesOptions);
        return Promise.resolve({ options: citiesOptions });
    },

    render() {
        const { submitting } = this.props,
        countries            = datas["countries"],
        countriesOptions     = []
        // citiesOptions        = []

        const { 
                 clearable,
                disabled,
                searchable
            }               = this.state;

        Object.keys(countries).map(function(elem) {
            const o  = {};
            o.value  = countries[elem].name;
            o.label  = countries[elem].name;
            o.native = countries[elem].native;
            countriesOptions.push(o);
        });

       
        return (
            <form 
                className="adr-form"
                onSubmit={this.handleSubmit}>
                <div className="bdy">
                	<div className="section-label">
    	                <div className="section-label">
    	                    <div className="txt">
    	                        countries 
    	                    </div>
    	                </div>
    	                <div className="section-inp">
                            <div className="lang-inp-ctnr">
                                <CountryDropdown
                                    value={this.state.country}
                                    name="selectCountry"
                                    classes="Select-control"
                                    onChange={this.selectCountry} />
                            </div>
    	                </div>
    	            </div>
                    <div className="section-label">
                        <div className="section-label">
                            <div className="txt">
                                region 
                            </div>
                        </div>
                        <div className="section-inp">
                            <div className="lang-inp-ctnr">
                                <RegionDropdown
                                    country={this.state.country}
                                    value={this.state.region}
                                    name="selectRegion"
                                    classes="Select-control"
                                    onChange={this.selectRegion} />
                            </div>
                        </div>
                    </div>
    	            <div className="section-label">
    	                <div className="section-label">
    	                    <div className="txt">
    	                        city 
    	                    </div>
    	                </div>
    	                <div className="section-inp">
                            <div className="lang-inp-ctnr">
                                <AsyncSelect 
                                    value={this.state.city}
                                    onChange={this.updateCity}  
                                    labelKey="name"
                                    valueKey="name" 
                                    name="select-city"
                                    clearable={clearable}
                                    simpleValue
                                    loadOptions={this.getCities} 
                                    backspaceRemoves={false} 
                                    ref={(ref) => { this.citySelect = ref; }}
                                    />
                            </div>
    	                </div>
    	            </div>
                </div>
                <div className="btm">
                    <button 
                        className="btn btn-primary btn-sm" 
                        type="submit" 
                        disabled={submitting}>Submit
                    </button>
                </div>
            </form>
        )
    }
})

export default  connect(state=> ({
    
}))(AdressForm)