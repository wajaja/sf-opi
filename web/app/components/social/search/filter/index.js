import React        from 'react'
import createReactClass from 'create-react-class'

import { User }           from '../../../../components' 

/**
 * Filters component used by Search route
 */
const Filters  = createReactClass( {

    /**
     * defaultProps
     * @type {{onClick: Filters.defaultProps.onClick, results: Array}}
     */
    getDefaultProps() {
        return {
            onClick: () => {},
            results: [],
        }
    },

    /**
     * renderResults
     * @param fn
     * @param comp
     * @returns {*}
     */
    renderResults(fn, comp) {
        const items = fn ? this.props.results.filter(fn) : this.props.results
        if (!items.length) 
            return <div className="no-results">No results found</div>

        return items.map(comp)
    },

    ////////////////////////////////
    render() {
        const { history, recentTerms } = this.props
        return (
            <div className="flt-ctnr">
                <div className="results">
                    <ul>
                        {this.renderResults(null, (_r, i) => {
                            const r = _r._hit && _r._hit._source
                            switch (_r._hit._type) {
                                case 'user':
                                    return (
                                        <li key={`result-user-${r.username}`}
                                            onClick={(e) => history.push(`/${r.username}`)}
                                            className="pst-slct-usr-dv li-result">
                                            <div className="li-result-a">
                                                <User.Photo 
                                                    imgHeight={53}
                                                    for="suggestion"
                                                    user={r}
                                                    imageStyle={{
                                                        borderRadius: '2px'
                                                    }}
                                                    className="pst-slct-usr-pic" />
                                                <div className="pst-slct-usr-sp-nm">
                                                    <span>{r.firstname}</span>
                                                    <span>{r.lastname}</span>
                                                    <div className="pst-slct-usr-sp-usrnm">
                                                        {r.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )

                                case 'group':
                                    return (
                                        <li key={`result-grp-${r.id}`}
                                            onClick={(e) => history.push(`/groups/${r.id}`)}>
                                            <div className="result-inner result-user">
                                                <span>{r.name}</span>
                                            </div>
                                        </li>
                                    )

                                case 'hashtags':
                                    return (
                                        <li 
                                            key={`result-hashtags-${this.props.term}`}
                                            onClick={(e) => this.props.onClick(e, i, r)}>
                                            <div className="result-inner">
                                                <strong>#{r.word}</strong>
                                            </div>
                                        </li>
                                    )

                                case 'location':
                                    return (
                                        <li key={`result-location-${this.props.term}`}
                                           onClick={(e) => this.props.onClick(e, i, r)}>
                                           {r.word}
                                        </li>
                                    )
                            }

                        })}
                    </ul>
                </div>

                {!this.props.results.length && 
                    <div className="results">
                        <ul>
                            {recentTerms.map && recentTerms.map((term, i) => (
                                    <li key={`term-user-${i}`}
                                        onClick={(e) => history.push(`/search?q=${term}`)}>
                                        <div className="recent-term">{term}</div>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                }
            </div>
        )
    }
})

export default Filters