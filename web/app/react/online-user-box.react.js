import React {Component} from 'react';

export default class OnlineUserBox extends Component {
	constructor (props) {
		super(props);
	}

	render() {
        return (
            <div data-usr-id={this.props.userid} data-username={this.props.username} data-firtname={this.props.firstname} data-lastname={this.props.lastname} className="oln-usr-dv">
                <img src={this.props.picture} className="oln-usr-pic" />
                <div className="oln-usr-nm-ctnr">
                    <a data-usr-id={this.props.userid} data-username={this.props.username} className="oln-usr-lk-nm" href={this.props.username}>
                        <span className="oln-usr-lk-frst">{this.props.firstname} </span> 
                        <span className="oln-usr-lk-lst">{this.props.lastname}</span>
                    </a>
                    <span className="oln-usr-lk-usrnm">{this.props.username}</span>
                </div>                
                <span className="oln-usr-state"></span>
            </div>
        );
    }
}