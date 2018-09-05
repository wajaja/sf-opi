import React 					from 'react'
import createReactClass 		from 'create-react-class'
import { connect } 				from 'react-redux'
import { findDOMNode }			from 'react-dom'
import Immutable, 
	{ List, Map, Set, fromJS }  from 'immutable'
import { FormattedMessage, 
		FormattedPlural, 
		FormattedNumber, 
		FormattedRelative 
} 								from 'react-intl';

const DiaryBox  = createReactClass({

	getInitialState() {
		return {
			active: false,
			hover: false,
			active: false,
			nbPosts  : 0,
			nbNotifs : 0,
			nbDiaries: 0,
			title: "my note",
		}
	},

	pad(day) { 
		return ("0" + (day)).slice(-2) 
	},


	handleClick(e) {
		e.preventDefault();
		const { dayOfMonth, year, utcDay, month, utcMonth }  = this.props;
		this.props.onBoxClick(year, month, this.pad(dayOfMonth))
	},

	updateState () {
		const { notifsInfos, postsInfos, diariesInfos, 
			year, month, dayOfMonth } 					= this.props,

		dateStr 	= year + '-' + month + '-' + dayOfMonth,
		nbNotifs 	= notifsInfos.filter((n, i) => {
            for(var prop in n) {
                return n[prop]  === dateStr
            }
        }).length

		nbPosts 	= postsInfos.filter((p, i) => {
			for(var prop in p) {
				return n[prop] === dateStr
			}
		}).length,

		nbDiaries 	= diariesInfos.filter((d, i) => {
			for(var prop in p) {
				return n[prop] === dateStr
			}
		}).length;

		this.setState({
			nbPosts  : nbPosts,
			nbNotifs : nbNotifs,
			nbDiaries: nbDiaries
		})
	},

	onMouseOver(e) {
		this.setState({
			hover: true,
		})
	},

	onMouseOut(e) {
		this.setState({
			hover: false,
		})
	},

	componentWillMount() {
		//this.updateState()
	},

	componentDidMount() {
		//this.updateState()
	},

	componentWillReceiveProps(nextProps) {
		if(this.props.diary !== nextProps.diary){
			//this.updateState()
		}
	},

	render() {
		const { diary, dayOfMonth, month, timezoneDiff, year } 	= this.props,
		{ info, hover, detail, title } 							= this.state
		return(
			<span className="q-stor-gph-lk">
				<a href="#" className="q-stor-gph-lk-a"
					onClick={this.handleClick} 
					onMouseOver={this.onMouseOver} 
					onMouseOut={this.onMouseOut}></a>
				{hover && 
					<span className="tootip-hver-stor">
						
					</span>
				}
			</span>

		)
	}
})
/////
/////
export default connect(state => ({
	postsInfos: state.Diary.postsInfos,
	notifsInfos: state.Diary.notifsInfos,
	diariesInfos: state.Diary.diariesInfos,
}))(DiaryBox);