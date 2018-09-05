/* code from redux-auth-wrapper on basic example */
import connectedAuthWrapper         from 'redux-auth-wrapper/connectedAuthWrapper'
import { connectedReduxRedirect }   from 'redux-auth-wrapper/history3/redirect'
import { routerActions }            from 'react-router-redux'
import { Loading }                  from '../../components'

//Migrating redirection wrappers
export const userIsAuthenticated = connectedReduxRedirect({
    redirectPath: '/login',
    authenticatedSelector: state => state.user.username !== null,
    authenticatingSelector: state => state.user.isLoading,
    AuthenticatingComponent: Loading,
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated'
})

export const UserIsAdmin = connectedReduxRedirect({
    redirectPath: '/',
    authenticatedSelector: state => state.user.isAdmin !== null,
    authenticatingSelector: state => state.user.isLoading,
    AuthenticatingComponent: Loading,
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAdmin',
})


//Hiding Components
const visibleOnlyAdmin = connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && state.user.isAdmin,
    wrapperDisplayName: 'VisibleOnlyAdmin',
})

//Alternate Components
const adminOrElse = (Component, FailureComponent) => connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && state.user.isAdmin,
    wrapperDisplayName: 'AdminOrElse',
    FailureComponent
})(Component)

//Alternate Components
const myProfileOrElse = (Component, FailureComponent) => connectedAuthWrapper({
    authenticatedSelector: state => state.user !== null && state.user.id === state.profile.id,
    wrapperDisplayName: 'AdminOrElse',
    FailureComponent
})(Component)



// Show Admin dashboard to admins and user dashboard to regular users
// <Route path='/dashboard' component={adminOrElse(AdminDashboard, UserDashboard)} />
// export const VisibleOnlyAdmin = connectedRouterRedirect({
//     redirectPath: '/',
//     authenticatedSelector: state => state.user.isAdmin !== null,
//     authenticatingSelector: state => state.user.isLoading,
//     AuthenticatingComponent: Loading,
//     redirectAction: routerActions.replace,
//     wrapperDisplayName: 'VisibleOnlyAdmin',
// })