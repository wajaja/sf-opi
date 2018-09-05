import React                from 'react';
import classnames           from 'classnames';
import PropTypes            from 'prop-types';


const TextFieldGroup = ({field, value, label, placeholder, error, type, customClassName, onChange, checkUserExists }) => {
    return (
        <div className={classnames ('form-group', {'has-error' : error })}>
            <label className="control-label">{label}</label>
            <input 
                onChange    = {onChange}
                type        = {type} 
                className   = {customClassName} 
                name        = {field}
                value       = {value}
                placeholder = {placeholder}
            />
            {error && <span className="help-block">{error}</span>}
        </div>
    )
}
TextFieldGroup.propTypes = {
    field       : PropTypes.string.isRequired,
    value       : PropTypes.string.isRequired,
    label       : PropTypes.string,
    placeholder : PropTypes.string,
    error       : PropTypes.string,
    type        : PropTypes.string,
    customClassName : PropTypes.string,
    onChange    : PropTypes.func.isRequired,
    checkUserExists: PropTypes.func
}

TextFieldGroup.defaultProps = {
    type        : "text",
    placeholder : ""
}

export default TextFieldGroup;
                              
                    