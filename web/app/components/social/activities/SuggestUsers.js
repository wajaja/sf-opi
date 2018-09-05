import React 					from 'react'
import { connect } 				from 'react-redux'
import SuggestUserBox 			from './SuggestUserBox'
import axios 					from 'axios'

class SuggestUsers extends React.PureComponent{

	componentDidMount() {
		const { user, dispatch } = this.props,
		userId 					 = user.id
		dispatch({type: 'LOAD_SUGGESTIONS', userId})
	}

	render() {
		const { suggestions, user, dispatch } = this.props,
		imageStyle = {
			height: '50px',
		    width: '50px',
		    border: 'unset',
		    borderRadius: '50%'
		}
		return (
			<div className="u-sugg">
                <div id="u_sugg_co" className="u_sugg_co">
				    <div className="less-sugg-hd">
				        <span className="sugg-txt"> Suggestion... </span>
				    </div>
				    <div className="less-sugg-bd">
				        {suggestions.map((sugg, i) => {
				        	return (
				        		<SuggestUserBox
			        				key={i}
			        				user={user}
			        				type="suggestion-default"
			        				suggestion={sugg}
			        				dispatch={dispatch}
			        				imageStyle={imageStyle}
			        				onFriendConfirm={this.props.onFriendConfirm}
			        				onFollowRequest={this.props.onFollowRequest}
			        				onFriendRequest={this.props.onFriendRequest}
			        				onDeleteInvitation={this.props.onDeleteInvitation}
			        				onUnFollowRequest={this.props.onUnFollowRequest}
			        				/>
			        		)
				        })}
				    </div>
                </div>
            </div>
		)
	}
}

export default connect(state => ({
	user: state.User.user,
	suggestions: state.RelationShip.suggestions,
}))(SuggestUsers)