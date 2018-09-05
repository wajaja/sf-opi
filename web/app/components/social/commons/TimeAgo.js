import React            from 'react'
import createReactClass from 'create-react-class'
import * as moment      from 'moment'

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        s:  "just now",
        m:  "1 min",
        mm: "%d min",
        h:  "1 hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "1 month",
        MM: "%d month",
        y:  "1 year",
        yy: "%d years"
    }
});

// moment.updateLocale('fr', {
//     relativeTime : {
//         future : 'dans %s',
//         past : '%s',
//         s : 'A l\'instant',
//         m : '1 min',
//         mm : '%d min',
//         h : '1 heure',
//         hh : '%d heures',
//         d : '1 jour',
//         dd : '%d jour',
//         M : '1 mois',
//         MM : '%d mois',
//         y : '1 an',
//         yy : '%d ans'
//     }
// });

/**
 * TimeAgo index component
 */
const TimeAgo  = createReactClass( {

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
        return <span className="time-ago">{moment.utc(moment.unix(this.props.timestamp)).fromNow()}</span>
    }

})

export default TimeAgo
