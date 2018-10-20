import React, { 
    Fragment, PureComponent
}                       from 'react'
import { connect }      from 'react-redux'
import createReactClass from 'create-react-class'

const SearchBox  = createReactClass({
    
    getInitialState() {
        return {
        }
    },

    doSearch() {
        const query = this.refs.searchInput.value; // this is the search text
        this.props.doSearch(query);
    },

    render() {
        return (
            <div className="frm-select-hd">
                <div className="frm-select-hd-ttl">
                    <span className="frm-select-hd-ttl-sp">{this.props.title}</span>
                </div>
                <div className="frm-select-ctnr">
                    <input type="text" ref="searchInput" placeholder="Search Name" className="edtor-rct-srh"  value={this.props.query} onChange={this.doSearch} onFocus={this.doSearch} />
                </div>
            </div>
        )           
    }
})

//////diplay the matched users lists
const DisplayList  = createReactClass({
    getInitialState() {
        return {

        }
    },

    addContributor(user) {
        this.props.addContributor(user);
    },

    render() {
        const self = this;      
        const userNodes = this.props.data.map(function(user, i) {
            return (
                <div key={i} 
                    className="pst-slct-usr-dv" 
                    onClick={self.addContributor.bind(self, user)}>
                    <img src={user.profilePic} className="pst-slct-usr-pic" />
                    <a className="pst-slct-usr-lk-nm">
                        <span>{user.firstname}</span><span>{user.lastname}</span>
                    </a>
                    <span className="pst-slct-usr-sp-usrnm">{user.username}</span>
                </div>
            )
        });

        //returning the table
        return (
            <div className="pst-frm-select-bd">{userNodes}</div>
        );
    }
})

////////-----------||--------------\\\\\\\\
const Senders  = createReactClass({

    getInitialState() {
        return {
            data: [],
            intervalDataUsers:false,
            query:'',
            filteredData: []
        }
    },

    doSearch(queryText) {

        let queryResult=[];                 //get query result
        
         this.props.defaults.forEach(function(user){
            if (user.firstname.toLowerCase().indexOf(queryText.toLowerCase())!=-1 || 
                user.lastname.toLowerCase().indexOf(queryText.toLowerCase())!=-1 || 
                user.username.toLowerCase().indexOf(queryText.toLowerCase())!=-1) {
                    queryResult.push(user);
            }            
        });
 
        this.setState({
            query:queryText,
            filteredData: queryResult
        })
    },

    addContributor(user) {
        const { dispatch, getState } = this.props;

        if(this.props.senders.length == 2) {
            console.log('allowed senders 2');
            return;
        }

        this.props.addSender(user);

        const usersStr = this.props.senders.reduce(function(usernames, editor) {
            return usernames + ',' + editor.username
        }, '');
    },
    
    render(){
        return (
            <div className="frm-contrib-ctnr-b">
                <SearchBox query={this.state.query} doSearch={this.doSearch}/>
                <DisplayList 
                    {...this.props} 
                    data={this.state.filteredData} 
                    addContributor={this.addContributor}
                    />
            </div>
        );
    }
})


////////-----------||--------------\\\\\\\\
const Receivers  = createReactClass({

    getInitialState() {
        return {
            data: [],
            intervalDataUsers:false,
            query:'',
            filteredData: []
        }
    },

    doSearch(queryText) {

        let queryResult=[];                 //get query result
        
         this.props.defaults.forEach(function(user){
            if (user.firstname.toLowerCase().indexOf(queryText.toLowerCase())!=-1 || 
                user.lastname.toLowerCase().indexOf(queryText.toLowerCase())!=-1 || 
                user.username.toLowerCase().indexOf(queryText.toLowerCase())!=-1) {
                    queryResult.push(user);
            }            
        });
 
        this.setState({
            query:queryText,
            filteredData: queryResult
        })
    },

    addContributor(user) {
        const { dispatch, getState } = this.props;

        if(this.props.senders.length == 2){
            console.log('allowed senders 2');
            return;
        }

        this.props.addReceiver(user);

        const usersStr = this.props.senders.reduce(function(usernames, editor) {
            return usernames + ',' + editor.username
        }, '');
    },
    
    render(){
        return (
            <div className="frm-contrib-ctnr-b">
                <SearchBox query={this.state.query} doSearch={this.doSearch}/>
                <DisplayList 
                    {...this.props} 
                    data={this.state.filteredData} 
                    addContributor={this.addContributor}
                    />
            </div>
        );
    }
})

///////
class AdminSender extends PureComponent {

    constructor(props) {
        super(props);
    }

    closeBox = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.closeAdmin();   //toggle to empty string
    }

    render() {
        return(
            <div className="adm-sdr">
                <div className="adm-sdr">
                    <Senders 
                        {...this.props}
                        addSender={this.props.addSender}/>
                    <Receivers 
                        {...this.props}
                        addReceiver={this.props.addReceiver}/>
                    <div className="pst-frm-select-btm">
                        <button 
                            className="pst-frm-select-fnsh-btn" 
                            onClick={this.closeBox}>close</button>
                    </div>
                </div>
            </div>
        )
    }
}



////////////
const mapStateToProps = (state, ownProps) => {
    const meetYou = state.MeetYou.present;
    return {
        user: state.User.user,
        admin: state.User.user,
        senders: meetYou.senders,
        receivers: meetYou.receivers,
        defaults: state.Users.defaults,
        userInfos: state.Users.infos
    }
};

///////////////////////
export default connect(mapStateToProps, null)(AdminSender);