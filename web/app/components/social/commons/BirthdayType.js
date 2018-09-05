import React from 'react'
import createReactClass from 'create-react-class'
import YearType from './year-type';
import MonthType from './month-type';
import DayType from './day-type';

const BirthdayType  = createReactClass( {

	getInitialState() {
		return { selectedValue : "" }
	},

	onChange(e) {
		this.setState({
			selectedValue : e.target.value;
		})
	},

	render() {
		return (
			<select className="form-control" onChange={this.onChange}>
				<option value="">day</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option>
			</select>
		)
	}
})
///
export default BirthdayType;