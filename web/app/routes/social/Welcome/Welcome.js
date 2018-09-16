import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link, withRouter }         from 'react-router-dom'
import { connect }                  from 'react-redux'
import classnames                   from 'classnames'

import * as axios                   from 'axios'
import _                            from 'lodash'
import { SignupForm }             from '../../../components'

import { 
    App as AppActions
}                                   from '../../../actions'


const Welcome  = createReactClass({

    getInitialState() {
        const location = this.props.location ? this.props.location 
                                             : this.props.history.location
        return {
            left: '100px',
            width: '800px',
            height: '400px',
            // panel: getUrlParameterByName('panel', location.search),
        }
    },

    componentDidMount() {
        //next images in this post
        //perform ajax request for getting next photo id on this one
        const { dispatch, params, history } = this.props;
        
    },

    componentDidUpdate(oldProps, oldState) {
        if(this.props !== oldProps) {
            // this.setState({
            //     panel: getUrlParameterByName('panel', this.props.history.location.search)  
            // })
        }
    },

    componentWillUpdate(nextProps, nextState) {
           
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.location !== nextProps.location) {
            handleRouteChange(
                this.props.dispatch,
                nextProps.history,
                nextProps.location
            )
        }
    },

    render() {
        const { left, width, halfHeight }   = this.state,
                { user, match } = this.props;
        return (
            <div className="wel-bd-ctnr">
                <div className="wel-bd-ctnr-a">
                    <div className="regist-f-ctnr">
                        <div className="regist-f-ctnr-a">
                            <SignupForm {...this.props} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

/////
export default withRouter(connect(state => ({ 
    user: state.User.user,
}))(Welcome))
