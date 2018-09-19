import React                from 'react';
import PropTypes            from 'prop-types';


const TextFieldGroup = ({name, field, hasPreviousSession, wrapClassName, flashBag, value, label, placeholder, errors, type, customClassName, onChange, onBlur, checkUserExists }) => {
    return (
        <div className={wrapClassName}>
            {!!hasPreviousSession && !!flashBag && !!flashBag[name] && 
                <div class={`flash ${field}`}>{flashBag[name]}</div>
            }
            {!!errors && !!errors[name] && <div class={`flash ${field}`}>{errors.wrapper[name]}</div>}
            <label className="control-label">{label}</label>
            <input 
                onChange    = {onChange}
                type        = {type} 
                onBlur      = {onBlur}
                className   = {customClassName} 
                name        = {name}
                value       = {value}
                placeholder = {placeholder}
            />
        </div>
    )
}

////////
TextFieldGroup.propTypes = {
    name       : PropTypes.string.isRequired,
    value       : PropTypes.string.isRequired,
    label       : PropTypes.string,
    placeholder : PropTypes.string,
    errors       : PropTypes.object,
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
                              
                    