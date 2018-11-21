import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { fromJS, Map }  	from 'immutable'

import { Link, withRouter } from 'react-router-dom'
import { push } from 'react-router-redux';
import { 
    Center,
    Right, 
}                           from '../../../components/social/home'
import Left 				from './Left'
import {
	Foot, IntroPrev, PhotosPrev, StickyMenu,
	StickyNavLinks, MembersPrev,
    OptionsPrev,
}                         	from './components'
import { 
	Places as PlacesActions 
}    						from '../../../actions'

import { getUrlParameterByName } from '../../../utils/funcs'


import '../../../styles/social/places.scss'


/**
 * handleRouteChange
 * @param dispatch
 * @param history
 * @param location
 */
function handleSearchChange(dispatch, history, location) {
    const pathname = location.pathname,
    tag = getUrlParameterByName('tag', location.search) //['infos, photos, relations']

    if(pathname.indexOf('/placepic')) {
        console.log('ProfilePic')
    } else if(pathname.indexOf('/relations')) {
        console.log('relations')
    } else if(pathname.indexOf('/infos')) {
        console.log('infos')
    } else {
        
    }
}


const Head = (props) => {
    const { members } = props,

    imageStyle = {
        width: '400px',
    }
    return(
        <div className="grp-top-a" >
            <div className="grp-top-lft">
                <div className="grp-top-content">
                    {members.map(function(u, i) {
                        return(
                            <div key={i} className="pic-dv-grp-list">
                                <img 
                                    src={u.profile_pic.web_path}
                                    style={imageStyle}
                                    className="pic-grp-list" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const PlaceName  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            place: {},
		}
	},

	onShare(postId, refer) {
        this.props.onShare(postId, refer)
    },

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {

        if (this.$scroll) window.clearRequestTimeout(this.$scroll)

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    updatePlace(props) {
        const { match : { params : { id } }, places } = props,
        place = places[id];

        if(!!place) {
            this.setState({
                place: places[id].place,
                newsRefs: places[id].newsRefs,
                photos: places[id].photos,
            })
        } else {
            // this.setState({ loading: true })
        }
    },

    componentWillMount() {
        this.updatePlace(this.props);
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.setState({
            screenWidth:  window.screen.width
        })
        const { user, postIds, dispatch } = this.props;
        findDOMNode(this).addEventListener('scroll', this.handleScroll)

        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll);
        findDOMNode(this).removeEventListener('scroll', this.handleScroll);
    },

    componentWillReceiveProps(nextProps) {
    	if(this.props.places !== nextProps.places) {
    		this.updatePlace(nextProps);
    	}

    	if(this.props.location !== nextProps.location) {
    		handleSearchChange(
    			this.props.dispatch,
    			nextProps.history,
    			nextProps.location
    		)
    	}
    },

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.props !== nextProps
    // },

	render() {
		const { 
            hasOwnDiary, screenWidth, 
            place, newsRefs, 
            photos, 
        }                         = this.state,
		{ dispatch, user, loading  }        = this.props

        if(loading) {
            return(
                <div className="hm-container place" ref={c => this._pageElm = c}>
                    <div className="ld-route-dta">loading</div>
                </div>
            )
        }

        /////////////////
		return (
			<div className="hm-container place" ref={c => this._pageElm = c}>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr"> 
                    	<div id="hm_lft_dv" className="hm-lft-dv">
                    		<div className="show-grp-plus">
			                    <div className="show-grp-plus-a">
			                        <div className="show-grp-plus-intro">
			                        	<IntroPrev
											{...this.props}	
											place={place}
											user={user}
											/>
			                        </div>
                                    <div className="show-grp-plus-opt">
                                        <OptionsPrev
                                            {...this.props} 
                                            place={place}
                                            user={user}
                                            />
                                    </div>
			                        <div className="show-grp-plus-pho">
			                        	<PhotosPrev
											{...this.props}	
											user={user}
											place={place}
											photos={photos}
											/>
			                        </div>
			                        <div className="show-grp-plus-mbr">
			                        	<MembersPrev
											{...this.props}	
											user={user}
											place={place}
											/>
			                        </div>			                        
		                        	<Foot 
		                        		{...this.props}	
		                        		/>
			                    </div>
			                </div>
                            <div id="hm_frst_blk" className="hm-frst-blk">
                                <div className="hm-lft-dv">
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        screenWidth={screenWidth}
                                        place={place}
                                        />                                
                                </div>
                            </div>
                    	</div>
                        <div id="home-center-div" className="home-center-div central-border col-xs-8 col-sm-8 col-md-6 col-lg-6">
                            <div  className="center-tp">
                                <Head 
                                    {...this.props} 
                                    place={place}
                                    members={places.members}
                                    user={user}
                                    />
                            </div>
                            <div  className="center-bd">
                                <Center 
                                    {...this.props} 
                                    onShare={this.onShare} 
                                    onComment={this.onComment}
                                    onLike={this.onLike}
                                    home={false}
                                    place={place}
                                    newsRefs={newsRefs}
                                    onSideComment={this.onSideComment}
                                    screenWidth={screenWidth}
                                    place={place}
                                    referIn="place"
                                    />
                            </div>
                        </div>
                        <div id="hm_rght_div" className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                            <div className="lft-dv">
                                <div className="lft-dv-a">
                                    <StickyNavLinks
                                    	{...this.props}
                                        dispatch={dispatch}
                                        place={place}
                                        user={user}
                                        />        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={this.props.postFormFocus ? `gl-frm-out out-active` : `gl-frm-out`}></div>
                <div className={this.props.editPostFormFocus ? `edt-pst-out out-active` : `edt-pst-out`}></div>
            </div>
		)
	}
})


//////
export default  withRouter(connect(state =>({
	user: state.User.user,
	places: state.Places.places,
    loading: state.Places.loading
}))(PlaceName))