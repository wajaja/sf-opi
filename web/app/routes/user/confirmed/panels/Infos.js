import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import axios                from 'axios'

import {  } 	from '../../../../components'
import { BASE_PATH }        from '../../../../config/api'
import { 
	User as UserActions,
	Exception as ExceptionActions, 
} 							from '../../../../actions'

import MyLoadable    from '../../../../components/MyLoadable'
const TextFieldGroup = MyLoadable({loader: () => import('../../../../components/user/commons/TextFieldGroup')})


const Infos  = createReactClass( {
	getInitialState() {
	 	return {
	 		city : '', 
	 		country: '', 
	 		school: '', 
	 		university: '', 
	 		phone: '',
	 		errors: {

	 		}
	 	}
	},

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	},

	ignore(e) {

	},

	saveToServer() {
		const self  = this,
        { dispatch, history } = this.props,
        { errors, city, country, school, university, phone } = this.state,
        data = {
        	aboutMe: {
        		school: school,
        		university: university
        	},
        	address: {
        		city: city,
        		country: country
        	},
        	contact: {
        		phone: phone
        	}
        };

        console.log('data information sended by btn')

        axios.post(`${BASE_PATH}/api/complete/infos`, data)
            .then(function (res) {
                // dispatch(UserActions.setProfilePic(res.data.webPath))
                history.push('/confirmed/relations', {state: 'relations'}) 
            }, function(err) {
                if(err.response) {
                    self.props.dispatch(
                        ExceptionActions.throwNewEception(true, err.response.data.message)
                    )            
                }
        	})
	},

	nextPage() {
		this.history.push('/confirmed/relations', {state: 'relations'})
	},

	componentDidMount() {

	},


	render() {

		const { errors, city, country, school, university, phone } = this.state;
		return(
			<div className="container">
                <div className="bd-cfmd-cont">
					<div className="pnl-infos-ctnr">
						<div className="db-cfmd-adr">
							<div className="db-cfmd-tp">
			                    <div className="wlc-nw-usr-dv">
			                        <div className="tp-lft-ctnr" style={{display: 'inline-block' }}>
			                            <span className="wlc-nw-usr-sp">Infos</span>
			                        </div>
			                        <div className="tp-rght-ctnr" style={{display: 'inline-block' }}>
			                            <span className="dfault-ico">
			                                <i className="fa fa-cog" aria-hidden="true"></i>
			                            </span>
			                            <div className="dfault-ctnr"></div>
			                        </div>
			                    </div>
			                </div>
							<div className="confirmedForm-ctnr">
								<div className="confirmed-ctnr-a"> 
									<div id="adr-area" className="adr-area">
										<div className="adr-area-a">
											<div className="adr-area-bd">
												<span className="inp-wrp">
													<TextFieldGroup 
						                                error={errors.city}
						                                onChange={this.onChange}
						                                value={city}
						                                field= "city"
						                                placeholder="city name"
						                                customClassName="info-city"
						                                />
												</span>
												<span className="inp-wrp">
													<TextFieldGroup 
						                                error={errors.country}
						                                onChange={this.onChange}
						                                value={country}
						                                field= "country"
						                                placeholder="country name"
						                                customClassName="info-country"
						                                />
												</span>
											</div>
										</div>
									</div>
									<div id="abt-area" className="abt-area">
										<div className="abt-area-a">
											<div className="abt-area-bd">
												<span className="inp-wrp">
													<TextFieldGroup 
						                                error={errors.school}
						                                onChange={this.onChange}
						                                value={school}
						                                field= "school"
						                                placeholder="school name"
						                                customClassName="info-sch"
						                                />
												</span>
												<span className="inp-wrp">
													<TextFieldGroup 
						                                error={errors.university}
						                                onChange={this.onChange}
						                                value={university}
						                                field= "university"
						                                placeholder="university name"
						                                customClassName="info-univ"
						                                />
												</span>
											</div>
										</div>
									</div>
									<div id="ct-area" className="ct-area">
										<div className="ct-area-a">
											<div className="ct-area-bd">
												<span className="inp-wrp">
													<TextFieldGroup 
						                                error={errors.phone}
						                                onChange={this.onChange}
						                                type="number"
						                                value={phone}
						                                field= "phone"
						                                placeholder="phone name"
						                                customClassName="info-phone"
						                                />
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="adr-area-bd">
								<div id="db-cfmd-ln" className="db-cfmd-ln">
			                        <div className="db-cfmd-ign-lk">
			                            <div className="ign-ctnr">
			                                <button 
			                                    onClick={this.next}
			                                    style={{outline: 'none'}}
			                                    className="btn btn-default cfmd-ign">Ignore</button>
			                            </div>
			                            <div className="ign-ctnr sve-pic-ctnr">
			                            	<button 
			                            		className="btn btn-primary cfrm_sv_pic" 
			                                    style={{outline: 'none'}}
			                            		id="cfrm_sv_pic" 
			                            		onClick={this.saveToServer}>
			                            		Save
			                            	</button>
			                            </div>
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


export default Infos 