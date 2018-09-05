import React 				from 'react'
import createReactClass 	from 'create-react-class'
import ReactDOM 				from 'react-dom'
import { connect, Provider } 	from 'react-redux'
import { Link, Router } 		from 'react-router-dom'

import '../../styles/post/modal.scss'

const Modal  = createReactClass({

	componentWillMount() {

	},

	componentDidMount() {
		
	},

	componentDidUpdate(prevProps) {
		if(this.props != prevProps) {
		}
	},

	componentWillUnmount() {
		
	},

	_beforeOpen() {
		
	},

	_afterOpen() {

	},

	_beforeClose () {

	},

	_afterClose () {

	},
 
	_render() {
		
	},

	render() {
		return (
			<div className={this.props.className}>
				{this.props.children}
			</div>
		)
	}
})

export default connect(state => ({
	isRequesting: state.Shares.isRequesting,
	sharedPost: state.Shares.sharedPost
}))(Modal);