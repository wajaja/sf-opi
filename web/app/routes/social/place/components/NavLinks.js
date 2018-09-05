import React 					from 'react'
import { NavLink } 				from 'react-router-dom'

const NavLinks = (props) => {

	const { match, groups } = props
	return (
		<div className="nav-mnu-dv setting">
			<div className="nav-mnu-dv-a">
				<div className="nav-mnu-ctnr">
					<div className="nav-mnu-info-ctnr">
						<div className="nav-mnu-info-ctnr-a">
							<NavLink 
								to={`groups/new`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									background: '#f0f6f7',
									border: '1px solid #cfe0e3'
								}}
								>
								<span className="mnu-txt-ctnr">Create New Group</span>
							</NavLink>
						</div>
					</div>
					<div className="nav-mnu-h-ctnr">
						<div className="nav-mnu-h-ctnr-a">
							<NavLink 
								to={`groups/list`} 
								className="stt-nav-chld-lk"
								activeStyle={{
									    background: '#f0f6f7',
										border: '1px solid #cfe0e3'
								}}
								>
								<span className="txt-ctnr">All My Groups</span>
							</NavLink>
						</div>
					</div>
					{typeof groups === 'array' && groups.map(function(group, i) {
						return (
							<div key={i} className="nav-mnu-photos-ctnr">
								<div className="nav-mnu-photos-ctnr-a">
									<NavLink 
										to={`groups/${group.id}`} 
										className="stt-nav-chld-lk"
										activeStyle={{
											background: '#f0f6f7',
											border: '1px solid #cfe0e3'
										}}
										>
										<span className="txt-ctnr">{group.name}</span>
									</NavLink>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default NavLinks