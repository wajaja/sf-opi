import React 					from 'react'
import { Link } 				from 'react-router-dom'

const NavLinks = (props) => {

	const { match, groups, q, tag } = props
	return (
		<div className="nav-mnu-dv setting">
			<div className="nav-mnu-dv-a">
				<div className="nav-mnu-ctnr">
					<div className={!tag === 'users' ? `nav-mnu-chld active` : `nav-mnu-chld`}>
						<div className="nav-mnu-chld-a">
							<Link 
								to={`${match.url}?q=${q}&tag=users`} 
								className="sh-nav-chld-lk"								>
								<span className="mnu-txt-ctnr">Users</span>
							</Link>
						</div>
					</div>
					<div className={!tag === 'posts' ? `nav-mnu-chld active` : `nav-mnu-chld`}>
						<div className="nav-mnu-chld-a">
							<Link 
								to={`${match.url}?q=${q}&tag=posts`}
								className="sh-nav-chld-lk"
								>
								<span className="txt-ctnr">Posts</span>
							</Link>
						</div>
					</div>
					<div className={!tag === 'groups' ? `nav-mnu-chld active` : `nav-mnu-chld`}>
						<div className="nav-mnu-chld-a">
							<Link 
								to={`${match.url}?q=${q}&tag=groups`}
								className="sh-nav-chld-lk"
								>
								<span className="txt-ctnr">Groups</span>
							</Link>
						</div>
					</div>
					<div className={!tag === 'places' ? `nav-mnu-chld active` : `nav-mnu-chld`}>
						<div className="nav-mnu-chld-a">
							<Link 
								to={`${match.url}?q=${q}&tag=places`}
								className="sh-nav-chld-lk"
								>
								<span className="txt-ctnr">Places</span>
							</Link>
						</div>
					</div>
					<div className={!tag ? `nav-mnu-chld active` : `nav-mnu-chld`}>
						<div className="nav-mnu-chld-a">
							<Link 
								to={`${match.url}?q=${q}&tag=all`} 
								className="sh-nav-chld-lk"
								>
								<span className="mnu-txt-ctnr">All</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NavLinks