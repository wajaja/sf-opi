import React             from 'react'
import createReactClass  from 'create-react-class'
import { Link, withRouter } from 'react-router-dom'
import { Helmet }           from 'react-helmet'
import { connect }       from 'react-redux'
import { LoginForm }     from '../../../components'

const Login  = createReactClass({

    getInitialState() {
        return {
            left: '100px',
            width: '800px',
            height: '400px',
            // panel: getUrlParameterByName('panel', location.search),
        }
    },

    componentDidUpdate(oldProps, oldState) {
        if(this.props !== oldProps) {
            // this.setState({
            //     panel: getUrlParameterByName('panel', this.props.history.location.search)  
            // })
        }
    },

    componentWillReceiveProps(nextProps) {
        
    },

    render() {
        const { left, width, halfHeight }   = this.state,
                { user, match } = this.props;

        // if(!panel || (['profilepic', 'relations', 'infos'].indexOf(panel) === -1)) {
        //     //redirect to profile
        //     return  <Redirect to={{
        //                 pathname: '/confirmed/',
        //                 search: '?panel=profilepic',
        //                 state: { referrer: this.props.location }
        //             }}/>
        // }

        return (
            <div className="row out-auth">
                <Helmet>
                    <title>{`Login`}</title>
                </Helmet>
                <div className="sect-frm-ctnr">
                    <LoginForm {...this.props} />
                </div>
            </div>
        )
    }
})

/////
export default withRouter(connect(state => ({ 
    user: state.User.user,
}))(Login))
