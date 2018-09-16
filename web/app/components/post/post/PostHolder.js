import React 				from 'react'
import createReactClass 	from 'create-react-class'
import _ 					from 'lodash'
import { connect } 			from 'react-redux'

const Head = () => (
	<div>
        <div className="pst-ctnr-tp" >
           <div className="lft-pst-ctnr-tp">
           		<div className="plc-hld dv-pic"></div>
           	</div>
           <div className="rght-pst-ctnr-tp">
                <div className="rght-pst-dv-aut">
               		<div className="plc-hld dv-name"></div>
                </div>
           </div>
           <div className="rght-pst-ctnr-tp-abs">
              <div className="rght-pst-ctnr-tp-abs-a">
                <div className="pst-dv-dte"></div>
                <div className="pst-opt"></div>
              </div>
           </div>
       </div>
	</div>
)

const Body = ({ post }) => {
	let { content, participants } = post;
	return (
    	<div className="pst-ctnr-mdl">	        	
    		<div className="simple">
                <div className="rght-pst-ctnr-mdl-a">
                    <div className="pst-dv-txt-ctn">
                       <div className="postContent">
                       		<div className="plc-hld anim-content"></div>
                       		<div className="plc-hld anim-content"></div>
                       </div>
                   	</div>
                   	<div className="pst-dv-img-ctn">
                       	<div className="pst-dv-img-ctn-a">
                           	<div className="pst-dv-img-ctn-b"></div>
                       </div>
                   </div>
                   {!!participants && participants.length > 0 && 
                    	<div className="pst-dv-partic-ctn">
                        	<div className="pst-dv-partic-ctn">
	                        	<span className="partic-msg" >partics : </span>
		                        {participants.map(function(user, i) {
									return (
										<div key={i} className="partic-usr"></div>
									)
								})}
							</div>
						</div>
					}
               </div>
        	</div>		                    
      	</div>
    )
}

const Foot = ({ post }) => {
    const { id, author, hasSecret, liked, nbLikers, nbQuestioners}   = post;
	return(
		<div className="fooPost">
            <div className="fooPost-a">
                <div className="plc-hld fooPost-b" >
                    <div className="plc-hld fooPost-c">
                        <div className="postQuestionDiv item deg270">
                            <span className="postQuestion-icon-form">
                                <span className=""></span>
                                <span className="txt"></span>
                            </span>
                        </div>
                        <div className="postShareDiv  item deg0">
                            <span className="postShare-icon-form">
                                <i className=""></i>
                                <span className="txt"></span>
                            </span>                           
                        </div>
                        <div className="pCommentDiv item deg315" >
                            <span className="linkPcomment" >
                                <i className=""></i>
                                <span className="txt"></span>
                            </span>
                        </div>
                        <div className="plikeDv item center">
                        </div>
                    </div>
                </div>
                <div className="fooPost-b-r" >
                    <div className="postDetail">
                    </div>
                </div>
            </div>
        </div>
	)
}

const Allie = createReactClass({

	render() {
		const { allie } = this.state

		return(
			<div className="edtr-ctnr">
                <div className="edtr-ctnr-a">
                	<div className="lft-pst-ctnr">
                		<div className="lft-pst-ctnr-a">
                			<div className="plc-hld dv-pic"></div>
		                </div>
		            </div>
		            <div className="rght-pst-ctnr">
		                <div className="rght-pst-dv-aut">
		                   	<div className="multi-pst-ctnr-mdl-a">
	                           	<div className="multi-dv-txt-ctn">
	                               	<div className="multi-pst postContent" >
	                               		<div className="plc-hld anim-content"></div>
	                               		<div className="plc-hld anim-content"></div>
	                               	</div>
	                           	</div>
	                           	<div className="multi-pst-dv-img-ctn">
	                               	
	                           </div>
	                        </div>
		                </div>
		           </div>
		        </div>
            </div>
		)
	}
})

