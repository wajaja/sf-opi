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
        return (
            <div className="note-content" >
                <div className={isRead ? 'notif-li-read' : 'notif-li-unread' }>
                    {type === 'notification.opinion.main.create' && 
                            <OpinionCreated 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />} 

                    {type === 'notification.opinion.allie.create' && 
                            <OpinionAllieCreated 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />} 

                    {type === 'notification.post.allie.create' && 
                            <AllieCreated 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />} 

                    {type === 'notification.side.to_author' && 
                            <SideToAuthor 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />} 

                    {type === 'notification.side.to_user' && 
                            <SideToUser 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.side.comment.from_author' &&
                            <SideCommentFromAuthor 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.side.comment.to_author' &&
                            <SideCommentToAuthor 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.side.comment.to_user' &&
                            <SideCommentToUser 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.post.comment.to_author' &&
                            <CommentUserPostToAuthor 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.photo.comment.to_author' &&
                            <CommentUserPhotoToAuthor 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.photo.comment.from_author' &&
                            <CommentAuthorPhoto 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.post.comment.from_author' &&
                            <CommentAuthorPost 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.photo.comment.to_user' &&
                            <CommentUserPhoto 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.post.comment.to_user' &&
                            <CommentUserPost 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.rate.from_author' &&
                            <RateAuthorPost 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.legal.from_user' &&
                            <LegalAuthorPost 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.reply.to_user' &&
                            <ReplyUserComment 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.reply.to_author' &&
                            <ReplyUserToAuthor 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.legal.to_author' &&
                            <LegalUserToAuthor 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.reply.from_author' &&
                            <ReplyAuthorComment 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.rate.to_author' &&
                            <RateUserPostToAuthor 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.like.to_author' &&
                        <LikeUserToAuthor 
                            handleNotifClick={this.handleNotifClick}
                            data={data} />}

                    {type === 'notification.legal.to_user' &&
                            <LegalUserPost 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.rate.to_user' &&
                            <RateUserPost 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.like.to_user' &&
                            <LikeUserPost 
                                handleNotifClick={this.handleNotifClick}
                                data={data} />}

                    {type === 'notification.like.from_author' &&
                        <LikeAuthorPost 
                            handleNotifClick={this.handleNotifClick}
                            data={data} />}
                </div>
            </div>
        )
    }         
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, NotificationActions), dispatch)
}

export const NotifContentBox = connect(state => ({
    notifications: state.Notification.notifications,
}), mapDispatchToProps)(_NotifContentBox)
 

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

        toggleNavNotifs(e) {
            e.preventDefault();
            this.props.toggleNavNotifs()
        },

        //method from 'react-onclickoutside' module
        handleClickOutside(e) {
            this.props.toggleNavNotifs(false)
        },

        render() {
            const { notifications }     = this.props;

            return (
                <div className="dv-tabnav-ct" id='tabnav_nt' >
                    <div className={this.props.navNotifsBox ? 'currentTab' : ''}>
                        <span className="unseenNotifications"></span>
                        <Link
                            to="/notifications"
                            onClick={this.toggleNavNotifs}
                            className={this.props.navNotifsBox ? `active nt-nv-a-lk` : `nt-nv-a-lk`}>
                        </Link>
                        {this.props.navNotifsBox &&
                            <div className="tabnav-box-ctnr">
                                <div className="nt-nv-arraw" id="nt_nv_arraw"></div>
                                <div className="nt-nv-ct" id="nt_nv_ct">
                                    <div className="tabnav-box-hd">
                                        <div className="nt-nv-ttl note-opn" id="nt_nv_ttl">Notifications</div>
                                    </div>
                                    <div id="nt_nv_bd" className="nt-nv-bd">
                                        <div className="nt-nv-ul">
                                            {notifications && notifications.map((data, i) => {
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
                        }
                    </div>
                </div>
            )
        }         
    }), clickOutsideConfig
)

export default connect(state =>({
    notification: state.Notification.notifications
}))(NotificationBox)