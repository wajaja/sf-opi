import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage, 
        FormattedPlural, 
        FormattedNumber, 
        FormattedRelative 
}                               from 'react-intl';
const  zxcvbn = require('zxcvbn');


export const CurrentMessage = props => {
    const { currentMsg } = props;

    if(currentMsg === 'blank') {
        return(
            <FormattedMessage
                id={'fos_user.current_password.blank'}
                defaultMessage={'Please enter a password'}
            />
        )
    }

    if(currentMsg === 'The entered password is invalid.') {
        return(
            <FormattedMessage
                id={'fos_user.current_password.invalid'}
                defaultMessage={'The entered password is invalid.'}
            />
        )
    }

    return(
        <span />
    )
}

///////////
export const ConfirmMessage = props => {
    const { confirmMsg } = props;

    if(confirmMsg === 'mismatch') {
        return(
            <FormattedMessage
                id={'fos_user.password.mismatch'}
                defaultMessage={"The entered passwords don\'t match."}
            />
        )
    }

    return(
        <span />
    )
}

//////
export const StrengthMessage = props => {
    const { score } = props;

    if(score === 0) {
        return(
            <FormattedMessage
                id={'fos_user.new_password.blank'}
                defaultMessage={'Worst'}
            />
        )
    }

    if(score === 1 || score === 2 ) {
        return(
            <FormattedMessage
                id={'fos_user.new_password.short'}
                defaultMessage={'Short'}
            />
        )
    }

    return(
        <span />
    )
}

////////
const PasswordResetForm = props => {
    const { 
        onSubmit, pristine, reset, submitting,
        newMsg, confirmMsg, currentMsg,
    } = props
    return (
        <form 
            className="psw-form"
            onSubmit={onSubmit}>
            <div className="bdy">
                <div className="inp-tgther">
                    <label>Actual Password</label>
                    <div>
                        <Field
                          name="current_password"
                          component="input"
                          type="password"
                          placeholder=""
                        />
                        <span className="current-msg">
                            <CurrentMessage 
                                currentMsg={currentMsg}
                                />
                        </span>
                    </div>
                </div>
                <div className="inp-tgther">
                    <label>New Password</label>
                    <div className="inp-ctnr">
                        <Field
                            name="new_password"
                            component="input"
                            type="password"
                            placeholder=""
                            />
                            <span className="strength-msg">
                                <StrengthMessage 
                                    score={newMsg}
                                    />
                            </span>
                    </div>
                </div>
                <div className="inp-tgther">
                    <label>Password Confirm</label>
                    <div>
                        <Field
                            name="new_password_confirmation"
                            component="input"
                            type="password"
                            placeholder=""
                            />
                            <span className="confirm-msg">
                                <ConfirmMessage 
                                    confirmMsg={confirmMsg}
                                    />
                            </span>
                    </div>
                </div>
            </div>
            <div className="btm">
                <div className="pass-res-foo">
                </div>
                <div className="pass-res-foo">
                    <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
                      Submit
                    </button>
                </div>
            </div>
        </form>
    )
}

export default reduxForm({
  form: 'PasswordResetForm' // a unique identifier for this form
})(PasswordResetForm)