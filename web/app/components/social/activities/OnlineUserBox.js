import React                from 'react'
import createReactClass     from 'create-react-class'
import { Link }             from 'react-router-dom'

const OnlineUserBox = createReactClass({
	getInitialState() {
		return{
            active: false,
            selected: false,
        }
	},

    openChatBox(e) {
        const { dispatch, thread } = this.props
        dispatch(MessagesActions.loadThreadByUsername(thread.id))
        .then((data) => {
            this.setState({
                loading_thread: false
            })
        })
    },

	render() {
        const { user } = this.props
        return (
            <div onClick={this.openChatBox} className="oln-usr-dv">
                <img src={user.profilePic.web_path} className="oln-usr-pic" />
                <div className="oln-usr-nm-ctnr">
                    <Link className="oln-usr-lk-nm" to={`/${user.username}`}>
                        <span className="oln-usr-lk-frst">{user.firstname} </span> 
                        <span className="oln-usr-lk-lst">{user.lastname}</span>
                    </Link>
                    <span className="oln-usr-lk-usrnm">{user.username}</span>
                </div>                
                <span className="oln-usr-state"></span>
            </div>
        );
    }
})

export default OnlineUserBox