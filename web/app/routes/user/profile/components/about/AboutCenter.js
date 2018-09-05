import React 			from 'react'
import createReactClass from 'create-react-class'
import { BuildContent, } from '../../../../../components'

const AboutCenter 	= createReactClass({

	getInitialState(){
		return {

		}
	},

	render() {
		const { profile, user, about } = this.props
		return(
			<div className="abt-cter-ctnr">
				<div className="nm-ctnr">
                    <div className="nm-ctnr-lft">
                        <div className="nm-ctnr-lft-a">
                            names
                        </div>
                    </div>
                    <div className="nm-ctnr-rght">
                        <div className="nm-ctnr-rght-a">
                            <div className="nm-ctnr-opt">
                                <div className="nm-ky">firstname</div>
                                <div className="nm-val">{profile.firstname}</div>
                            </div>
                            <div className="nm-ctnr-opt">
                                <div className="nm-ky">nickname</div>
                                <div className="nm-val">
                                    {profile.nickname ? `${profile.nickname}` : `_`}
                                </div>
                            </div>
                            <div className="nm-ctnr-opt">
                                <div className="nm-ky">lastname</div>
                                <div className="nm-val">{profile.lastname}</div>
                            </div>
                        </div>
                    </div>
                </div>
				<div className="adr-ctnr-tp">
                    <div className="adr-ctnr-lft">
                        <div className="adr-ctnr-lft-a">
                            Adress
                        </div>
                    </div>
                    <div className="adr-ctnr-rght">
                        {!!about && 
                            <div className="adr-ctnr-rght-a">
                                <div className="adr-ctnr-opt">
                                    <div className="adr-ky">country</div>
                                    <div className="adr-val">
                                        {about.adress && about.adress.country ? `${about.adress.country}` : `_`}
                                    </div>
                                </div>
                                <div className="adr-ctnr-opt">
                                    <div className="adr-ky">city</div>
                                    <div className="adr-val">
                                        {about.adress && about.adress.city ? `${about.adress.city}` : `_`}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="stt-ctnr">
                    <div className="stt-ctnr-lft">
                        <div className="stt-ctnr-lft-ttl">
                            status
                        </div>
                    </div>
                    {!!about && 
                        <div className="stt-ctnr-rght">
                            <div className="stt-ctnr-rght-bdy">
                                <BuildContent
                                    contentFor="status"
                                    content={this.props.about.status}
                                    />
                            </div>
                        </div>
                    }
                </div>
			</div>
		)
	}
})

export default AboutCenter