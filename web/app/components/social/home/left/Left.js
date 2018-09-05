import React            from 'react'
import createReactClass from 'create-react-class'
import { findDOMNode }  from 'react-dom'
import { connect }      from 'react-redux'
import { Link }         from 'react-router-dom'
import MiniProfileHolder      from './MiniProfileHolder'

import { ChatHolder } from '../../../../components'
import MyLoadable    from '../../../../components/MyLoadable'
const Chat      = MyLoadable({loader: () => import('../../../../components/message/chat/Chat')}),
MiniProfile     = MyLoadable({loader: () => import('./MiniProfile')})


/**
 * Landing
 * Landing component used by Home route
 */
const Left  = createReactClass({

    /**
     * componentDidMount
     */
    // componentDidMount() {
    //     findDOMNode(this._pageElm).addEventListener('scroll', this.handleScroll)
    // }

    // *
    //  * componentWillUnmount
     
    // componentWillUnmount() {
    //     findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll)
    // }


    /**
     * handleRefresh
     * @param e event
     */
    // handleRefresh = (e) {
    //     this.props.onLoadHidden()
    // }

    /**
     *
     * @returns markup
     */
    render() {
        const { dispatch, exception, history, screenWidth, serverSide } = this.props

        if(serverSide) {
            return(
                <div id="hm_rgth_dv_a">
                    <div id="hm_rgth_dv_b" className="hm-rgth-dv-b">
                        <div id="_3" className="profile_3">
                           <MiniProfileHolder {...this.props} />
                        </div>
                        <div id="_8" className="online_8">
                            <ChatHolder {...this.props} />
                        </div>
                        <div id="_4" className="activity_4"></div>
                    </div>
                </div>
            )
        }

        return (
            <div id="hm_rgth_dv_a">
                <div id="hm_rgth_dv_b" className="hm-rgth-dv-b">
                    <div id="_3" className="profile_3">
                       <MiniProfile 
                            {...this.props}
                            />
                    </div>
                    <div id="_8" className="online_8">
                        <Chat 
                            changeView={this.props.changeView}
                            auth_data={this.props.auth_data}
                            access_token={this.props.access_token}
                            clientId={this.props.clientId}
                            startCall={this.props.startCall}
                            rejectCall={this.props.rejectCall}
                            callWindow={this.props.callWindow}
                            localSrc={this.props.localSrc}
                            peerSrc={this.props.peerSrc}
                            callConfig={this.props.callConfig}
                            peerCon={this.props.peerCon}
                            endCall={this.props.endCall}
                            dispatch={this.props.dispatch}
                            fireUser={this.props.fireUser}
                            firebase={this.props.firebase}
                            getImageFromCache={this.props.getImageFromCache}
                            toggleOnlineList={this.props.toggleOnlineList}
                            />
                    </div>
                    <div id="_4" className="activity_4"></div>
                </div>
            </div>
        )
    }
})

export default Left;