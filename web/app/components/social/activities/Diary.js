import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import DiaryBox 			from './DiaryBox'
import DiaryTootip 			from './DiaryTootip'
import { 
	Diary as DiaryActions 
} 							from '../../../actions'

var moment = require('moment');

const Diary  = createReactClass({

	getInitialState() {

		const utcNow = moment.utc(),
			now 	 = moment();

		return {
			_day			: null, 	//selected day
			_year 			: null, 	//selected year
			_month 			: null, 	//selected month
			dayOfMonth 		: moment().date(),
			year 			: moment().year(),
			month 			: moment().month(),
			utcDayOfMonth 	: moment.utc().date(),
			utcMonth  		: moment.utc().month(),
			timezoneDiff 	: moment.utc().diff(moment()), //get timezone_diff
			daysInMonth 	: moment().daysInMonth(),
			diaryTootip 	: false,
		}
	},

	lastMonth(e) {
		const { month, year } = this.state;
		if(month === 0) {
			this.setState({
				year: (year - 1),
				month: 11
			})
		}  else { 
			this.setState({ month: (month - 1 ) })
		}
	},

	nextMonth(e) {
		const { month } = this.state;

		if(month === 11) {
			const last = moment().month(month + 1 ) 
			this.setState({
				year: (year + 1),
				month: 0
			})
		} else {
			this.setState({ month: (month + 1 ) })
		}
	},

	setTooltipDate(year, month, day) {
		this.setState({
			_day: day,
			_year: year,
			_month: month,
		})
	},

	closeTootip () {
		this.setState({ diaryTootip: false })
	},

	openTootip () {
		this.setState({diaryTootip: true })
	},

	onBoxClick(year, month, day) {
		//check valid date
		const { dispatch, forUserId } 	= this.props,
		dateStr 	= year + '-' + month + '-' + day	
		console.log(moment(dateStr, 'YYYY-MM-DD', true).isValid())	
		// if(!moment(dateStr, 'YYYY-MM-DD', true).isValid()) 
		// 	return
		dispatch(DiaryActions.loadDay(forUserId, year, month, day))
		this.setTooltipDate(year, month, day)
		this.openTootip()
	},

	componentWillMount() {
		// moment().weekday(); // Number
	},

	loadMonthData(forUserId, year, month) {
		const { dispatch } 	= this.props,
		tMonth = month + 1;
		dispatch(DiaryActions.loadMonth(forUserId, year, tMonth))
	},

	componentDidMount() {
		const { year, month } 	= this.state,
		{ forUserId } 			= this.props
		this.loadMonthData(forUserId, year, month);
	},

	componentWillUpdate(nextProps, nextState) {
		if(this.state.month !== nextState.month) {
			const { year, month } 	= nextState,
			{ forUserId } 			= nextProps
			this.loadMonthData(forUserId, year, month);
		}
	},

	componentWillReceiveProps(nextProps) {

	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.state.activeDay !== nextState.activeDay ||
			  this.state.diaryTootip !== nextState.diaryTootip)
	},


	pad(month) { return ("0" + (month)).slice(-2) },

	render() {

		const { dispatch, hasOwnDiary } 				= this.props,
		{ daysInMonth, dayOfMonth, month, 
		year, utcDayOfMonth, utcMonth, _day, _year, _month,
		activeDay, diaryTootip, timezoneDiff } 					  = this.state,

		time 			= moment(`${this.pad((month + 1))}-${this.pad(dayOfMonth)}-${year}`, "MM-DD-YYYY"),
		start 			= moment(time).startOf('month').startOf('week').date(),
		end 			= moment(time).endOf('month').endOf('week').date(),
		monthName 		= moment.months(month);

		var shiftDays = 1;  	//shift day from lastMonth in view

		if(start > 20) {
			var daysInLastMonth = moment(`${year}-${this.pad(month)}`, "YYYY-MM").daysInMonth();
			shiftDays 			= daysInLastMonth - start;
		}

		return(
			<div className="diary-ctnr">
				<div className="q-stor-gph-dv">
					{diaryTootip &&  
						<div className="tootip-stor-ctnr">
							<DiaryTootip 
								{...this.props}
								day={_day}
								year={_year}
								month={_month}
								hasOwnDiary={hasOwnDiary}
								className="q-stor-gph-tootip" 
								timezoneDiff={timezoneDiff}
								closeTootip={this.closeTootip}
								/>
						</div>
					}
					<div className="q-stor-gph-lst">
						<span className="go-lst-yr" onClick={this.lastMonth}>go last</span>
					</div>
					<div  className="q-stor-gph-dv-ct">
						<div className="q-stor-gph-dv-week-day">
							{[...Array(7)].map((d, i) => {
								return (
									<div key={i} className="dy-name">{moment.weekdaysShort(i)}</div>
								)
							})}
						</div>
						<div className="q-stor-gph-dv-mth">
							{[...Array(35)].map((day, i) => {
								return (
									<DiaryBox 
										key={i}  
										year={year}
										month={(month + 1)}
										dispatch={dispatch}
										className="q-stor-gph-lk" 
										timezoneDiff={timezoneDiff}
										dayOfMonth={(i - shiftDays + 1)}
										onBoxClick={this.onBoxClick}
										/>
								)
							})}
						</div>

					</div>
					<div className="q-stor-gph-nxt">
						<span className="go-nxt-yr" onClick={this.nextMonth}>go next</span>
					</div>
				</div>
				<span className="q-stor-gph-mth-txt">{monthName}</span>
				<span className="q-stor-gph-year-txt">{year}</span>
			</div>                              
		)
	}
})
/////
/////
export default connect(state => ({
	user: state.User.user
}))(Diary)