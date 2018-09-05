import React 		from 'react'
import { 
	RecordTimer, AudioRTC 
} 					from '../../../../components'

const VoiceCalling = ({ recipient, user, caller, stream, pickedUp, hangUp, pickUp, dispatch }) => {

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
		                <AudioRTC stream={stream} />
		                <div className="end-call-ctnr">
		                	<i className="end-call-icfa fa-pencil" onClick={() => hangUp } aria-hidden="true"></i>
		                	<div className="timer-ctnr">
		                    	{!pickedUp && caller.id === user.id && 
		                    		<div>
		                    			<i className="end-call-icfa fa-pencil" onClick={() => pickUp } aria-hidden="true"></i>
		                    		</div> 
		                    	}
		                    </div>
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
	                    <div className="user-pic">
	                    	<img src={user.profile_pic.web_path} className="user-pic-img" />
	                    </div>                    
	                </div>
	            </div>
	        </div>
        </div>
	)
}

export default VoiceCalling