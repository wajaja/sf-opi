import React       from 'react'   
import { Route }   from 'react-router-dom' 

// wrapping/composing
const ConfirmedRoute = ({ match, component: Component, ...rest }) => (
  <Route children={({match, props}) => (
      <Component match={match} {...props} {...rest} />
  )}/>
)

export default ConfirmedRoute;
