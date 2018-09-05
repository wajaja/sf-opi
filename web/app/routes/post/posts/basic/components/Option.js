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

    showSecret(e) {
        e.preventDefault();
        console.log('showSecret')
    },

    showBestComments(e) {
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
                        <div className="psts-opt show-secr">
                            <div className="psts-opt-a">
                                <div  
                                    className="btn-dv"
                                    onClick={this.showSecret}>
                                    Secret
                                </div>
                            </div>
                        </div>
                        <div className="psts-opt bst-cmts">
                            <div className="psts-opt-a">
                                <div 
                                    className="btn-dv"
                                    onClick={this.showBestComments}>
                                    Comments
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fxd-opt-blc">
                    <div className="fxd-opt-blc-a">
                        {typeof post.editors === 'array' && 
                         post.editors.length > 0 && 
                         <Foot 
                            {...this.props} 
                            type="WithAllies"
                            editing={editing}
                            />
                        }
                        {!post.editors.length && 
                         <Foot 
                            {...this.props} 
                            type='Simple'
                            editing={editing}
                            />
                        }
                    </div>
                </div>                
            </div>
        )
    }
})

export default connect(state => ({

}))(Option)