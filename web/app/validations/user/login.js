//import validator from 'validator';
import isEmail from 'validator/lib/isEmail'
import _ from 'lodash';

export default function validateInput(data) {
  let errors = {};

  if (_.isEmpty(data.username)) {
    errors.username = 'This field is required';
  }
   
  if (_.isNull(data.password)) {
    errors.password = 'This field is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
}