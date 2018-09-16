import React 			from 'react'
import createReactClass from 'create-react-class'

const Foot  = createReactClass( {

	componentDidMount() {
		
	},

	render() {
		return(
			<div className="o-foot-ab">
				<div className="o-foot-ab-cont">
					<div className="foo-opt">
                        <Link to="/settings">Setting</Link>
                    </div>
					<div className="foo-opt">
                        <Link to="/about">À propos d'opinion</Link>
                    </div>
                    <div className="foo-opt">
                        <Link to="/privacy">Confidentialité</Link>
                    </div>
                    <div className="foo-opt">
                        <Link to="/condition">Conditions d'utilisation</Link>
                    </div>
                    <div className="foo-opt">
                        <Link to="/help">Aide</Link>
                    </div>
				</div>
			</div>
		)
	}
})

export default Foot;