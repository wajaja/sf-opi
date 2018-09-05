import React {Component} from 'react';
import OnlineUserBox from 'online-users-box.react';

export default class OnlineUsers extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        { this.props.users && this.props.users.map(function(user, i) {
            return (
                <div className="oln-bd-ul-ct">
                    <OnlineUserBox userid={user.userId} key={i} username={user.username} picture={user.pic_path} firstname={user.firstname} lastname={user.lastname}>{user.user}</UserBox>
                </div>
            );
        })};
    }
}