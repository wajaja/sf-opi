import React                from 'react'
import { findDOMNode }      from 'react-dom'
import createReactClass     from 'create-react-class'
import { connect }          from 'react-redux'
import { Helmet }           from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'
import Left                 from './Left'
import Right                from './Right'
import {
    Foot, PlaceBox
}                           from './components'
import { 
    Places as PlacesActions 
}                           from '../../../actions'

import { 
    PlaceForm
}                           from '../../../components'

import { getUrlParameterByName } from '../../../utils/funcs'


function handleSearchChange(dispatch, history, location) {
    const pathname = location.pathname,
    tag = getUrlParameterByName('tag', location.search) //['infos, photos, relations']

    if(pathname.indexOf('/grouppic')) {
        console.log('ProfilePic')
    } else if(pathname.indexOf('/relations')) {
        console.log('relations')
    } else if(pathname.indexOf('/infos')) {
        console.log('infos')
    } else {
        
    }
}

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

        if (this.$scroll) window.clearRequestTimeout(this.$scroll)

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this._pageElm)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    handlePlaceSubmit(e) {
        e.preventDefault();
        const name = this.props.placeForm.values.name,
        data = {
            name: name,
            recipients: this.state.recipients,
        }
        console.log('group submitted')
        this.props.createPlace(data);
    },

    componentWillMount() {
        
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.setState({
            screenWidth:  window.screen.width
        })
        findDOMNode(this._pageElm).addEventListener('scroll', this.handleScroll)

        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll)
        findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll)
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
            loading 
        }                         = this.state,
        { dispatch, user, list }        = this.props

        /////////////////
        return (
            <div className="hm-container place" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>Create Place</title>
                </Helmet>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr"> 
                        <div className="hm-lft-dv">
                            <div className="hm-frst-blk">
                                <div className="hm-lft-dv">
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        screenWidth={screenWidth}
                                        />                                
                                </div>
                            </div>
                        </div>
                        <div id="home-center-div" className="home-center-div central-border col-xs-8 col-sm-8 col-md-6 col-lg-6">
                            <div  className="center-tp">
                                <div  className="center-tp-a">
                                    <Head 
                                        {...this.props} 
                                        />
                                </div>
                            </div>
                            <div  className="center-new-plc">
                                <div  className="center-new-plc-a">
                                    <GroupForm
                                        {...this.props}
                                        onSubmit={this.handlePlaceSubmit}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {screenWidth > 992 && 
                    <div className="null">
                        
                    </div>
                }
            </div>
        )
    }
})


//////
export default  withRouter(connect(state =>({
    user: state.User.user,
    groups: state.Groups.groups,
    groupsList: state.Groups.list,
    groupForm: state.form.GroupForm,
}))(New))