//////
/////
const WithAllies  = createReactClass({

	render() {
		let self = this,
		{ mainPost: {editors, content, author, }, nbAllies } = this.props

		return(
			<div className="multi">
				<div className="pst-ctnr-tp" >
		            <div className="rght-pst-ctnr-tp-abs">
			            <div className="rght-pst-ctnr-tp-abs-a">
			                <div className="pst-dv-dte">                                                            
				                <span className="pst-dte"></span>
				            </div>
				        </div>
				    </div>
				</div>
				<div className="pst-ctnr-mdl pls-edtrs">
					<div className="pst-ctnr-mdl-main">
						<div className="main-ctnr">
			                <div className="main-ctnr-a">
			                	<div className="lft-pst-ctnr">
			                		<div className="lft-pst-ctnr-a">
							        	{editors.map(function(editor, i) {
											return <div className="pst-aut-nm" />
							        	})}                     
					            	</div>
					            </div>                                                    
					            <div className="rght-pst-ctnr">
					                <div className="rght-pst-dv-aut">	
					               	</div>
					           </div>
					        </div>
			            </div>
			        </div>
			        <div className="pst-ctnr-mdl-edtrs">
				        <div className="edtr-ctnr">
			                <div className="edtr-ctnr-a">
			                	<div className="lft-pst-ctnr">
			                		<div className="lft-pst-ctnr-a">		               
					                	<div className="plc-hld dv-pic"></div>
					                </div>	                         
					            </div>                                                    
					            <div className="rght-pst-ctnr">
					                <div className="rght-pst-dv-aut">
								        <div className="multi-pst-ctnr-mdl-a">
					                       	<div className="multi-dv-txt-ctn">
					                           	<div className="multi-pst postContent" >
					                           		
					                           	</div>
					                       	</div>
					                       	<div className="multi-pst-dv-img-ctn">
					                           	<div className="multi-pst-dv-img-ctn-a">
					                               	<div className="multi-pst-dv-img-ctn-b">
					                               		
					                               </div>
					                           </div>
					                       </div>
					                   </div>
				                   </div>
	                           </div>
	                       </div>
	                    </div>
			        	{editors.map(function(editor, i) {
							return <Allie key={i} {...self.props} editor={editor} />
			        	})}
				    </div>
				</div>
				<div className="pst-ctnr-btm">
				</div>
			</div>
		)
	}
})



const PostHolder  = createReactClass({

	////
	render() {
		const { post: { editors, author }, authors, serverSide } = this.props
		
		if(!!editors && editors.length > 0 ) {
			return (
				<div className="pst-c new-pst appended">
		            <div className="plc-hld pst-d">
						<div className="pst-e">
				            <div className="pst-f">
				                <div className="pst-g">
			                    	<div className="plc-hld pst-h">
				                        <div className="pst-i" >
				                            <div className="pst-j">
				                                <div className="pst-ctnr" >
				                                   	<WithAllies 
				                                   		{...this.props}
				                                   		mainPost={this.props.post}
				                                   		/>
				                                </div>
				                            </div>
				                        </div>
				                    </div>
			                    	<Foot {...this.props} type="WithAllies" />
				                </div>
				            </div>
			        	</div>
			        </div>
			        <div className="pst-sep-foo"></div>
			    </div>
			)
		}

			/////
			/////
		return(
			<div className="pst-c new-pst appended">
				<div className="plc-hld pst-d">	
					<div className="pst-e">		
			            <div className="pst-f">
			                <div className="pst-g">
		                    	<div className="plc-hld pst-h">
			                        <div className="pst-i" >
			                            <div className="pst-j">
			                                <div className="pst-ctnr" >
			                                   	<div>
			                                       	<Head author={author} />
			                                   	</div>
			                                   	<div className="pst-bdy-ctnr">
			                                    	<Body {...this.props} />
			                                   	</div>
			                                </div>
			                            </div>
			                        </div>
			                    </div>
		                    	<Foot {...this.props} type="Simple" />
			                </div>
			            </div>
		        	</div>
		        </div>
		        <div className="pst-sep-foo"></div>
        	</div>
		)
	}
})

export default connect(null)(PostHolder);