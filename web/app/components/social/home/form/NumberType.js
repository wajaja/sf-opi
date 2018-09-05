import React            from 'react';
import classnames       from 'classnames';
import PropTypes        from 'prop-types';

const NumberType = ({name, value, max, min, placeholder, error, customClassName, onChange }) => {
    return (
        <span>
            <input
                onChange    = {onChange}
                type        = "number"
                className   = {customClassName}
                name        = {name}
                max         = {max}
                min         = {min}
                value       = {value}
                placeholder = {placeholder}
            />
            {error && <span className="help-block">{error}</span>}
        </span>
    )
}
/////
/////
NumberType.propTypes = {
    name       : PropTypes.string.isRequired,
    placeholder : PropTypes.string,
    error       : PropTypes.string,
    min         : PropTypes.string,
    max         : PropTypes.string,
    onChange    : PropTypes.func.isRequired,
    customClassName : PropTypes.string,
}

NumberType.defaultProps = {
    type        : "text",
    placeholder : ""
}

export default NumberType;