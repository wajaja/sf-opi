import React 					from 'react'
import { NavLink } 				from 'react-router-dom'

const NavLinks = (props) => {

	const { match } = props
	return (
		<div className="nav-mnu-dv setting">
			<div className="nav-mnu-dv-a">
				<div className="nav-mnu-ctnr">
					<div className="nav-mnu-h-ctnr">
						<div className="nav-mnu-h-ctnr-a">
							<NavLink 
								to={`${match.url}?tag=general`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									    background: '#f0f6f7',
										border: '1px solid #cfe0e3'
								}}
								>
								
								<span className="txt-ctnr">General</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-info-ctnr">
						<div className="nav-mnu-info-ctnr-a">
							<NavLink 
								to={`${match.url}?tag=adress`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									background: '#f0f6f7',
									border: '1px solid #cfe0e3'
								}}
								>
								
								<span className="txt-ctnr">Adress</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-photos-ctnr">
						<div className="nav-mnu-photos-ctnr-a">
							<NavLink 
								to={`${match.url}?tag=contact`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									background: '#f0f6f7',
									border: '1px solid #cfe0e3'
								}}
								>
								
								<span className="txt-ctnr">Contact</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-frds-ctnr">
						<div className="nav-mnu-frds-ctnr-a">
							<NavLink 
								to={`${match.url}?tag=notification`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									background: '#f0f6f7',
									border: '1px solid #cfe0e3'
								}}
								>
								<span className="txt-ctnr">Notifications</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-op-ctnr">
						<div className="nav-mnu-op-ctnr-a">
							<NavLink 
								to={`${match.url}?tag=security`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									background: '#f0f6f7',
									border: '1px solid #cfe0e3'
								}}
								>
								
								<span className="txt-ctnr">Security</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-op-ctnr" style={{display: 'none'}}>
						<div className="nav-mnu-op-ctnr-a">
							<NavLink 
								to={`${match.url}?tag=aboutme`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									background: '#f0f6f7',
									border: '1px solid #cfe0e3'
								}}
								>
								
								<span className="txt-ctnr">About Me</span>
							</NavLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NavLinks