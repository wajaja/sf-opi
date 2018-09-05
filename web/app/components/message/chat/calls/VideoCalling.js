import React 		from 'react'
import { 
	RecordTimer, VideoRTC 
} 					from '../../../../components'

const VideoCalling = ({ recipient, user, caller, localStream, remoteStream, pickedUp, hangUp, pickUp }) => {

	return(
		<div className="calling-ctnr" >
			<div className="calling-ctnr-a" >
	            <div className="calling-hd">
	                <div className="ttl">video calling</div>
	                <div className="recip-name-txt">
	                	<span>{recipient.firstname}</span>
                        <span>{recipient.lastname}</span>
	                </div>
	            </div>
	            {!pickedUp && 
	            	<div className="calling-mdl" >
		                <img src={recipient.profile_pic.web_path} className="calling-pic" />
		                <VideoRTC stream={remoteStream}  muted={false}/>
		                <div className="end-call-ctnr">
		                	<i className="end-call-icfa fa-pencil" onClick={() => hangUp } aria-hidden="true"></i>
		                </div>
	                	<div className="pick-call-ctnr">
	                    	{!caller.id === user.id && 
	                    		<div>
	                    			<i className="end-call-icfa fa-pencil" onClick={() => pickUp } aria-hidden="true"></i>
	                    		</div> 
	                    	}
	                    </div>
		            </div>
		        }
		        {pickedUp && 
	            	<div className="calling-mdl" >
		                <VideoRTC stream={remoteStream} />
		                <div className="end-call-ctnr">
		                	<i className="end-call-icfa fa-pencil" onClick={() => hangUp } aria-hidden="true"></i>
		                </div>
		            </div>
		        }
	            <div className="calling-btm"> 
	                <div className="rght" >
	                    <div className="timer-ctnr">
	                    	{pickedUp && <RecordTimer start={Date.now()}/> }
	                    	{!pickedUp && <div>calling...</div> }
	                    </div>
	                </div>
	                <div className="lft" >
	                    <VideoRTC stream={localStream} muted={true} />
	                </div>
	            </div>
	        </div>
        </div>
	)
}

export default VideoCalling