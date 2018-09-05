import React 				from 'react'

class RecordTimer extends React.PureComponent{

	constructor(props) {
		super(props);
		this.state = {
	        // This is called before our render function. The object that is 
	        // returned is assigned to this.state, so we can use it later.
	        elapsed: 0
	    }
	}

    componentDidMount(){
        // componentDidMount is called by react when the component 
        // has been rendered on the page. We can set the interval here:
        this.timer = setInterval(this.tick, 50);
    }

    componentWillUnmount(){
        // This method is called immediately before the component is removed
        // from the page and destroyed. We can clear the interval here:
        clearInterval(this.timer);
    }

    tick(){
        // This function is called every 50 ms. It updates the 
        // elapsed counter. Calling setState causes the component to be re-rendered
        this.setState({elapsed: new Date() - this.props.start});
    }

    render() {
        // Calculate elapsed to tenth of a second:
        // This will give a number with one digit after the decimal dot (xx.x):
        // Although we return an entire <p> element, react will smartly update
        // only the changed parts, which contain the seconds variable.
        let elapsed = Math.round(this.state.elapsed / 100),
        s 	 = elapsed % 60, 
        m 	 = Math.floor(elapsed / 60),
        mins = (m < 10) ? "00 : 0"+m : "00 : "+m,
        secs = (s < 10) ? " :0"+s : " :"+s;

        return <b>{mins}{secs}</b>;
    }
}

RecordTimer.defaultProps = {
	start: Date.now()
};

export default RecordTimer;