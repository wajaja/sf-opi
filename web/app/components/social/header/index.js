import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
import { 
    Link, 
    IndexLink, 
    withRouter 
}                       from 'react-router-dom'

//import Nav from '../../components/social/nav'
import { NavBar } from '../navbar'


/**
 * Left component
 */
const Left  = createReactClass( {

    getInitialState() {
        return { step: 0, }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.step !== this.state.step
    },

    componentDidMount() {
        if (this.props.active) {
            setTimeout(() =>
                this.setState({ step: this.state.step + 1}), 1)
        }
    },

    componentDidUpdate(oldProps, oldState) {
        if (this.props.active != oldProps.active) {

            if (this.props.active) {
                setTimeout(() =>
                    this.setState({ step: this.state.step + 1}), 1)
            } else {
                this.setState({ step: 0, })
            }
        }

    },

    getClasses () {
        const classes = ['item', 'left']

        if (this.props.active) {
            classes.push(
                this.state.step === 0 ? 'active-initial' : 'active'
            )

        }

        return classes
    },

    /**
     * render
     * @returns markup
     */
    render() {
        return (
            <div className={this.getClasses().join(' ')}>
                <IndexLink to={`/`}>
                    <img src="/img/logo.svg" width="108" height="32"/>   //opinion's logo
                </IndexLink>
            </div>
        )
    }
})


/**
 * Right component
 */
const Right  = createReactClass({

    /**
     * render
     * @returns markup
     */
    render() {
        return (
            <div className="item right">
                <Link to={`/profile/${this.props.id}`} activeClassName="active">
                    <img src="/img/nav_icon.svg" width="23" height="12"/>
                </Link>
            </div>
        )
    }
})

/**
 * Header index component
 */
const Header  = createReactClass( {

    /**
     * render
     * @returns markup
     */
    render() {
        return (
            <div>
                <header className="container top"></header>
                <div>
                    something done here
                </div>
            </div>
        )
    }
})

export default connect(state => ({
    navigation: state.Navigation,
    user: state.User.user,
}))(Header)  //withRouter