//from react-videocall-master (project)
import MediaDevice from './MediaDevice';
import Emitter from './Emitter';

////https://websitebeaver.com/insanely-simple-webrtc-video-chat-using-firebase-with-codepen-demo#set-up-firebase
const servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}]};

class PeerConnection extends Emitter {

    /**
     * Create a PeerConnection.
     * @param {String} friendID - ID of the friend you want to call.
     */
    constructor(firebase, friendID, ownID) {
        super();
        this.ownData      = firebase.database().ref(`calls/${ownID}/data`);
        this.friendData   = firebase.database().ref(`calls/${friendID}/data`);
        this.ownStatus    = firebase.database().ref(`calls/${ownID}/status`);
        this.friendStatus = firebase.database().ref(`calls/${friendID}/status`);

        //Enabling RTCPeerConnection on every browsers
        this.pc  = new RTCPeerConnection(servers);

        //onicecandidate callback will send the ICE Candidates to your friend one at a time
        this.pc.onicecandidate = ( event => event.candidate  ? this.sendMessage(
            'ice', JSON.stringify({'ice': event.candidate})) : console.log("Sent All Ice")
        );

        this.pc.onaddstream = event => this.emit('peerStream', event.stream);

        this.mediaDevice = new MediaDevice();
        this.friendID = friendID;
        this.ownID = ownID;

        this.listen();
    }

    listen() {
        /**
        * Ensures the data at this location is deleted when the client is disconnected 
        * (due to closing the browser, navigating to a new page, or network issues).
        */
        this.ownData.onDisconnect().remove()
        this.ownStatus.onDisconnect().set(false)
        this.ownStatus.set(true)

        this.friendData.on('child_added', onMessage)
        this.friendData.on('child_changed', onMessage)

        this.friendStatus.on('child_changed', onDataChange)
    }

    close() {
        Log.w(TAG, "close")
        refToData.removeEventListener(dataListener)
        refToStatus.removeEventListener(statusListener)
        refMyData.removeValue()
        refMyStatus.setValue(false)
//        webSocket?.close(1000, null)
    }

    sendSDP(sdp) {
        Log.w(TAG, "sendSDP : " + sdp)
        send(SDPMessage(sdp))
    }

    sendCandidate(label: Int, id: String, candidate: String) {
        Log.w(TAG, "sendCandidate :  $label $id $candidate")
        send(ICEMessage(label, id, candidate))
    }


    onDataChange(dataSnapshot) {
        // if (dataSnapshot.exists() && !dataSnapshot.Val())
        console.log('child_changed....');
    }

    /**
    * Starting the call
    * @param {Boolean} isCaller
    * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
    */
    start(isCaller, config) {
        this.mediaDevice
            //Emitter
            .on('stream', (stream) => {
                this.pc.addStream(stream);
                this.emit('localStream', stream);

                if (isCaller) {
                    this.createOffer();
                    this.ownData.push({'requestTo': this.friendID});
                } else {
                    // this.createOffer();
                    this.createAnswer();
                    this.ownData.push({'requestFrom': this.friendID});
                }
            })

            //mediaDevice
            .start(config);

        return this;
    }

    /**
    * type: ('sdp' || 'ice')
    */
    sendMessage(type, data) {
        let ref = this.ownData.child(type)
        ref.set(data);
        // msg.remove();
    }

    /**
    * Stop the call
    * @param {Boolean} isStarter
    */
    stop(isStarter) {
        if (isStarter) {
            this.ownData.push({'endTo': this.friendID});
        }

        refToData.removeEventListener(dataListener)
        refToStatus.removeEventListener(statusListener)
        refMyData.removeValue()
        refMyStatus.setValue(false)

        this.mediaDevice.stop();
        this.pc.close();
        this.pc = null;
        this.off();
        return this;
    }



    createOffer() {
        this.pc.createOffer()
          .then(this.getDescription.bind(this))
          .catch(err => console.log(err));
        return this;
    } 

    createAnswer() {
        // pc.createOffer().then(offer => pc.setLocalDescription(offer) )
        this.pc.createAnswer()
            .then(this.getDescription.bind(this))
            .catch(err => console.log(err));
        return this;
    }

    //desc can be an offer or answer
    getDescription(desc) {
        this.pc.setLocalDescription(desc);
        this.sendMessage(this.ownID, JSON.stringify({'sdp': pc.localDescription}));
        socket.emit('call', { to: this.friendID, sdp: desc });
        return this;
    }

    /**
    * @param {Object} sdp - Session description
    */
    setRemoteDescription(sdp) {
        const rtcSdp = new RTCSessionDescription(sdp);
        this.pc.setRemoteDescription(rtcSdp);
        return this;
    }
    /**
    * @param {Object} candidate - ICE Candidate
    */
    addIceCandidate(candidate) {
        if (candidate) {
            const iceCandidate = new RTCIceCandidate(candidate);
            this.pc.addIceCandidate(iceCandidate);
        }
        return this;
    }
}

export default PeerConnection;
