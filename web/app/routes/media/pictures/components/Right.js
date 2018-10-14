import React 		from 'react';
import { pure } 	from 'recompose';
import classnames   from 'classnames';
import { PictureComments,
         PictureSecrets,
         PictureLikes 
}             		from '../components';

const Right = ({selected_activity, photo, comments, showComments,
				questionId, secretAlreadySeen, changeView, changeQuestionId,
				showLikes, secretView, showSecrets, loadingSecret, questions,
				onShare, renderSecrets, renderComments, renderLikes, params, user, onComment, ...rest}) => (
	<div className="rght-a">
        <div className="rght-b">
            <div className="actties-ctnr">
                <div className={classnames('actties-ctnr-a', selected_activity)}>
                    <PictureComments 
                        {...rest}
                        photo={photo} 
                        comments={comments} 
                        onComment={onComment}
                        showComments={showComments}
                        />
                    <PictureLikes
                        {...rest} 
                        photo={photo} 
                        showLikes={showLikes}
                        />
                    <PictureSecrets
                        {...rest}
                        photo={photo} 
                        view={secretView}
                        showSecrets={showSecrets}
                        loading={loadingSecret}
                        questions={questions}
                        questionId={questionId}
                        alreadySeen={secretAlreadySeen}
                        changeView={changeView}
                        changeQuestionId={changeQuestionId}
                        />                                                             
                </div>
                <div className={classnames('actties-arrow', selected_activity)}></div>                            
            </div> 
            <div className="pls-lks-act">
	           	{photo.id === params.id &&
	                <div className="pls-lks-act-a">
				        <div className="share-dv">
				            <span className="postShare-icon-form" onClick={onShare}>
				                <i className="fa fa-share-alt"></i>
				                <span className="txt">share</span>
				            </span>                           
				        </div>
				        <div className={classnames('q-div', {'selected' : showSecrets })}>
				            <span className={classnames('selec-sp', {'selected' : showSecrets })}></span>
				            <span className="sp-secret" onClick={renderSecrets}>
				                <span className="glyphicon glyphicon-question-sign"></span>
				                <span className="txt">secret</span>
				            </span>
				            {user.id == photo.author.id && <span className="pst-qst-nb">{photo.nbQuestioners}</span>}
				            {photo.hasSecret && 
				                <span className="pst-qst-noti">
				                    <i className="fa fa-circle" aria-hidden="true"></i>
				                </span>
				            } 
				        </div>
				        <div className={classnames('cmt-dv', {'selected' : showComments })}>
				            <span className={classnames('selec-sp', {'selected' : showComments })}></span>
				            <span className="linkPcomment" onClick={renderComments}>
				                <i className="fa fa-comment"></i>
				                <span className="txt">comment</span>
				            </span>
				        </div>
				        <div className={classnames('like-dv', {'selected' : showLikes })}>
				            <span className={classnames('selec-sp', {'selected' : showLikes })}></span>
				            <div 
				                onClick={renderLikes}
				                className="every-ico">
				                EveryWh
				            </div>
				        </div>
				    </div>
	            }
	        </div>
	    </div>
	</div>
);


/////// This won't be called when the props DONT change
export default pure(Right);