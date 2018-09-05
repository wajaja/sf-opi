import React                    from 'react'
import { TimeAgo }                  from '../commons'
import { Link }                 from 'react-router-dom'

import { FormattedMessage, 
        FormattedPlural, 
        FormattedNumber, 
        FormattedRelative 
}                               from 'react-intl';

export const Flash = props => {
    const { unreadCount, timeAgo, url, } = props.data;
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.flash'}
                    defaultMessage={'You have {formattedUnreadCount} new {unreadCount, plural, one {notification} other {notifications} } {date}'}
                    values={{                
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght"></div>
            </div>
        </Link>
    )
}

//////
export const PostCreated = props => {
    const { author, timeAgo, url } = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={author.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.post.main.create'}
                    defaultMessage={'new post of {name} {date}.'}
                    values={{
                        name: <b>{user.name}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,

                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

//////
export const PostAllieCreated = props => {

    const { nbAllies, author, lastUser, timeAgo, url }  = props.data,
        nbOthers          = nbAllies -1

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.post.allie.create'}
                    defaultMessage={'{nbAllies, plural, one {the contribution} other {the contributions}} of {allieName} {nbOthers, plural, one {and one other person} other {and others members} } have been added to your post {date}'}
                    values={{
                        allieName: <b>{lastUser.firstname +' '+ lastUser.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        nbAllies: nbAllies,
                        nbOthers: nbOthers
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

//////////::
export const OpinionCreated = props => {

    const { author, sidename, opinionTitle, timeAgo, url } = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={author.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.opinion.create'}
                    defaultMessage={'new opinion created by {authorName}, with {title} as subject, within you are at {sideName} side {date}'}
                    values={{
                        authorName: <b>{author.firstname +' '+ author.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        sideName: <b>{sidename}</b>,
                        title: <b>{opinionTitle}</b>
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

/////
export const OpinionAllieCreated = props => {

    const { author, opinionTitle, postOrder, timeAgo, url } = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={author.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.opinion.allie.create'}
                    defaultMessage={'{authorName} start the {order} part of his post named {title} {date}'}
                    values={{
                        authorName: <b>{author.firstname +' '+ author.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        order:      <b>{postOrder}</b>,
                        title:      <b>{opinionTitle}</b>,
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

////////////
export const SideToAuthor = props => {

    const { lastSider, sidename, unreadCount, timeAgo, url } = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastSider.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.side.to_author'}
                    defaultMessage={'{unreadCount, plural, one {{lastSiderName} of {sideName} gives his opinion about your post.} other {{formattedUnreadCount} new comments including that of {lastSiderName} is the most recent on your post. {date}}}'}
                    values={{
                        unreadCount: unreadCount,
                        lastSiderName: <b>{lastSider.firstname} {lastSider.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        sideName: <b>{sidename}</b>,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

/////////
export const SideToUser = props => {

    const { lastSider, sidename, author, title, postOrder, timeAgo, url } = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastSider.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.side.to_user'}
                    defaultMessage={'From {sideName} of last created post of {authorName} named {title} {lastSiderName} gives his opinion at the {order} th part {date}.'}
                    values={{
                        lastSiderName: <b>{lastSider.firstname} {lastSider.lastname}</b>,
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        sideName:   <b>{sidename}</b>,
                        title:      <b>{opinionTitle}</b>,
                        order:      <b>{postOrder}</b>
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

//////////
export const SideCommentToAuthor = props => {

    const { lastUser, postOrder, author, title, timeAgo, url }   = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.side.comment.to_author'}
                    defaultMessage={'One new comment of {lastUserName} about your opinion at the {order} th of {title} created By {authorName} {date}'}
                    values={{
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        title:      <b>{opinionTitle}</b>,
                        order:      <b>{postOrder}</b>
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

///////
export const SideCommentToUser = props => {

    const { lastSider, author, lastUser, opinionTitle, 
        postOrder, unreadCount, timeAgo, url }   = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.side.comment.to_user'}
                    defaultMessage={'{unreadCount, plural, one { One new comment of {lastUserName} about the opinion of {lastSiderName} at the {order} th part of {title} created By {authorName}.} other {{formattedUnreadCount} new comments including that of {lastUserName} is the most recent about the opinion of {lastSiderName} at the {order} th part of {title} created By {authorName}.}}{date}'}
                    values={{
                        unreadCount: unreadCount,
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        lastSiderName: <b>{lastSider.firstname} {lastSider.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        
                        title:      <b>{opinionTitle}</b>,
                        order:      <b>{postOrder}</b>,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

/////////
export const SideCommentFromAuthor = props => {

    const { lastSider, author, lastUser, opinionTitle, 
            postOrder, unreadCount, timeAgo, url }   = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.side.comment.from_author'}
                    defaultMessage={'{unreadCount, plural, one { One new comment of {lastUserName} on his opinion at the {order} th part of {title} created By {authorName}.} other { {formattedUnreadCount} new comments including that of {lastUserName} is the most recent on his opinion at the {order} th part of {title} created By {authorName}.}}{date}'}
                    values={{
                        unreadCount: unreadCount,
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        lastSiderName: <b>{lastSider.firstname} {lastSider.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        
                        title:      <b>{opinionTitle}</b>,
                        order:      <b>{postOrder}</b>,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

/////
export const CommentUserPostToAuthor = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.post.comment.to_author'}
                    defaultMessage={'{unreadCount, plural, one { one new comment of {lastUserName} on your post.} other { {formattedUnreadCount} new comments including that of {lastUserName} is the most recent on your post.}}{date}'}
                    values={{
                        unreadCount: unreadCount,
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

/////////
export const CommentUserPost = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.post.comment.to_user'}
                    defaultMessage={'{unreadCount, plural, one { one new comment of {lastUserName} on the post of {authorName}.} other { {formattedUnreadCount} new comments including that of {lastUserName} is the most recent on the post of {authorName}.}} {date}'}
                    values={{
                        unreadCount: unreadCount,
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                         date: <TimeAgo timestamp={timeAgo} />,
                        
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

///////////
export const CommentAuthorPost = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.post.comment.from_author'}
                    defaultMessage={'{unreadCount, plural, one { one new comment of {lastUserName} on the his post} other { {formattedUnreadCount} new comments including that of {lastUserName} is the most recent on his post.}} {date}'}
                    values={{
                        unreadCount: unreadCount,
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                         date: <TimeAgo timestamp={timeAgo} />,
                        
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

////////////
export const CommentUserPhoto = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.photo.comment.to_user'}
                    defaultMessage={'{unreadCount, plural, one { one new comment of {lastUserName} on the photo of {authorName}.} other { {formattedUnreadCount} new comments including that of {lastUserName} is the most recent on the photo of {authorName}.}}{date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

//////////
export const CommentAuthorPhoto = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data

    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.photo.comment.from_author'}
                    defaultMessage={'{unreadCount, plural, one { one new comment of {lastUserName} on the his photo.} other { {formattedUnreadCount} new comments including that of {formattedUnreadCount} new comments including that of {lastUserName} is the most recent on his photo.}} {date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

////////
export const CommentUserPhotoToAuthor = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.photo.comment.to_author'}
                    defaultMessage={'{unreadCount, plural, one { one new comment of {lastUserName} on your photo.} other { {formattedUnreadCount} new comments including that of {lastUserName} is the most recent on your photo.}}{date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

////////
export const ReplyUserCommment = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data,
            others                            = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.reply.to_user'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} replied to a comment of {authorName}.} other {New replies of {lastUserName} and {others, plural, one {one other personne on {authorName} s comment.}other {others personnes on {authorName} s comment.}}}} {date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

///////////
export const ReplyAuthorCommment = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.reply.from_author'}
                    defaultMessage={'{unreadCount, plural, one { {authorName} replied on his comment.} other {New replies of {lastUserName} and {others, plural, one {one other personne on his comment.}other {others personnes on his comment.}}}}{date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

//////////
export const ReplyUserToAuthor = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.reply.to_author'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} replied to your comment.} other {New replies of {lastUserName} and {others, plural, one {one other personne replied to your comment.}other {others personnes replied to your comment.}}}} {date}'}
                    values={{
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

///////////
export const RateUserPost = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.rate.to_user'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} give a rate to the post of {authorName}.} other {New replies of {lastUserName} and {others, plural, one {one other personne gives a rate to the post of {authorName}.}other {others personnes give a rate to the post of {authorName}.}}}}{date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

////////
export const RateAuthorPost = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.rate.from_author'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} give a rate to  his post.} other {New replies of {lastUserName} and {others, plural, one {one other personne gives a rate to  his post.} other {others personnes gives a rate to  his post.}}}} {date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

//////////
export const RateUserToAuthor = props => {

    const { author, lastUser, unreadCount, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.rate.to_author'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} give a rate to  your post.} other {New replies of {lastUserName} and {others, plural, one {one other personne gives a rate to  your post.} other {others personnes gives a rate to  your post.} }}} {date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />, 
                        unreadCount: unreadCount, 
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

/////////
export const LikeUserToAuthor = props => {

    const { author, lastUser, unreadCount, postType, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.like.to_author'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} like your {postType}.} other {New replies of {lastUserName} and {others, plural, one {one other personne likes your {postType}.}other {others personnes likes your {postType}.}}}} {date} '}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        postType: postType,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

////////
export const LikeUserPost = props => {

    const { author, lastUser, unreadCount, postType, timeAgo }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.like.to_user'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} like the {postType} of {authorName}.} other {New replies of {lastUserName} and {others, plural, one {one other personne likes the {postType} of {authorName}.} other {others personnes likes the {postType} of {authorName}.} }}} {date} '}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        postType: postType,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

////////
export const LikeAuthorPost = props => {

    const { author, lastUser, unreadCount, postType, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.like.from_author'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} like his {postType}.} other {New replies of {lastUserName} and {others, plural, one {one other personne likes his {postType}.} other {others personnes likes his {postType}.} }}}{date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        postType: postType,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

///////
export const LegalUserToAuthor = props => {

    const { author, lastUser, unreadCount, postType, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.legal.to_author'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} has legalized your position.} other {New replies of {lastUserName} and {others, plural, one {one other personne have legalized your position.} other {others personnes have legalized your position.} }}}{date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        postType: postType,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

///////
export const LegalUserPost = props => {

    const { author, lastUser, unreadCount, postType, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
                <FormattedMessage
                    id={'notification.legal.to_user'}
                    defaultMessage={'{unreadCount, plural, one { {lastUserName} has legalized the position of {authorName}.} other {New replies of {lastUserName} and {others, plural, one {one other personne have legalized the position of {authorName}.} other {others personnes have legalized the position of {authorName}.}}}}{date}'}
                    values={{
                        authorName: <b>{author.firstname} {author.lastname}</b>,
                        lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                        otherUser: <b>{unreadCount - 1}</b>,
                        date: <TimeAgo timestamp={timeAgo} />,
                        unreadCount: unreadCount,
                        postType: postType,
                        others: others,
                        formattedUnreadCount: (
                            <b>
                                <FormattedNumber value={unreadCount} />
                            </b>
                        )
                    }}
                />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}

export const LegalAuthorPost = props => {

    const { author, lastUser, unreadCount, postType, timeAgo, url }   = props.data,
            others                                   = unreadCount - 1
    const { handleNotifClick } = props;
    return(
        <Link to={url} className="lk-to-notif" onClick={handleNotifClick}>
            <div className="note-content-a">
                <div className="note-flt-lft">
                    <div className="note-flt-lft-img">
                        <img src={lastUser.profilePic} className="usr-avatar" />
                    </div>
                </div>
            <FormattedMessage
                id={'notification.legal.from_author'}
                defaultMessage={'{unreadCount, plural, one { {lastUserName} has legalized his position.} other {New replies of {lastUserName} and {others, plural, one {one other personne have legalized his position.} other {others personnes have legalized his position.}}}}{date} '}
                values={{
                    authorName: <b>{author.firstname} {author.lastname}</b>,
                    lastUserName: <b>{lastUser.firstname} {lastUser.lastname}</b>,
                    otherUser: <b>{unreadCount - 1}</b>,
                    date: <TimeAgo timestamp={timeAgo} />,
                    unreadCount: unreadCount,
                    postType: postType,
                    others: others,
                    formattedUnreadCount: (
                        <b>
                            <FormattedNumber value={unreadCount} />
                        </b>
                    )
                }}
            />
                <div className="note-flt-rght">
                </div>
            </div>
        </Link>
    )
}