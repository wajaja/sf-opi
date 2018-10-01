import React            from 'react'
import { connect }      from 'react-redux'
import { 
    Link, NavLink 
}                       from 'react-router-dom'
                        // <NavLink 
                        //     to={`${match.url}?sort=all`} 
                        //     className="tri-note-lk"
                        //     activeStyle={{
                        //             background: '#f0f6f7',
                        //             border: '1px solid #cfe0e3'
                        //     }}
                        //     >
                        //     <span className="txt-ctnr">all</span>
                        // </NavLink>

const NavLinks  = (props) => {
    const { q, match, tag } = props
        
    return (
        <div className="tri-note-dv">
            <div className="tri-note-ctnr">
                <div className="tri-note-lk-ctnr">
                    <div className="tri-note-h-ctnr-a">
                    </div>
                </div>
                <div className="tri-note-lk-ctnr">
                    <div className="tri-note-info-ctnr-a">
                        
                    </div>
                </div>
                <div className="tri-note-lk-ctnr">
                    <div className="tri-note-info-ctnr-a">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavLinks