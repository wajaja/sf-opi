import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { connect } 					from 'react-redux'
import { Link } 					from 'react-router-dom'
import ReactDOM, { findDOMNode } 	from 'react-dom'
import { Scrollbars } 				from 'react-custom-scrollbars';

import { SecretForm, Secrets,
 	Questions
} 									from '../../../../components'
import { BASE_PATH } 				from '../../../../config/api'
import bindFunctions 				from '../../../../utils/bindFunctions'
import { 
	Questions as QuestionsActions,
	Secrets as SecretsActions,
	Authors as AuthorsActions
} 									from '../../../../actions'

const Option  = createReactClass( {
	render() {
		return(
			<span className="wid-q-opt">
		        <span className="wid-q-opt-b">
		            <span className="q-add-mbr">add member</span>
		            <div className="q-line-spr"></div>
		            <span className="q-pub">publish quest</span>
		        </span>
		    </span>
	     )
	}
})

/////
/////
const PictureSecrets  = createReactClass( {

	getInitialState() {
		return {
			loading: true,
			option: false,
			question: {},
			secret: {},
			questions: [],
			scroll_height: 300,
		}
	},

	onNewQuestion(id) {
		this.setState({questionId: id})
	},

	toggleOption(e) {
		const self = this;
		this.setState({option: !self.state.option})
	},

	scrollToBottom () {
		// const node = ReactDOM.findDOMNode(this.questionMessageBox);
		// 	  node.scrollTop = node.scrollHeight;
	},

	//select question in questions list
	onQuestionSelected(question) {
		const questionId   = question.id,
			  { dispatch } = this.props;
		axios.get(`${BASE_PATH}/api/secrets/load/${questionId}`)
			.then(function (res) {
				console.log(res.data)
				const secrets = res.data.secrets;
				_.each(secrets, function(s) {
					dispatch(SecretsActions.pushSecret(s));
					dispatch(AuthorsActions.pushAuthor(s.author))
				})
			}, function(err) {
				if(err.response) {
				console.log(err.response.data);	
					console.log(err.response.status);
					console.log(err.response.headers);				
				} else if(err.request) {
					console.log(err.request);
				} else {
					console.log(err.message);
				}
				console.log(err.config);
		})
		this.setState({
			question: question,
			questionId: question.id
		})
		this.props.changeView('secrets')
		this.props.changeQuestionId(questionId)
	},

	componentWillMount() {
		const self = this,
		{ photo : { id }, dispatch, questionId, 
		questionsStore, secretsStore } = this.props,
        secrets = secretsStore
            .filter((s, i) => {
                for(var prop in s) {
                    return s[prop].questionId === questionId;
                }
            })
            .map((s, i) => {
                for(var prop in s) {
                    return s[prop];
                }
            })
            .sort((a, b) => {
                if (a.createdAt < b.createdAt)
               		return -1;
                if (a.createdAt > b.createdAt)
                    return 1;
                return 0;
        }),
        questions = questionsStore
            .filter(function(question, i) {
                for(var prop in question) {
                    return question[prop].postId === id;
                }
            }).map(function(question, i) {
                for(var prop in question) {
                    return question[prop];
                }
        });

        this.setState({
        	secrets: secrets,
        	questions: questions,
        })
	},

	//////
	//////
	componentDidMount() {
		const winHeight = window.innerHeight,
        photo_height = (winHeight - (25 * 2)),
        //(photo_height - link-action - formContainer - (ph-rght-tp + titleContainer))
        scroll_height = (photo_height - 60 - 60 - 65);

        this.setState({
        	scroll_height: scroll_height
        })
		this.scrollToBottom();
	},

	componentWillReceiveProps(nextProps) {
   //      if(prevProps != this.props) {
			// const { questionId } = this.props,
			// 	  postId	 	 = this.props.photo.id,
   //          responses = this.props.responsesStore
	  //           .filter(function(response, i) {
	  //               for(var prop in response) {
	  //                   return response[prop].questionId === questionId;
	  //               }
	  //           })
	  //           .map(function(response, i) {
	  //               for(var prop in response) {
	  //                   return response[prop];
	  //               }
	  //           })
	  //           .sort(function compare(a, b) {
	  //               if (a.createdAt < b.createdAt)
	  //                   return -1;
	  //               if (a.createdAt > b.createdAt)
	  //                   return 1;
	  //               return 0;
	  //       	});
	  //       const questions = this.props.questionsStore
	  //           .filter(function(question, i) {
	  //               for(var prop in question) {
	  //                   return question[prop].postId === postId && question[prop].refer === 'photo';
	  //               }
	  //           }).map(function(question, i) {
	  //               for(var prop in question) {
	  //                   return question[prop];
	  //               }
	  //           })
   //          this.setState({
   //          	responses: responses,
   //          	questions: questions
   //          })
        // }
	},

	render() {
		const { photo :{id}, view, questionId, questions, loading, showSecrets } = this.props,
		{  secrets, scroll_height } = this.state,
		display = showSecrets ? 'block' : 'none';
		return(
			<div style={{display}} className="sec-ctnr">
				<div className="ttl">
                	<div className="ctnr">
                    	{id && 
                    		<div className="opt-q-ctnr">
		                        <span className="opt-rght-opi-q" onClick={this.toggleOption}>
			                        <i className="fa fa-bars" aria-hidden="true"></i>
		                        </span>
		                        {this.state.option && <Option />}
	                        </div>
	                    }
                        <span className="q-ttl">Ask an Question</span>
                    </div>
                </div>
                <div className="popover-bdy">
                	<div className="popover-bdy-a">
                		{id && 
                			<div className="popover-bdy-b">
			                    <span className="quest-content-ln"></span>
			                    	{this.state.loading && <div className="loading-submit" style={{left:'190px', top: '15px'}}></div>}
			                    	{!loading && view == 'questions' && 
			                    		<Scrollbars
	                						style={{ height: scroll_height }}>
									        <div className="quest-prev-msg" ref={(el) => {this.questionMessageBox = el}}>    
					                    		<Questions 
					                    			photo={this.props.photo}
					                    			refer="photo"
					                    			questions={questions} 
					                    			onQuestionSelected={this.onQuestionSelected}
					                    			/>
					                    	</div>
				                    	</Scrollbars>
			                    	}
			                    	{!loading && view == 'secrets' && 
			                    		<Scrollbars
	                						style={{ height: scroll_height }}>
									        <div className="quest-prev-msg" ref={(el) => {this.responseMessageBox = el}}>     
					                    		<Secrets 
					                    			refer="photo"
					                    			questionId={questionId}
					                    			responses={responses} 
					                    			/>
					                    	</div>
				                    	</Scrollbars>
			                    	}		                    
			                    <div className="quest-frm-ctnr">
			                    	<SecretForm 
			                    		{...this.props}
			                    		post={this.props.photo}
			                    		refer='photo'
			                    		onNewQuestion={this.onNewQuestion}
			                    		questionId={questionId}
			                    		/>
			                    </div>
		                	</div>
			            }
                    </div>
            	</div>
			</div>
		)
	}
})

export default connect(state =>({
	user: state.User.user,
	secretsStore: state.Secrets.secrets,
	questionsStore: state.Questions.questions,
}))(PictureSecrets)