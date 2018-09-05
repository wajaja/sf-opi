import React 				from 'react'
import createReactClass		from 'create-react-class'
import { connect } 			from 'react-redux'
import ReactDOM, { findDOMNode } from 'react-dom'
import axios 				from 'axios'
import _ 					from 'lodash'
import { MultiSelect } 		from 'react-selectize';
import { API } from '../../config'

const MessageRecipients  = createReactClass({

	getInitialState() {
		const self = this,
		defaultRecipients = _.filter(this.props.users, function(user){
			return _.indexOf(self.props.defaultRecipients, user.username);
		})
		.map(function(user) {
        	return {
        		label: user.username, 
        		firstname: user.firstname, 
        		lastname:user.lastname, 
        		value: user
        	}
        });
		return {
			timer : true,
			users: [],
			recipients: [],
			errors: {}
		}		
	},	

	resetRecipients () {
		// this.setState({recipients: [], timer: false})
	},

	componentDidMount() {

	},

	// component-will-mount :: a -> Void
    componentWillMount() {
        const self = this;
		// axios.get(`${API.BASE_PATH}/api/ff/users`)
		// 	 .then(function(res){
		// 	 	const data = res.data.map(function(user){
		// 	 		return Object.assign({}, {
		// 	 			id: user.id,
		// 	 			username: user.username,
		// 	 			lastname: user.lastname,
		// 	 			firstname: user.firstname,
		// 	 			profilePic: user.profilePic
		// 	 		})
		// 	 	})
		// 	 	self.setState({users: data})
		// 	 }, 
		// 	 function(err) {
		// 	 	console.log('error happens')
		// 	 })
    },

    updateRecipients(recipients) {
        const usernames = recipients.reduce((txt, r) => { return txt + r.label + ','}, '')
        this.setState({recipients: recipients});
    	this.props.updateRecipients(usernames);
    },

    componentDidUpdate(oldProps, oldState) {
    	const { dispatch } = this.props;
    	const self = this;
    	if((this.props.recipients != oldProps.recipients) && this.props.recipients.length == 0 ) {
    	}
    },

    shouldComponentUpdate(nextProps, nextState) {
    	return this.props.recipients_error !== nextProps.recipients_error ||
    		this.state !== nextState
    },

	render() {
		const self = this,
		error     = this.props.recipients_error,
		options = this.props.users.map(function(user) {
        	return {label: user.username, firstname: user.firstname, lastname:user.lastname, value: user}
        });
		return (
			<div 
				className="thread msg-select-recip" 
				style={{
					padding: "0 0px",
					borderBottom: error ? "1px solid red" : "1px solid #ecedf2"
				}}
				>
                <div className="msg-select-recip-a">
                	<MultiSelect
                		autofocus={false}
                		//open={true}
		                ref = "MessageRecipients"
		                className="selectized-dv"
		                placeholder = "add follower or following"
		                options = {options}
		                values = {this.state.recipients}

		                maxValues={1}

		                // restoreOnBackspace :: Item -> String
			            restoreOnBackspace = {function(item) {
			                return item.label;
			            }}

		                // onValueChange :: Item -> (a -> Void) -> void
		                onValuesChange = {self.updateRecipients}

		                renderToggleButton = {function(){ return false}}

		                onBlur={function(){
		                	return {
		                		open: true
		                	}
		                }}

		                // filterOptions :: [Item] -> [Item] -> String -> [Item]
			            filterOptions = {function(options, values, search){
		                    return _.chain(options)
		                        .filter(function(option){
		                            return 	option.label.indexOf(search) > -1 || 
		                            		option.firstname.indexOf(search) > -1 ||
		                            		option.lastname.indexOf(search) > -1;
		                        })
		                        .reject(function(option) {
		                            return self.state.recipients.map(function(recipient){
		                                return recipient.label
		                            }).indexOf(option.label) > -1
		                        })
		                        //.first(10)
		                        .value();
			            }}

		                // uid :: (Eq e) => Item -> e
			            uid = {function(item){
			                return item.label;
			            }}

		                // renderOption :: Int -> Item -> ReactElement
			            renderOption = {function(item, i) {
			                return (
			                	<div key={i} className="selec-sugg">
                              		<img src={item.value.profilePic} className="selec-sugg-pic" />
                                  	<span className="selec-sugg-label">
                                        <span className="selec-sugg-name">{item.firstname} {item.lastname}</span>
                                        <span className="selec-sugg-usrnm">{item.label}</span>
                                  	</span>
                          		</div>
                          	)
			            }}

			            // renderValue :: Int -> Item -> ReactElement
			            renderValue = {function(item, i) {
			                return 	(
			                	<div key={i} className ="selec-field">				                    
	                                <span className="selec-name">{item.firstname} {item.lastname}</span>
	                                <a href="" className="remove-select" onClick = {function(e) {
	                                	e.preventDefault();                            	
				                        self.setState({
				                            recipients: _.reject(self.state.recipients, function(recipient){
				                                return recipient.label == item.label;
				                            })
				                        })
				                    }}>x</a>
				                    <br/>
			                	</div>
			                )
			            }}

		                // renderNoResultsFound
		                renderNoResultsFound = {function() {
		                    return 
		                    	<div className = "selectize-no-users-found">
			                        {!!self.req ? "" : "add users to select"}
			                    </div>
		                }}
		            />
                </div>
            </div>
		)
	}
})


export default connect(state => ({
	users: state.Users.defaults  //connect recipient to reducer to get users as props
}))(MessageRecipients);