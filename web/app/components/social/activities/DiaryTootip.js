import React 						from 'react'
import createReactClass 			from 'create-react-class'
import { connect } 					from 'react-redux'
import DiaryForm					from './DiaryForm'
import DiaryPost					from './DiaryPost'
import { NotifContentBox } 			from '../../../components'
import _ 							from 'lodash'
import { Scrollbars } 				from 'react-custom-scrollbars';

const moment = require('moment');

const DiaryTootip  = createReactClass({

	getInitialState() {
		return {
			posts: [],
			notifs: [],
			diaries: [],
			loading: false,
		}
	},

	pad(val) { 
		return ("0" + (val)).slice(-2)
	},

	onClose(e) {
		this.props.closeTootip()
	},

	updateData(props) {
		const { notifs, posts, diaries, year, month, day, forUserId, user } = props,

		dateStr 	= year + '-' + this.pad(month) + '-' + this.pad(day),
		_notifs = 	_.filter(notifs, function(n) {
			return	_.startsWith(n.date, dateStr) && 
	          		n.userId === forUserId && 
					n.id
	    }),

	    _posts = 	_.filter(posts, function(n) {
			return	_.startsWith(n.date, dateStr) && 
	          		n.userId === forUserId && 
					n.id
	    }),

	    _diaries = 	_.filter(diaries, function(n) {
			return	_.startsWith(n.date, dateStr) && 
	          		n.userId === forUserId && 
					n.id
	    })

		this.setState({
			posts  : _posts,
			notifs : _notifs,
			diaries: _diaries
		})
	},

	componentWillMount() {

	},

	componentDidMount() {
		const { notifs, year, month, day } = this.props;
		this.updateData(this.props);
	},

	componentWillReceiveProps(nextProps) {
		if(this.props.notifs !== nextProps.notifs) {
			this.updateData(nextProps);
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		return this.state !== nextState;
	},

	render() {
		const { month, day, year, dispatch, hasOwnDiary, diaries } 	= this.props,
		{ notifs, loading } 		= this.state,
		dateStr 		= year + '-' + month + '-' + day,
		localLocale 	= moment(dateStr, 'YYYY-MM-DD');
		localLocale.locale(window.possibleLocale); // set this instance to use French
		return(
			<Scrollbars style={{ height: 400 }}>
				<div className="tootip-clk-stor-dv">
					<div className="tootip-clk-stor-hdr">
						<div className="tootip-clk-stor-hdr-a">
							<span className="tootip-clk-stor-dte">{localLocale.format("dddd, MMMM Do YYYY")}</span>
							<span className="tootip-clk-stor-cls" onClick={this.onClose}></span>
						</div>
					</div>

					{!loading && 
						<div className="tootip-clk-stor-bd">
							<div className="q-stor-gph-diary">
							   	{hasOwnDiary && 
							   		<div className="q-stor-gph-form">
							   			<DiaryForm 
							   				dateStr={dateStr} 
							   				dispatch={dispatch}
							   				/>
							   		</div>
							   	}
						   		<div className="q-stor-gph-own-d">
						   			<div className="q-stor-gph-dta-notif">
								   		{notifs.map((note, i) => {
								   			return <NotifContentBox
								   						key={i}
										   				ref="diary"
								   						data={note}
										   				dateStrs={dateStr}
										   				/>
								   		})}
									</div>
						   		</div>
						   		<div className="q-stor-gph-other-d">
						   			{diaries.map((diary, i) => {
						   				return <DiaryPost
						   							dateStr={dateStr} />
						   			})}
						   		</div>
							</div>
						</div>
					}
					{loading &&
						<div className="di-loading-ctnr">
							<div className="loading">loading...</div>
						</div>
					}
				</div>
			</Scrollbars>
		)
	}
})

export default connect(state => ({
	diaries: state.Diary.diaries,
	notifs: state.Diary.notifs,
	posts: state.Diary.posts,
}))(DiaryTootip)