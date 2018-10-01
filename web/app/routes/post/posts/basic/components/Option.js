import React                from 'react'
import { findDOMNode }      from 'react-dom'
import createReactClass     from 'create-react-class'
import { connect }          from 'react-redux'
import { bindActionsCreator } from 'redux'

import { Link, NavLink } from 'react-router-dom'

import { 
    Likes as LikeActions,
    Secret as SecretActions,
    Comments as CommentsActions,
}                           from '../../../../../actions'
const Foot         = require('../../../../../components/post/post/Foot').default


const Option = createReactClass({

    getInitialState() {
        return {
            secret: false,
            comments: false,
        }
    },

    getDefaultProps() {
        return {
            editing: false
        }
    },

    scrollTop(e) {
        e.preventDefault();
        console.log('showSecret')
    },

    scrollBottom(e) {
        e.preventDefault();
        console.log('showBestComments')
    },

    render() {
        const { user, post, type, editing } = this.props,

        imageStyle = {
            width: '400px',
        }
        return(
            <div className="psts-top-a" >
                <div className="psts-top-b">
                    <div className="psts-top-content">
                        <div className="psts-opt scr-tp">
                            <div className="psts-opt-a">
                                <div  
                                    className="btn-dv"
                                    onClick={this.scrollTop}>
                                    Scroll to Top
                                </div>
                            </div>
                        </div>
                        <div className="psts-opt scr-btm">
                            <div className="psts-opt-a">
                                <div 
                                    className="btn-dv"
                                    onClick={this.scrollBottom}>
                                    Scroll to bottom
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default connect(state => ({

}))(Option)