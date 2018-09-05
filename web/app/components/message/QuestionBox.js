import React 					from 'react'
import createReactClass 		from 'create-react-class'
import axios 					from 'axios'
import { connect } 				from 'react-redux'
import { Link } 				from 'react-router-dom'
import ReactDOM, { findDOMNode } from 'react-dom'

import { SecretForm, Secrets,
 	Questions
} 								from '../message'
import { BASE_PATH } 			from '../../config/api'
import bindFunctions 				from '../../utils/bindFunctions'
import { 
	Questions as QuestionsActions,
	Secrets as SecretsActions
} 									from '../../actions/message'
import { 
	Authors as AuthorsActions
} 									from '../../actions/post'

import '../../styles/message/question.scss'

const Option  = createReactClass({
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

////////
const QuestionBox  = createReactClass( {

	getInitialState() {
		return {
			displayData: '',
			loading: true,
			option: false,
			question: {},
			secret: {},
			questions: [],
		}
	},

	onNewQuestion(id) {
		this.setState({questionId: id})
	},

	closeQuestionBox(e) {
		this.props.toggleQuestion();
	},

	toggleOption(e) {
		const self = this;
		this.setState({option: !self.state.option})
	},

	scrollToBottom() {
		const node = ReactDOM.findDOMNode(this.questionMessageBox);
			  node.scrollTop = node.scrollHeight;
	},

	onQuestionSelected(question) {
		const questionId = question.id;
		axios.get(`${BASE_PATH}/api/secrets/load/${questionId}`)
			.then(function (res) {
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
			questionId: questionId
		})
		this.props.changeView('secrets')
		this.props.changeQuestionId(questionId)
	},

	componentWillMount() {
		
	},

	//////
	//////
	componentDidMount() {
		// this.scrollToBottom();
		// const self = this,
		// 	{ post : { author, hasSecret }, user: { id }, dispatch } = this.props,
		// 	postId	 = this.props.post.id,
		// 	authorId = author.id;
		// if(authorId == id) {
		// 	//load all messages if possible
		// 	axios.get(`${BASE_PATH}/api/questions/load/${postId}`, { 
		// 	params : {
		// 		refer: 'post'
		// 	}})
		// 	.then(function (res) {
		// 		const questions = res.data.questions;
		// 		console.log(res.data.questions);
		// 		if(questions) {
		// 			self.setState({
		// 				loading: false,
		// 				questions: questions
		// 			})
		// 			_.each(questions, function(question) {
		// 				dispatch(QuestionsActions.pushQuestion(question))
		// 			})
		// 		} else {
		// 			self.setState({
		// 				loading: false,
		// 				questions: [],
		// 			})
		// 		}
		// 		self.props.changeView('questions')
		// 		self.props.changeQuestionId(null)
		// 	}, function(err) {
		// 		if(err.response) {
		// 		console.log(err.response.data);	
		// 			console.log(err.response.status);
		// 			console.log(err.response.headers);				
		// 		} else if(err.request) {
		// 			console.log(err.request);
		// 		} else {
		// 			console.log(err.message);
		// 		}
		// 		console.log(err.config);
		// })
		// } else {
		// 	//find if possible last message
		// 	if(hasSecret) {
			// 	axios.get(`${BASE_PATH}/api/questions/find`, { 
	  //   			params : {
			// 			postId: postId,
			// 			refer: 'post'
			// 		}
			// 	}).then(function (res) {
			// 		const question = res.data.question,
			// 			responses  = res.data.responses;
			// 		if(question) {
			// 			self.setState({
			// 				loading: false,
			// 				questionId: question.id,
			// 			})
			// 			dispatch(QuestionsActions.pushQuestion(question));
			// 			_.each(responses, function(response) {
			// 				dispatch(SecretsActions.pushResponse(response));
			// 				dispatch(AuthorsActions.pushAuthor(response.author))
			// 			})
			// 			self.props.changeQuestionId(question.id)
			// 		} else {
			// 			self.setState({
			// 				loading: false,
			// 				questionId: null,
			// 			})
			// 			self.props.changeQuestionId(null)
			// 		}
			// 	}, function(err) {
			// 		if(err.response) {
			// 		console.log(err.response.data);	
			// 			console.log(err.response.status);
			// 			console.log(err.response.headers);				
			// 		} else if(err.request) {
			// 			console.log(err.request);
			// 		} else {
			// 			console.log(err.message);
			// 		}
			// 		console.log(err.config);
			// 	})
			// } else {
			// 	self.setState({
			// 		loading: false,
			// 		questionId: null
			// 	})
			// 	self.props.changeQuestionId(question.id)
			// }
			// self.props.changeView('responses')
		// }
		// const { questionId } = this.state,
  //           responses = this.props.responsesStore
	 //            .filter(function(response, i) {
	 //                for(var prop in response) {
	 //                    return response[prop].questionId === questionId;
	 //                }
	 //            })
	 //            .map(function(response, i) {
	 //                for(var prop in response) {
	 //                    return response[prop];
	 //                }
	 //            })
	 //            .sort(function compare(a, b) {
	 //                if (a.createdAt < b.createdAt)
	 //                    return -1;
	 //                if (a.createdAt > b.createdAt)
	 //                    return 1;
	 //                return 0;
	 //        	});
	 //        const questions = this.props.questionsStore
	 //            .filter(function(question, i) {
	 //                for(var prop in question) {
	 //                    return question[prop].postId === postId && question[prop].refer === 'post';
	 //                }
	 //            }).map(function(question, i) {
	 //                for(var prop in question) {
	 //                    return question[prop];
	 //                }
	 //            })
  //           this.setState({
  //           	responses: responses,
  //           	questions: questions
  //           })
	},

	componentDidUpdate(prevProps, prevState) {
		// const { post : { author, hasSecret }, user: { id }, dispatch } = this.props,
		// 	postId	 = this.props.post.id;
  //       if(prevProps != this.props) {
		// 	const { questionId } = this.state,
  //           responses = this.props.responsesStore
	 //            .filter(function(response, i) {
	 //                for(var prop in response) {
	 //                    return response[prop].questionId === questionId;
	 //                }
	 //            })
	 //            .map(function(response, i) {
	 //                for(var prop in response) {
	 //                    return response[prop];
	 //                }
	 //            })
	 //            .sort(function compare(a, b) {
	 //                if (a.createdAt < b.createdAt)
	 //                    return -1;
	 //                if (a.createdAt > b.createdAt)
	 //                    return 1;
	 //                return 0;
	 //        	});
	 //        const questions = this.props.questionsStore
	 //            .filter(function(question, i) {
	 //                for(var prop in question) {
	 //                    return question[prop].postId === postId && question[prop].refer === 'post';
	 //                }
	 //            }).map(function(question, i) {
	 //                for(var prop in question) {
	 //                    return question[prop];
	 //                }
	 //            })
  //           this.setState({
  //           	responses: responses,
  //           	questions: questions
  //           })
	},
	//////
	//////
	render() {
		const { post, placement, refer, questionId, view } = this.props,
		bottom = placement == 'bottom' ? true : false,
		{ questions, question, secrets, displayData, loading } = this.state;
		return(
			<div className={bottom ? `popover quest-ppver bottom` :`popover quest-ppver top`}>
                <div className={bottom ? `arrow bottom` :`arrow top`}></div>
                    <div className="ttl">
                    	<div className="ctnr">
	                    	<div className="opt-q-ctnr">
		                        <span className="opt-rght-opi-q" onClick={this.toggleOption}>
			                        <i className="fa fa-bars" aria-hidden="true"></i>
		                        </span>
		                        {this.state.option && <Option  />}
	                        </div>
	                        <span className="q-ttl">Ask an Question</span>
	                        <span className="question-form-close" onClick={this.closeQuestionBox}>
	                        	<i className="fa fa-times"></i>
	                        </span>
	                    </div>
                    </div>
                    <div className="popover-bdy">
                        <span className="quest-content-ln"></span>
                        <div className="quest-prev-msg" ref={(el)=>{this.questionMessageBox = el}}> 
                        	{this.state.loading && <div className="loading-submit" style={{left:'190px', top: '15px'}}></div>}
                        	{!loading && displayData == 'questions' && 
                        		<Questions 
                        			post={post}
                        			refer={refer}
                        			questions={questions} 
                        			onQuestionSelected={this.onQuestionSelected}
                        			/>
                        	}
                        	{!loading && displayData == 'secrets' && 
                        		<Secrets 
                        			questionId={questionId}
                        			secrets={secrets} 
                        			/>
                        	}
                        </div>
                        <div style={{float:"left", clear:"both"}}
                        	 ref={(el)=>{this.questionEnd = el}} />
                        <div className="quest-frm-ctnr">
                        	<SecretForm 
                        		post={post}
                        		refer={refer}
                        		onNewQuestion={this.onNewQuestion}
                        		questionId={questionId}
                        		/>
                        </div>
                </div>
            </div>
		)
	}
})

export default connect(state =>({
	user: state.User.user,
	questionsStore: state.Questions.questions,
	secretsStore: state.Secrets.secrets,
	// defaults: state.Users.defaults,
}))(QuestionBox)