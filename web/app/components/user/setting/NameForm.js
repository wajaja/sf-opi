import React                from 'react'
import { Field, reduxForm } from 'redux-form'

const required = value => value ? undefined : 'Required',
maxLength   = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined,
maxLength15 = maxLength(15),
minLength   = min => value => value && value.length < min ? `Must be ${min} characters or big???` : undefined,
minLength2 = minLength(2),
number      = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined,
minValue    = min => value => value && value < min ? `Must be at least ${min}` : undefined,
minValue18  = minValue(18),
email       = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined,
tooOld      = value => value && value > 65 ? 'You might be too old for this' : undefined,
aol         = value => value && /.+@aol\.com/.test(value) ? 'Really? You still use AOL for your email?' : undefined;

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
    <div className="inp-tgther">
        <label>{label}</label>
        <div className="inp-elm">
            <input {...input} type={type}/>
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    </div>
)

/////////////
const NameForm = (props) => {
    const { onSubmit, pristine, reset, submitting } = props
    return (
        <form className="nm-form"
            onSubmit={onSubmit}>
            <div className="nm-form-bdy" >
                <Field name="firstname" type="text"
                    component={renderField} label="Firstname"
                    validate={[ required, maxLength15, minLength2 ]}
                    />
                <Field name="nickname" type="text"
                    component={renderField} label="Nickname"
                    validate={[ maxLength15 ]}
                    warn={aol}
                    />
                <Field name="lastname" type="text"
                    component={renderField} label="Lastname"
                    validate={[ required, maxLength15, minLength2 ]}
                    warn={aol}
                    />
            </div>
            <div className="nm-form-btm" >
                <button 
                    className="btn btn-primary btn-sm" 
                    type="submit" 
                    disabled={submitting}>
                    Submit
                </button>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'NameForm' // a unique identifier for this form
})(NameForm)