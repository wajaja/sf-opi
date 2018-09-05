//load invitations;
var InvitationSection = React.createClass({
    getInitialState: function() {
        return {
            invitations: []
        }
    },
    //this is used when we try to same friend confirmation
    handleFreind: function(){

    },
    componentDidMount: function() {
        this.loadInvitations();
        setInterval(this.loadFromServer, 300);
    },
    loadInvitations: function() {
        $.ajax({
            type: 'get',
            url: 'http://127.0.0.1/opinion/web/app_dev.php/invitations'+'/',
            success: function (data) {
                this.setState({invitations: data.invitations});
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div>
                <InvitationList invitations={this.state.invitations} />
            </div>
        );
    }
});
var InvitationList = React.createClass({
    render: function() {
        var invitationNodes = this.props.invitations.map(function(invitation, i) {
            return (
                <InvittionBox  invitationid={invitation.id} key={i} username={invitation.sender.username} picture={invitation.sender.profilepic} firstname={invitation.sender.firstname} lastname={invitation.sender.lastname} senderId={invitation.sender.id}>
					{invitation.invitation}</InvitationBox>
            );
        });
        return (
            <div className="invit-bd-ul-ct">
                {invitationNodes}
            </div>
        );
    }
});
var InvitationBox = React.createClass({
    handleProfile: function(v){
        console.log('username');
    },
    render: function() {
        return (
            <div onClick={this.handleProfile} data-invit-id={this.props.invitationid} data-username={this.props.username} data-firtname={this.props.firstname} data-lastname={this.props.lastname} className="invit-dv">
                <div className="invit-l-i">
                    <a onClick={this.handleProfile} data-invitation-id={this.props.invitationid} data-username={this.props.username} className="invit-sdr-lk-pic" href={this.props.username}>
                        <img src={this.props.picture} className="invit-sdr-pic" />
                    </a>
                    <a onClick={this.handleProfile} data-invitation-id={this.props.invitationid} data-username={this.props.username} className="invit-sdr-lk-nm" href={this.props.username}>
                        <span className="">{this.props.firstname}</span> <span className="">{this.props.lastname}</span>
                    </a>
                </div>
                <div data-chld-act={this.props.invitationid} className="invit-r-c">
                    <div className="invit-r-c-ct">
                        <a onClick={this.handleProfile} href="#" data-trgt={this.props.invitationid} className="invit-lk-dlt-iv"><i className="fa fa-times dlt-iv" aria-hidden="true"></i></a>
                        <span className="invit-cfm-sp">
                            <button onClick={this.handleProfile} data-trgt={this.props.invitationid} className="invit-btn-cfm-fri">Confirme</button>
                            <button data-trgt={this.props.invitationid} className="invit-btn-cfm-flw">Follow</button>
                        </span>
                        <a onClick={this.handleProfile} href="#" data-trgt={this.props.invitationid} className="invit-lk-msk-iv">mask</a>
                    </div>
                </div>
            </div>
        );
    }
});
window.InvitationSection = InvitationSection;
