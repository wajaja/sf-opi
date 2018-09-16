import  React from "react";

const Dropzone 		= MyLoadable({loader: () => import('react-fine-uploader/dropzone')}),
Thumbnail 		= MyLoadable({loader: () => import('react-fine-uploader/thumbnail')}),
RetryButton 	= MyLoadable({loader: () => import('react-fine-uploader/retry-button')}),
ProgressBar 	= MyLoadable({loader: () => import('react-fine-uploader/progress-bar')}),
DeleteButton 	= MyLoadable({loader: () => import('react-fine-uploader/delete-button')}),
CancelButton 	= MyLoadable({loader: () => import('react-fine-uploader/cancel-button')}),
PauseResumeButton = MyLoadable({loader: () => import('react-fine-uploader/pause-resume-button')}),
FileInput 		= MyLoadable({loader: () => import('react-fine-uploader/file-input')})


class OThumbnail extends React.Component {

	render() {

		return(
			<div className="fine-uploader-post">
            	<div className="qq-gallery">
					<div className="qq-uploader-selector qq-uploader">
						{initialized && 
							<Dropzone style={{ border: '1px dotted', height: 200, width: 200 } } 
								uploader={ this.uploader } >
						        <span>Drop Files Here</span>
						    </Dropzone>
						}
					</div>
					<div className="zone-upload-form">
			            <ul className="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
			                {this.state.submittedFiles.map(function(id) {
			                    return (
			                    	<li key={id}>
			                    		<Thumbnail id={ id } uploader={ this.uploader } className="thumb-pst-img" />
			                    		<button className="react-fine-uploader-delete-button" onClick={this.deleteFile.bind(this, id)}>
			                    			<i className="fa fa-times" aria-hidden="true"><span></span></i>
			                    		</button>
			                    		<ErrorStack>
					            			<button 
					            				className="react-fine-uploader-cancel-button com-dlt-thumb-btn" 
					            				onClick={this.cancelFile.bind(this, id)} type="submit">
						            			{timesIco}
						            		</button>
					            		</ErrorStack>
			                    		<RetryButton id={ id } uploader={ this.uploader } children={retryIco} />
			                    		<button 
			                    			className="fine-uploader-tag-button" 
			                    			onClick={this.getImageFromCache.bind(this, id)} 
			                    			type="button">
			                    			<span className="tag-ico" ></span>
			                    		</button>
			                    	</li>
			                    )      
			                }.bind(this))}
			            </ul>
		           </div>
	            </div>
	        </div>
		)
	}
}