import React            from 'react';
import classnames       from 'classnames';
import PropTypes        from 'prop-types';


const InputType = ({name, value, label, placeholder, error, type, customClassName, onChange }) => {
    return (
        <span>
            <input
                onChange    = {onChange}
                type        = {type}
                className   = {customClassName}
                name        = {name}
                value       = {value}
                placeholder = {placeholder}
            />
            {error && <span className="help-block">{error}</span>}
        </span>
    )
}
/////
InputType.propTypes = {
    name       : PropTypes.string.isRequired,
    value       : PropTypes.string.isRequired,
    placeholder : PropTypes.string,
    error       : PropTypes.string,
    type        : PropTypes.string,
    onChange    : PropTypes.func.isRequired,
    customClassName : PropTypes.string,
}

InputType.defaultProps = {
    type        : "text",
    placeholder : ""
}

export default InputType;