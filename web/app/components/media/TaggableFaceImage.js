import React                from 'react'
import { connect }          from 'react-redux'
import createReactClass     from 'create-react-class'
import { findDOMNode }      from 'react-dom'
import axios                from 'axios'
import _                    from 'lodash'
import { SimpleSelect }     from 'react-selectize';
import { API }              from '../../config'

import '../../styles/user/face-detect.css';

const Rect = createReactClass({

    getInitialState() {
        const { img, rect } = this.props
        return {
            exist: false,
            rect: rect,
            recipient: {},
            clientScale: (img.height / img.naturalHeight),
        }
    },

    onBlur() {
        const { rect, recipient, clientScale, exist } = this.state;
        if(!exist) //if tag exist do not update or modify it
            this.props.sendFriendTag(rect, recipient, clientScale);

        return { open: true }
    },

    updateRecipient(recipient) {
        this.setState({recipient: recipient});
        this.props.popFriendInList(recipient.label);  //to pop friends in list
    },

    componentDidMount() {
        const { friendTags, rect, friends, img } = this.props,
        { clientScale }  =  this.state,
        tag = friendTags.filter(function(tag, i) {
            const serverX = tag.scale * tag.rectX,
            serverY       = tag.scale * tag.rectY,
            clientX       = rect.x * clientScale,
            clientY       = rect.y * clientScale

            // serverValue - clientValue <= tolerance 
            return (Math.abs(serverX - clientX) <= 2) &&  
                   (Math.abs(serverY - clientY) <= 2)
        })[0];

        /* if tag exist  then 
         * tranform it to selectable 
         * value for SimpleSelect Componet
         */
        if(tag && tag.user && tag.user.id) {
            const defaultValue = _.filter(this.props.friends, function(user){
                return _.indexOf(tag.user.username, user.username);
            })
            .map(function(user) {
                return {
                    label: user.username, 
                    firstname: user.firstname, 
                    lastname: user.lastname, 
                    value: user
                }
            })[0];
            this.props.popFriendInList(defaultValue.label);
            this.setState({defaultValue : defaultValue })
        }
    },

    render() {
        const self = this,
        { rect, img, } = this.props,
        options = this.props.friends.map(function(user) {
            return {
                label: user.username, 
                firstname: user.firstname, 
                lastname:user.lastname, 
                value: user
            }
        });

        return (
            <div 
                className="rect" 
                style={{
                    width: rect.width + 'px',
                    height: react.height + 'px',
                    left : (img.offsetLeft + rect.x) + 'px',
                    top : (img.offsetTop + rect.y) + 'px'
                }}>
                <div className="arrow"></div>
                
                <SimpleSelect
                    autofocus={true}
                    ref = "inp-tag-friend"
                    className="inp-tag-friend"
                    placeholder = ""
                    options = {options}
                    value = {this.state.recipient}
                    defaultValue={this.state.defaultValue}
                    restoreOnBackspace = {function(item) {
                        return item.label;
                    }}
                    onValueChange = {self.updateRecipient}
                    renderToggleButton = {function() { return false}}
                    onBlur={this.onBlur}
                    filterOptions = {function(options, values, search) {
                        return _.chain(options)
                            .filter(function(option){
                                return  option.label.indexOf(search) > -1 || 
                                        option.firstname.indexOf(search) > -1 ||
                                        option.lastname.indexOf(search) > -1;
                            })
                            .reject(function(option) {
                                return self.state.recipients.map(function(recipient){
                                    return recipient.label
                                }).indexOf(option.label) > -1
                            })
                            .value();
                    }}
                    renderOption = {function(item, i) {
                        return (
                            <div key={i} className="selec-sugg">
                                <img src={item.value.profilePic} className="selec-sugg-pic" />
                                <span className="selec-sugg-label">
                                    <span className="selec-sugg-name">{item.firstname} {item.lastname}</span>
                                    <span className="selec-sugg-usrnm">{item.label}</span>
                                </span>
                            </div>
                        )
                    }}
                    renderValue = {function(item, i) {
                        return  (
                            <div key={i} className ="selec-field">                                  
                                <span className="selec-name">{item.firstname} {item.lastname}</span>
                            </div>
                        )
                    }}
                    renderNoResultsFound = {function() {
                        return 
                            <div className = "selectize-no-users-found">
                                {!!self.req ? "" : "add users to select"}
                            </div>
                    }}
                />
            </div>
        )
    }
})

//////////////
export const ListRect = (props) => {
    const { rects, friends, sendFriendTag, popFriendInList, friendTags } = props
    return(
        <span className="rects-ctnr">
            {typeof rects === 'array' && rects.map(function(rect, i) {
                return (
                    <Rect 
                        key={i} 
                        rect={rect} 
                        friends={friends} 
                        friendTags={friendTags}
                        sendFriendTag={sendFriendTag}
                        popFriendInList={popFriendInList} 
                        />
                )
            })}
        </span>
    )
}

const TaggableFaceImage = createReactClass({

    getInitialState() {
        const friends = this.props.users.map((user, i) => {
                        return {
                            label: user.username, 
                            firstname: user.firstname, 
                            lastname:user.lastname, 
                            value: user
                        }
                    });
        return {
          showModal: false,
          friends: friends,
        }
    },

    sendFriendTag(rect, recipient, clientScale) {
        const { imageId } = this.props;
        console.log('sendFriendTag', rect, recipient, clientScale)
    },

    popFriendInList(username) {
        const friends = _.filter(this.state.friends, (user, i) => {
            return !_.indexOf(user, user.username); //remove user in selectable list
        })
        .map((user, i) => {
            return {
                label: user.username, 
                firstname: user.firstname, 
                lastname:user.lastname, 
                value: user
            }
        });

        this.setState({friends})
    },

    handleImageLoaded(e) {
        const rects = [],
        img         = e.target,
        tracker     = new tracking.ObjectTracker('face');

        tracking.track(img, tracker);
        tracker.on('track', function(e) {
            e.data.forEach(function(rect) {
                rects.push(rect);
                // plotRectangle(rect.x, rect.y, rect.width, rect.height);
            });
        });

        this.setState({
            img: img,
            rects: rects,
        })
    },

    handleImageErrored(e) {
        console.log('some error happens when initializing image')
    },

    componentDidMount() {
        
        // const friends = this.props.friends;
    },

    componentWillReceiveProps(nextProps){

    },
  
    render () {
        const { friendTags, src }               = this.props,
        { img, rects, defaultRecipients } = this.state;

        if(!src || typeof src !== 'string') {
            return(
                <div style={{color: 'red'}}>error </div>
            )
        }

        ////
        return (
            <div className="taggable-frame">
                <div className="taggable-frame-a">
                    <span id="photo" ref={elm => this.photoRefs } className="frame-container">
                        <img 
                            id="img" 
                            src={src} 
                            className="img-tg" 
                            onLoad={this.handleImageLoaded}
                            ref={elm => this.imgRefs = elm } 
                            onError={this.handleImageErrored}
                            />
                        <ListRect 
                            img={img}
                            rects={rects}
                            friendTags={friendTags}
                            sendFriendTag={this.sendFriendTag}
                            popFriendInList={this.popFriendInList}
                            />
                    </span>
                </div>
            </div>
        )
    }
})

export default connect(state => ({
    users: state.Users.defaults  //connect recipient to reducer to get users as props
}))(TaggableFaceImage)