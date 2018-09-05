import React                from 'react'
import { connect }          from 'react-redux'
import Phone                from 'react-phone-number-input'
import createClassReact     from 'create-react-class'

// import 'react-phone-number-input/rrui.css'
import 'react-responsive-ui/style.css'
import 'react-phone-number-input/style.css'

const PhoneForm = createClassReact({

    getInitialState() {
        return {
            value: '',
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        if(this.state.value)
            this.props.handleSubmit(this.state.value);
    },

    render() {
        const { submitting } = this.props
        return (
            <form 
                onSubmit={this.handleSubmit}
                className="ph-form">
                <div className="phone-frm-bdy">
                    <Phone
                        value={ this.state.value }
                        placeholder="Enter phone number"
                        onChange={ value => this.setState({ value }) } />
                </div>
                <div className="phone-frm-foo">
                    <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
                        Submit
                    </button>
                </div>
            </form>
        )
    }
})
////////
export default connect(state=> ({
    
}))(PhoneForm)