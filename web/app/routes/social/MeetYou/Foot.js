import React        from 'react'
import { Link }     from 'react-router-dom'

const Foot = ({}) => {
    return (
        <div className="meet-foot">
            <div className="foo">
                <div className="foo-a">
                    <div className="foo-lft">
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
                    <div className="foo-rght">
                        <div className="foo-opt">
                            <a href="https://pass.getopinion.com">
                                <div className="pass-ici"></div>
                                <div className="txt">Pass</div>
                            </a>
                        </div>
                        <div className="foo-opt">
                            <Link to="/mobile">For mobile</Link>
                        </div>
                        <div className="foo-opt">
                            @copyright . 2018
                        </div>
                        <div className="foo-opt">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Foot
