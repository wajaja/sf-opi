import React from 'react'
import { Field, reduxForm } from 'redux-form'
import classnames 				from 'classnames'

const required = value => value ? undefined : 'Required',
maxLength   = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined,
maxLength15 = maxLength(15),
number      = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined,
minValue    = min => value => value && value < min ? `Must be at least ${min}` : undefined,
minValue18  = minValue(18),
email       = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined,
tooOld      = value => value && value > 65 ? 'You might be too old for this' : undefined,
aol         = value => value && /.+@aol\.com/.test(value) ? 'Really? You still use AOL for your email?' : undefined,

FieldLevelValidation = ({ input, label, type, meta: { touched, error, warning } }) => (
    <div>
        <label>{label}</label>
        <div>
            <input {...input} placeholder={label} type={type}/>
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    </div>
)

export default FieldLevelValidation