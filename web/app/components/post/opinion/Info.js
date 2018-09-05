import React 			from 'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'
import { Editors } 		from '../avatars'

function getAbsoluteOffsetTop({ offsetTop, offsetParent }) {
  return offsetTop + (offsetParent && getAbsoluteOffsetTop(offsetParent));
}

const Info  = createReactClass({

	getInitialState() {
		return {
			indexMsg: 0,		//message to display
			isHidden: false,
			isMounted: false,
			showFlash: false,
		}
	},

	toggleInfo(e) {
		this.props.toggleInfo();
	},

	tick () {
		// if(this.state.secondsElapsed > 60){
		// 	this.setState({ isHidden: true, secondsElapsed: 0 });
		// 	// clearInterval(this.interval);
		// }
	    // this.setState((prevState) => ({
	    //   secondsElapsed: prevState.secondsElapsed + 1
	    // }));
	},

	displayMessage () {

	},

	closeMessage () {
		this.setState({showFlash: false})
	},

	handleScroll () {
		if (window.pageYOffset + window.innerHeight*0.85 > getAbsoluteOffsetTop(this.refs.el)) {
		  	this.setState({ isHidden: false, showFlash: true });
		  	this.componentWillUnmount();
		}
	},

	componentWillUnmount() {
		window.clearRequestTimeout(this.timeout);
		window.clearRequestInterval(this.interval);
		window.removeEventListener('scroll', this.handleScroll);
	},

	componentDidMount() {
		if (window.pageYOffset + window.innerHeight > getAbsoluteOffsetTop(this.refs.el)) {
			  	// this.setState({ isHidden: false, isMounted: true });
			  	console.log('return null')
			  	return;
		}
		this.setState({ isHidden: true, isMounted: true });
		this.timeout = window.requestTimeout(this.handleScroll, 100);
		this.interval = window.requestInterval(() => this.tick(), 1000);
		window.addEventListener('scroll', this.handleScroll);
	},

	componentWillUpdate(nextProps, nextState) {
		if(this.state.showFlash !== nextState.showFlash && nextState.showFlash) {
			this.timeout = window.requestTimeout(this.closeMessage, 8000);
		}
	},

	render() {
		const { info, post:{leftEditors, rightEditors, }, } = this.props,
			  { isHidden, isMounted, showFlash } = this.state
		let styl = {}, animation = 'opi-info-msg';
		if (isHidden) 
	        animation = 'opi-info-msg';
		else if(isMounted && showFlash)
	        animation = 'opi-info-msg show';
	    else if(isMounted && info)
	    	animation = 'opi-info-msg show'

		return(
			<div className="opi-info-ctnr" ref="el">
				<div className="opi-info-ctnr-a">
			    	<span className="opi-info-lk" onClick={this.toggleInfo}>
			    	</span>
			    	<div className="opi-info-msg-ctnr" >
			    		<div className={animation}>
					    	{!info && 
					    		<div className="opi-info-msg-dyn" >
							    	<span className="opi-info-lss-msg">
							    		post update
							    	</span>
							    </div>
							}						    
					    	{info && 
					    		<div className="opi-info-msg-stc">
						    		<div className="msg-stc-a">
						    			<div className="side-desc">side animator</div>
								    	{leftEditors.length > 0 && 
				                			<Editors
				                				side="left"
				                				imgHeight={30}
				                				editors={leftEditors} 
				                				post={this.props.post} 
				                				/>
				                		}
				                		{rightEditors.length > 0 && 
				                			<Editors 
				                				side="right"
				                				imgHeight={30}
				                				editors={rightEditors} 
				                				post={this.props.post} 
				                				/>
				                		}
							    	</div>
			    				</div>
						    }
				    	</div>
					</div>
	            </div>
	        </div>
		) 
	}
})

/////////
export default connect(state => ({
	user: state.User.user
}))(Info)