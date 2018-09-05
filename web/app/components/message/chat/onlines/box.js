import React                from 'react'
import createReactClass     from 'create-react-class'
import { Link }             from 'react-router-dom'

        // dispatch(MessagesActions.loadThreadByUsername(thread.id))
const Box = ({selectUser, user, thread_id}) => (
    <div
        onClick={() => selectUser(user)}
        className="oln-usr-dv">
        <img src={user.profile_pic.web_path} className="oln-usr-pic" />
        <div className="oln-usr-nm-ctnr">
            <div className="oln-usr-lk-nm">
                <span className="oln-usr-lk-frst">{user.firstname} </span> 
                <span className="oln-usr-lk-lst">{user.lastname}</span>
            </div>
            <span className="oln-usr-lk-usrnm">{user.username}</span>
        </div>                
        <span className="oln-usr-state"></span>
    </div>
)

export default Box