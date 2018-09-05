import React 					from 'react'
import { NavLink } 				from 'react-router-dom'

const NavLinks = (props) => {

	const { match, groups, q } = props
	return (
		<div className="nav-mnu-dv setting">
			<div className="nav-mnu-dv-a">
				<div className="nav-mnu-ctnr">
					<div className="nav-mnu-chld">
						<div className="nav-mnu-chld-a">
							<NavLink 
								to={`${match.url}?q=${q}&tag=users`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									background: '#f0f6f7',
									border: '1px solid #cfe0e3'
								}}
								>
								<span className="mnu-txt-ctnr">Users</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-chld">
						<div className="nav-mnu-chld-a">
							<NavLink 
								to={`${match.url}?q=${q}&tag=posts`}
								className="stt-nav-chld-lk"
								activeStyle={{
									    background: '#f0f6f7',
										border: '1px solid #cfe0e3'
								}}
								>
								<span className="txt-ctnr">Posts</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-chld">
						<div className="nav-mnu-chld-a">
							<NavLink 
								to={`${match.url}?q=${q}&tag=groups`}
								className="stt-nav-chld-lk"
								activeStyle={{
									    background: '#f0f6f7',
										border: '1px solid #cfe0e3'
								}}
								>
								<span className="txt-ctnr">Groups</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-chld">
						<div className="nav-mnu-chld-a">
							<NavLink 
								to={`${match.url}?q=${q}&tag=places`}
								className="stt-nav-chld-lk"
								activeStyle={{
									    background: '#f0f6f7',
										border: '1px solid #cfe0e3'
								}}
								>
								<span className="txt-ctnr">Places</span>
							</NavLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NavLinks