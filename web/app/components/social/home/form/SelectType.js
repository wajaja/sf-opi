import React            from 'react';
import classnames       from 'classnames';
import map              from 'lodash/map';
import PropTypes        from 'prop-types';


const SelectType = ({field, value, optionsArr, customClassName, error, onChange }) => {
    
    const options = map(optionsArr, (type, i) =>
        <option key={i} value={type.value}>{type.name}</option>
    );
    return (
        <select className   = {customClassName} 
                onChange    = {onChange}
                name        = {field} 
                defaultValue= {field} 
        >
            <option value="" >{field}</option>
            {options}
            {error && <span className="help-block">{error}</span>}
        </select>
    )
}
////
////
SelectType.propTypes = {
    field       : PropTypes.string.isRequired,
    error       : PropTypes.string,
    begin       : PropTypes.array,
    onChange    : PropTypes.func.isRequired,
}

SelectType.defaultProps = {
    value        : "",
}

export default SelectType;