import React            from 'react';
import createReactClass from 'create-react-class'

const moment = require('moment');          //export moment was deprecated in 2.4.0

/**
 * TimeAgo index component
 */
const TimeOut  = createReactClass( {

    /**
     * defaultProps
     * @type {{updateDuration: number, timestamp: null}}
     */
    getDefaultProps() {
        return {
            updateDuration: 30000,
            timestamp: null,
        }
    },

    /**
     * state
     * @type {{i: number}}
     */
     getInitialState() {
        return {
            i: 0,
        }
     },

    /**
     * componentDidMount
     */
    componentDidMount() {
        /**
         * this.$i
         * @type {number|*}
         */
        this.$i = window.requestInterval(() => {
            this.setState({i: (this.state.i + 1)})
        }, this.props.updateDuration)
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestInterval(this.$i)
    },

    /**
     * render
     * @returns markup
     */
    render() {
        return <span className="time-out">{moment.utc(this.props.timestamp).fromNow()}</span>
    }

})

export default TimeOut;
