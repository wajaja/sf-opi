import React                from 'react'
import { findDOMNode }      from 'react-dom'
import createReactClass     from 'create-react-class'
import { connect }          from 'react-redux'
import { fromJS, Map }      from 'immutable'
import { Helmet }           from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux'

import Left                 from './Left'
import Right                from './Right'
import {
    Foot, GroupBox
}                           from './components'
import { 
    Posts as PostsActions,
    Groups as GroupsActions 
}                           from '../../../actions'

import { 
    GroupForm
}                           from '../../../components'

import MyLoadable    from '../../../components/MyLoadable'
const HMember    = MyLoadable({loader: () => import('./components/HMember')})


const Head = (props) => {
    const { user } = props,

    imageStyle = {
        width: '400px',
    }
    return(
        <div className="in-top-a" >
            <div className="in-top-b">
                <div className="in-top-content">
                    
                </div>
            </div>
        </div>
    )
}

///////
const New  = createReactClass( {

    getInitialState() {
        return {
            hasOwnDiary: false,
            screenWidth: 760,
            group: {},
            loading: true,
            recipients: [],
        }
    },

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {

        if (this.$scroll) window.clearRequestTimeout(this.$scroll);

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    handleGroupSubmit(e) {
        e.preventDefault();
        const name = this.props.groupForm.values.name,
        data = {
            name: name,
            recipients: this.state.recipients,
        }
        console.log('group submitted')
        this.props.createGroup(data);
    },

    updateRecipients(recipients) {
        this.setState({recipients})  //array of usernames
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.groups !== nextProps.groups) {
            //this.updateProfile(nextProps);
        }

        if(this.props.location !== nextProps.location) {
            handleSearchChange(
                this.props.dispatch,
                nextProps.history,
                nextProps.location
            )
        }
    },

    render() {
        const { 
            hasOwnDiary, screenWidth, 
            loading, members 
        }                         = this.state,
        { dispatch, user, list }        = this.props

        /////////////////
        return (
            <div className="hm-container group new">
                <Helmet>
                    <title>Create Group</title>
                </Helmet>
                <div className="hm_main_blk">
                    <div className="hm-main-blk-ctnr"> 
                        <div className="grp-lft-dv">
                            <div className="grp-frst-blk">
                                <div className="grp-frst-blk-a">
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        group={{}}
                                        />                                
                                </div>
                            </div>
                        </div>
                        <div  className="cover_ctnr_0">
                            <div className="pic-holder-ctnr">
                                <div></div>
                            </div>
                            <GroupForm 
                                {...this.props}
                                onSubmit={this.handleGroupSubmit}
                                updateRecipients={this.updateRecipients}
                                user={user}
                                />
                            <div className="lft-dv-a">
                                <div className="show-usr-plus-a">
                                    <div className="show-usr-plus-intro">
                                    </div>
                                    <div className="show-usr-plus-pho">
                                    </div>
                                    <div className="show-usr-plus-ff">
                                    </div>
                                </div>
                            </div>
                            <HMember
                                {...this.props}
                                members={this.state.recipients}
                                />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})
/////
function mapDispatchToProps(dispatch) {
    return {
        groupsActions: bindActionCreators(GroupsActions, dispatch),
    }
}

//////
export default  withRouter(connect(state =>({
    user: state.User.user,
    groups: state.Groups.groups,
    groupsList: state.Groups.list,
    groupForm: state.form.GroupForm,
}, mapDispatchToProps))(New))