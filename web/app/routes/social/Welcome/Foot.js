import React        from 'react'
import { Link }     from 'react-router-dom'

const Foot = ({}) => {
    return (
        <div className="foo">
            <div className="foo-a">
                <div className="foo-lft">
                    <div className="foo-opt">
                        <Link to="/about">À propos de la Traduction</Link>
                    </div>
                    <div className="foo-opt">
                        <Link to="/privacy">Confidentialité et conditions d'utilisation</Link>
                    </div>
                </div>
                <div className="foo-rght">
                    <div className="foo-opt">
                        <Link to="/help">Aide</Link>
                    </div>
                    <div className="foo-opt">
                        @copyright . 2018
                    </div>
                    <div className="foo-opt">
                        {typeof window !== 'undefined' &&
                            <div className="foo-opt-sh">
                                <div className="clss-network">
                                    
                                </div>
                                <div className="clss-network">
                                    
                                </div>
                                <div className="clss-network">
                                    
                                </div>
                                <div className="clss-network">
                                    
                                </div>
                                <div className="clss-network">

                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Foot
