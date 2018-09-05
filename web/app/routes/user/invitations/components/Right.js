import React                    from 'react'
import createReactClass         from 'create-react-class'
import { connect }              from 'react-redux'

// import { LiveActivities, Diary, TVChannel,
//          SuggestUsers, }        from '../../../../components'


const Right  = createReactClass({
	
	getInitialState() {
		return {
            hasOwnDiary: true,
        }
	},

    componentDidMount() {

    },

	render() {
        const { screenWidth, dispatch, user } = this.props,
        { hasOwnDiary }                 = this.state,
        userId                              = user.id;

        if(!userId) return <div />

		return (
			<div id="h-r-dv" className="h-r-dv">
                <div className="h-r-dv-ctnr">
                    {screenWidth > 992 && 
                        <div className="rght-dv">
                            <div className="rght-dv-a">
                                TVChannel
                                <div className="sep-dv"></div>
                                LiveActivities
                                <div className="sep-dv"></div>                                
                            </div>
                        </div>
                    }
                </div>
            </div>
		)
	}
})

export default connect(state =>({
    user: state.User.user,
}))(Right)