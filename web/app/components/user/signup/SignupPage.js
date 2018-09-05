import React                from 'react';
import createReactClass     from 'create-react-class'
import SignupForm           from './SignupForm';
import PropTypes            from 'prop-types';
import { connect }          from 'react-redux';
import { userSignupRequest, isUserExists } from '../../../actions';
// import { addFlashMessage } from '../../actions/flashMessages.js';

const SignupPage  = createReactClass( {
  render() {
    const { userSignupRequest, isUserExists } = this.props;
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <SignupForm
            isUserExists={isUserExists}
            userSignupRequest={userSignupRequest} />
        </div>
      </div>
    );
  }
})

///////
SignupPage.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired
}


export default connect(null, { userSignupRequest, isUserExists })(SignupPage);
