import React from 'react'
import createReactClass from 'create-react-class'

const MonthType  = createReactClass( {
	getInitialeState() {
		return {
			selectedValue : ""
		}
	},
	onChange(e) {
		this.setState({
			selectedValue : e.target.value;
		})
	},
	render() {
		return (
			<select className="form-control" onChange={this.onChange}>
				<option value="">month</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option>
			</select>
		)
	}
})

export default MonthType;