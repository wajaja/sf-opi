import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'

const SearchBox  = createReactClass({

    doSearch () {
        'use strict';
        this.props.doSearch(this.refs.searchInput.value);
    },

    render() {
        return (
            <div className="frm-select-hd">
                <div className="frm-select-hd-ttl">
                    <span className="frm-select-hd-ttl-sp">Right Contributors</span>
                </div>
                <div className="frm-select-ctnr">
                    <input type="text" ref="searchInput" placeholder="Search Name" className="edtor-rct-srh"  value={this.props.query} onChange={this.doSearch} onFocus={this.doSearch} />
                </div>
            </div>
        )            
    }
})

/////diplay the matched users lists
const DisplayList  = createReactClass( {

    addContributor(user) {
        this.props.addContributor(user);
    },

    render() {
        const self = this;      
        const userNodes = this.props.data.map(function(user, i) {
            return (
                <div key={i} className="pst-slct-usr-dv" onClick={self.addContributor.bind(self, user)}>
                    <img src={user.profilePic} className="pst-slct-usr-pic" />
                    <a className="pst-slct-usr-lk-nm">
                        <span>{user.firstname}</span><span>{user.lastname}</span>
                    </a>
                    <span className="pst-slct-usr-sp-usrnm">{user.username}</span>
                </div>
            )
        });

        return(
            <div className="pst-frm-select-bd">{userNodes}</div>
        );
    }
})

/////////////////
const RightEditorsBox  = createReactClass({

    getInitialState() {
        return {
            data:[],
            intervalDataUsers:false,
            query:'',
            filteredData: []
        }
    },

    componentDidMount() {        
        
    },

    getStorageData() {
        const  options_array = [];
    },

    doSearch(queryText) {
        //this.getStorageData();
        //var users = this.state.users;
        let queryResult=[];                 //get query result
        
        this.props.defaults.forEach(function(user){
            if (user.firstname.toLowerCase().indexOf(queryText)!=-1 || 
                user.lastname.toLowerCase().indexOf(queryText)!=-1 || 
                user.username.toLowerCase().indexOf(queryText)!=-1) {
                    queryResult.push(user);
                }
            
        });
 
        this.setState({
            query:queryText,
            filteredData: queryResult
        })
    },

    closeBox(e) {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.toggleEditor('');   //toggle to empty string
    },

    addContributor(user) {
        const { dispatch, getState } = this.props;

        if(this.props.editors.length == 2){
            console.log('allowed editors 2');
            return;
        }

        this.props.addRightEditor(user);

        const usersStr = this.props.editors.reduce(function(usernames, editor) {
            return usernames + ',' + editor.username
        }, '');
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextState;
    },
    
    render() {
        return (
            <div className="frm-contrib-ctnr-b">
                <SearchBox query={this.state.query} doSearch={this.doSearch}/>
                <DisplayList 
                    {...this.props} 
                    data={this.state.filteredData} 
                    addContributor={this.addContributor}
                    />
                <div className="pst-frm-select-btm">
                    <button className="pst-frm-select-fnsh-btn" onClick={this.closeBox}>close</button>
                </div>
            </div>
        );
    }
})

///////////////
export default connect(state => ({
    editors: state.PostForm.rightEditors,
    defaults: state.Users.defaults
}))(RightEditorsBox);