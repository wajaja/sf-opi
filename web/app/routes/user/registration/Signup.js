import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link, withRouter }      from 'react-router-dom'
import { connect }                  from 'react-redux'
import { Helmet }           from 'react-helmet'
import { SignupForm }             from '../../../components'

const Signup  = createReactClass({

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
            <div className="cfmd-ctnr">
                <Helmet>
                    <title>{`Signup`}</title>
                </Helmet>
                <SignupForm {...this.props} />
            </div>
        )
    }
})

/////
export default withRouter(connect(state => ({ 
    user: state.User
}))(Signup))
