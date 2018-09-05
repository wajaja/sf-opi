import React            from 'react';
import classnames       from 'classnames';
import PropTypes        from 'prop-types';

const TextareaType = ({name, value, placeholder, rows, customClassName, onChange, minRows, error }) => {
    return (
        <textarea
            rows        = {rows} 
            name        = {name}
            value       = {value}
            onChange    = {onChange}
            placeholder = {placeholder}
            className   = {customClassName}
            data-min-rows-post = {minRows}
        />
    )
}

/////
////
TextareaType.propTypes = {
    name       : PropTypes.string.isRequired,
    value       : PropTypes.string.isRequired,
    placeholder : PropTypes.string,
    error       : PropTypes.string,
    rows        : PropTypes.number,
    minRows     : PropTypes.number,
    onChange    : PropTypes.func.isRequired,
    customClassName : PropTypes.string,
}

TextareaType.defaultProps = {
    rows        : 2,
    minRows     : 2,
    placeholder : "your opinion"
}

export default TextareaType;