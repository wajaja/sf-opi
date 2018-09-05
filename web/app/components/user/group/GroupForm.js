import React 			    from 'react'
import createReactClass     from 'create-react-class'
import { Field, reduxForm } from 'redux-form'
import { connect }          from 'react-redux'
import ReactDOM, 
       { findDOMNode }      from 'react-dom'
import axios                from 'axios'
import _                    from 'lodash'
import { MultiSelect }      from 'react-selectize';


const required = value => value ? undefined : 'Required',
maxLength   = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined,
maxLength15 = maxLength(15),
number      = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined,
minValue    = min => value => value && value < min ? `Must be at least ${min}` : undefined,
minValue18  = minValue(18),
email       = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined,
tooOld      = value => value && value > 65 ? 'You might be too old for this' : undefined,
aol         = value => value && /.+@aol\.com/.test(value) ? 'Really? You still use AOL for your email?' : undefined;

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
    <div className="inp-tgther">
        <label>{label}</label>
        <div className="inp-elm">
            <input {...input} placeholder='Group Name' type={type} className="grp-inp-nm" />
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    </div>
)

///////////////
const _GroupRecipients  = createReactClass({

    getInitialState() {
        // const self = this,
        // defaultRecipients = _.filter(this.props.users, function(user){
        //     return _.indexOf(self.props.defaultRecipients, user.username);
        // })
        // .map(function(user) {
        //     return {
        //         label: user.username, 
        //         firstname: user.firstname, 
        //         lastname:user.lastname, 
        //         value: user
        //     }
        // });
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
            var timeoutID = window.setTimeout(self.resetRecipients, 500);
            if(timeoutID && !this.state.timer) {
                window.clearTimeout(timeoutID);
                self.setState({timer: true});
            }
        }
    },

    render() {
        const self = this;
        const options = this.props.users.map(function(user) {
            return {label: user.username, firstname: user.firstname, lastname:user.lastname, value: user}
        });
        return (
                    <MultiSelect
                        autofocus={false}
                        //open={true}
                        ref = "groupRecipients"
                        className="selectized-dv"
                        placeholder = "add members"
                        options = {options}
                        values = {this.state.recipients}

                        maxValues={5}

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
                                    return  option.label.indexOf(search) > -1 || 
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
                            return  (
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
        )
    }
})


export const GroupRecipients = connect(state => ({
    users: state.Users.defaults  //connect recipient to reducer to get users as props
}))(_GroupRecipients);

/////////////
const GroupForm = (props) => {
    const { onSubmit, pristine, reset, submitting, updateRecipients } = props
    return (
        <form className="grp-form"  onSubmit={onSubmit}>
            <div className="grp-form-tp">
                <Field name="name" type="text"
                    component={renderField} label="Name"
                    validate={[ required, maxLength15 ]}
                    />
                <div className="epty-dv"></div>
                <div className="inp-tgther">
                    <label>Add Members</label>
                    <div className="inp-elm">
                        <GroupRecipients 
                            {...props}
                            updateRecipients={updateRecipients}
                             />
                    </div>
                </div>
            </div>
            <div className="grp-form-btm">
                <div className="grp-form-btm-lft">
                </div>
                <div className="grp-form-btm-rght">
                    <button 
                        type="submit" 
                        className="btn btn-primary create-grp"
                        disabled={submitting}
                        >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'GroupForm' // a unique identifier for this form
})(GroupForm)