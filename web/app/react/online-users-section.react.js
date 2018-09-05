//load online user;
import React, {Component} from 'react';
import OnlineUsers from 'online-users.react';
 
export default class OnlineUsersSection extends Component {
    getInitialState: function() {
        return {
            users: []
        }
    },
    componentDidMount: function() {
        this.loadFromServer();
        setInterval(this.loadFromServer, 100000);
    },
    loadFromServer: function() {
        $.ajax({
            url: 'http://opinion/app_dev.php/online/users',
            success: function (data) {
                this.setState({users: data.users});
                this.setState({nb_users: data.users.length});
            }.bind(this)
        });
    },
    render() {
        return (
            <div>
                <div className="oln-usr-nb">{this.state.nb_users}</div>
                <OnlineUsers users={this.state.users} />
            </div>
        );
    }
}
