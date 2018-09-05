import React 			from  'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'


const ProfileHead = createReactClass({

	getInitialState() {
		return {

		}
	},

	componentDidMount() {

	},

	render() {
		return(
			<div className="in-top-a">
			    <div className="in-top-b">
			        <div className="in-top-content">
			            <div className="cov-a">
			                <div className="cov-b">
			                    <img alt="" className="cov_pic_show" src="{{asset (thisUser.coverPic.croppedPath|default("/images/favicon.ico"))}}" id=""/>
			                </div>
			            </div>
			            <div className="in-top-plus-a">
			                <div className="pro-pic-show">
			                    <img alt="" src="{{asset (thisUser.profilePic.croppedPath|default("/images/favicon.ico"))}}" className="in-top-plus-pic">
			                </div>
			                <div className="in-top-plus-rgt-ctnr">
			                    <div className="in-top-plus-rgt-ctnr-a">
			                        <div className="in-top-name">
			                            <span>{{thisUser.firstname}}</span>
			                            <span>{{thisUser.lastname}}</span>
			                        </div>
			                        <div className="in-top-sts-ctnr">
			                            <i className="fa fa-quote-left" aria-hidden="true"></i>
			                            <span className="sts-txt">
			                                '{{thisUser.status |default('default status text for user difhdiofd iopjfzrifjzr iogpjgreig ieopjgeàipeog gioje)àgi)ejtogketpog')}}'+
			                            </span>
			                            {% if app.user is same as (thisUser) %}
			                                <a href="" className="edt-status"><i className="fa fa-pencil" aria-hidden="true"></i></a>
			                            {% endif %}
			                        </div>
			                    </div>
			                    <div className="in-top-plus-plus">
			                        <div className="in-top-plus-plus-a">
			                        {% if app.user != thisUser %}
			                            <div className="spa-in-add-freind">
			                                <button className="link-add-freind btn btn-sm btn-default" data-username="{{thisUser.username}}" data-userid="{{thisUser.id}}">
			                                    <i className="fa fa-user-plus"></i>
			                                    <span>Add</span>
			                                </button>
			                            </div>
			                            <div className="spa-in-sd-message">
			                                <button className="btn-in-sd-message btn btn-sm btn-default">
			                                    <i className="fa fa-envelope"></i>
			                                    <span>Message</span>
			                                </button>
			                            </div>        
			                        {% endif %}
			                        </div>
			                    </div>
			                </div>
			            </div>
			        </div>
			    </div>
			</div>
		)
	}
})

export default ProfileHead