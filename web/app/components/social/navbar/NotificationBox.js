import React                    from 'react'
import createReactClass         from 'create-react-class'
import { connect }              from 'react-redux'
import { bindActionCreators }   from 'redux'
import { Link }                 from 'react-router-dom'
import onClickOutside           from 'react-onclickoutside'
import { 
    SideToAuthor, SideToUser,
    CommentUserPhotoToAuthor,
    CommentUserPostToAuthor,
    SideCommentFromAuthor,
    SideCommentToAuthor,
    CommentAuthorPhoto,
    SideCommentToUser,
    CommentAuthorPost,
    CommentUserPhoto,
    CommentUserPost,
    OpinionCreated,
    AllieCreated,
    RateAuthorPost,
    LegalAuthorPost,
    ReplyUserComment,
    ReplyUserToAuthor,
    LegalUserToAuthor,
    ReplyAuthorComment,
    OpinionAllieCreated,
    RateUserPostToAuthor,
    LikeUserToAuthor,
    LegalUserPost, RateUserPost,
    LikeUserPost, LikeAuthorPost,

}                               from './NotifMessages'

import {
    injectIntl,
    FormattedRelative,
    FormattedMessage, 
    FormattedPlural, 
    FormattedNumber, 
} from 'react-intl';

import { 
    Notification as NotificationActions
 }                              from '../../../actions'

const _NotifContentBox  = createReactClass({

    getInitialState() {
        return {
            isRead: this.props.data.isRead
        }
    },

    handleNotifClick(e) { 
        e.preventDefault();

        const url = this.props.data.url,
        _url_arr  = url.split('?')[0].split('/'),
        type      = _url_arr[1],
        id        = _url_arr[2];
        // console.log('clicked note is', this.props.data)
        if(type === 'posts') {
            this.props.loadPost(id).then((data) => {
                this.props.history.push(url)
            })
        } else if(type === 'pictures'){
            this.props.loadPhoto(id).then((data) => {
                this.props.history.push(url)
            })
        } else {
            console.log('nothing todo here')
        }
        // this.props.handleNotifClick(this.props.data)
    },

    render() {
        const { isRead } = this.state,
        { data } = this.props,
        { type } = data;
        
        if(type === 'notification.opinion.main.create') 
            return <OpinionCreated 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.opinion.allie.create')
            return <OpinionAllieCreated 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.post.allie.create')
            return <AllieCreated 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.side.to_author')
            return <SideToAuthor 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.side.to_user')
            return <SideToUser 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.side.comment.from_author')
            return <SideCommentFromAuthor 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.side.comment.to_author')
            return <SideCommentToAuthor 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.side.comment.to_user')
            return <SideCommentToUser 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.post.comment.to_author')
            return <CommentUserPostToAuthor 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.photo.comment.to_author')
            return <CommentUserPhotoToAuthor 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.photo.comment.from_author')
            return <CommentAuthorPhoto 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.post.comment.from_author')
            return <CommentAuthorPost 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.photo.comment.to_user')
            return <CommentUserPhoto 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.post.comment.to_user')
            return <CommentUserPost 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.rate.from_author')
            return <RateAuthorPost 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.legal.from_user')
            return <LegalAuthorPost 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.reply.to_user')
            return <ReplyUserComment 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.reply.to_author')
            return <ReplyUserToAuthor 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.legal.to_author')
            return <LegalUserToAuthor 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.reply.from_author')
            return <ReplyAuthorComment 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.rate.to_author')
            return <RateUserPostToAuthor 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.like.to_author')
            return <LikeUserToAuthor 
                handleNotifClick={this.handleNotifClick}
                data={data} />

        else if(type === 'notification.legal.to_user')
            return <LegalUserPost 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.rate.to_user')
            return <RateUserPost 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.like.to_user')
            return <LikeUserPost 
                    handleNotifClick={this.handleNotifClick}
                    data={data} />

        else if(type === 'notification.like.from_author')
            <LikeAuthorPost 
                handleNotifClick={this.handleNotifClick}
                data={data} />
        else
            return <div/>
        
    }         
})

export const NotifContentBox = connect(state => ({
    notifications: state.Notification.notifications,
}))(_NotifContentBox)
 

const clickOutsideConfig = {
    excludeScrollbar: true
};
const NotificationBox  = onClickOutside(
    createReactClass({

        getInitialState(){
            return {
                loading : ''
            }
        },

        handleNotifClick(note) { 
            console.log('navbar note click')
        },

        //method from 'react-onclickoutside' module
        handleClickOutside(e) {
            this.props.toggleNavNotifs(false)
        },

        componentDidMount() {
            if(!this.props.notifications.length)
                this.props.loadNotifications(1)
            /*.then(
                data => console.log(data),
                err => console.log(err)
            )*/
        },

        render() {
            const notifications    = this.props.notifications || [];
            console.log(notifications);

            return (
                <div className="tabnav-box-ctnr">
                    <div className="nt-nv-arraw" id="nt_nv_arraw"></div>
                    <div className="nt-nv-ct" id="nt_nv_ct">
                        <div className="tabnav-box-hd">
                            <div className="nt-nv-ttl note-opn" id="nt_nv_ttl">Notifications</div>
                        </div>
                        <div id="nt_nv_bd" className="nt-nv-bd">
                            <div className="nt-nv-ul">
                                {notifications.map((data, i) => {
                                    return <NotifContentBox 
                                                key={i} 
                                                data={data} 
                                                handleNotifClick={this.handleNotifClick}
                                                />  
                                })}

                            </div>
                            <div className='notif-load-gif'></div>
                        </div>
                    </div>
                </div>
            )
        }         
    }), clickOutsideConfig
)

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, NotificationActions), dispatch)
}

export default connect(state =>({
    notifications: state.Notification.notifications
}), mapDispatchToProps)(NotificationBox)