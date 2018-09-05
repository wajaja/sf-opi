import React                from 'react'
import createReactClass     from 'create-react-class'
import { connect }          from 'react-redux'
import { Link } from 'react-router-dom'

export class Name  extends React.PureComponent{
    render() {
        const { user, className } = this.props        
        return (
            <Link to={`/${user.username}`} className={className}> 
                <span 
                    style={{
                        marginRight : '5px' 
                    }}>
                    {user.firstname}
                </span>
                <span 
                    style={{
                        textTransform: 'capitalize',
                        display: 'inline-block'
                    }}>
                    {user.lastname}
                </span>
           </Link>
        )
    }
}

/////////////////
export class Photo extends React.PureComponent{

    // commentAvatar() {
    //     return(
    //         <div className="com-div-profile-a" >
    //             <Link to={`/${user.username}`} className="com-profile-link-img">
    //                 <img className="com-profile-img" src={comment.user.profilePic}  id="user-profile"/>
    //             </Link>
    //         </div>
    //     )
    // },

	render() {
        const self  = this,
        { user, className, imgHeight, imageStyle }    = this.props,
        style = typeof imageStyle === 'object' ? imageStyle 
                            : { height: imgHeight, width: imgHeight}
		return (
			<div className={className}>
                <Link to={`/${user.username}`} >
                   <img 
                        src={user.profilePic} 
                        className="user-pic" 
                        style={style} 
                        />
                </Link>
           </div>
		)
	}
}