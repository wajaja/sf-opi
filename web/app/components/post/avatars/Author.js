import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
import { UserLink }     from '../../../components'


const _Name  = createReactClass({
    shoulComponentUpdate(nextProps) {
        return (this.props.author !== nextProps.author)
    },

    render() {
        const { author, authors, className } = this.props,
        authorId    = author.id,
        authorObj   = authors.filter(function(author) {
                        for(var prop in author) {
                            return author[prop].id == authorId;
                        }
                    })[0],
        user        = typeof authorObj != 'undefined' ? authorObj[authorId] : author;
        return (
            <UserLink 
                to={`/${user.username}`} 
                className={className}
                username={user.username}
                > 
                <span className="author-frst">{user.firstname}</span>
                <span className="author-lst">{user.lastname}</span>
           </UserLink>
        )
    }
})
////
export const Name = connect(state =>({
    authors: state.Authors.authors,
}))(_Name)

////
/////
const _Photo  = createReactClass({

    shoulComponentUpdate(nextProps) {
        return (this.props.author !== nextProps.author)
    },

    commentAvatar() {
        return(
            <div className="com-div-profile-a" >
                <Link to={`/${author.username}`} className="com-profile-link-img">
                    <img 
                        className="com-profile-img" 
                        src={comment.author.profile_pic}  
                        id="user-profile"/>
                </Link>
            </div>
        )
    },

	render() {
        const self          = this,
        { author, authors } = this.props,
        authorId            = author.id,
        authorObj           = authors.filter(function(author) {
                                for(var prop in author) {
                                    return author[prop].id == authorId;
                                }
                            })[0],
        user                = typeof authorObj != 'undefined' ? authorObj[authorId] : author;
		return (
			<div className="dv-pic">
                <UserLink 
                    to={`/${user.username}`} 
                    className="aut-pic-lk" 
                    username={user.username}>
                    <img 
                        src={user.profile_pic} 
                        className="aut-pic" 
                        style={{height: self.props.imgHeight, width: self.props.imgHeight}} 
                        />
                </UserLink>
           </div>
		)
	}
})
export const Photo = connect(state => ({
    authors: state.Authors.authors
}))(_Photo)
