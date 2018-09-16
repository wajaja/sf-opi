import React 				from 'react'
import createReactClass		from 'create-react-class'
import { connect } 			from 'react-redux'
import ReactDOM, { findDOMNode } from 'react-dom'
import axios 				from 'axios'
import _ 					from 'lodash'
import { 
	MultiSelect 
} 							from 'react-selectize';

import InputType from './InputType'
import { API } from '../../../../config'
import '../../../../styles/react-selectize.scss'
import '../../../../styles/selectize.default.scss'

const SelectRecipient  = createReactClass({

	getInitialState() {
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

    componentDidUpdate(oldProps, oldState) {
    	const { dispatch } = this.props;
    	const self = this;
    	if((this.props.recipients != oldProps.recipients) && this.props.recipients.length == 0 ) {
    	}

    	if(this.state.recipients != oldState.recipients) {
    		this.props.updateRecipients(this.state.recipients);
    	}
    },

    shouldComponentUpdate(nextProps, nextState) {
    	return this.state !== nextState;
    },

	render() {
		const self = this;
		const options = this.props.users.map(function(user) {
        	return {label: user.username, firstname: user.firstname, lastname:user.lastname, value: user}
        });
		return (
			<div className="pst-select-recip pst-select-hide">
				<div className="pst-select-recip-lft">
					<div className="txt">with</div>
				</div>
                <div className="pst-select-recip-a">
                	<MultiSelect
                		autofocus={true}
                		//open={true}
		                ref = "SelectRecipient"
		                className="selectized-dv"
		                placeholder = "add follower or following"
		                options = {options}
		                values = {this.state.recipients}

		                maxValues={5}

		                // restoreOnBackspace :: Item -> String
			            restoreOnBackspace = {function(item) {
			                return item.label;
			            }}

		                // onValueChange :: Item -> (a -> Void) -> void
		                onValuesChange = {function(recipients){
		                    self.setState({recipients: recipients});
		                }}

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
	resseting: state.PostForm.resseting,
	recipients: state.PostForm.recipients,
	users: state.Users.defaults  //connect recipient to friendsfollowers reducer to get users as props
}))(SelectRecipient);