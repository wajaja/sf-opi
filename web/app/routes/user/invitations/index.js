import React       from 'react'   
import { Route }    from 'react-router-dom' 

// wrapping/composing
const HomeRoute = ({ match, component: Component, ...rest }) => (
  <Route children={({match, props}) => (
      <Component match={match} {...props} {...rest}/>
  )}/>
)

export default HomeRoute;