import React                from 'react'
import createReactClass     from 'create-react-class'
import { connect } 			from 'react-redux'
import axios                from 'axios'
import { BASE_PATH }        from '../../../../config/api'
import { 
    Exception as ExceptionActions,
    User as UserActions 
}                           from '../../../../actions'

import MyLoadable    from '../../../../components/MyLoadable'
const Cropper = MyLoadable({loader: () => import('../../../../components/media/Cropper')}),
StaticModal     = MyLoadable({loader: () => import('../../../../components/social/StaticModal')})

const ProfilePic  = createReactClass({

	getInitialState() {
		return {
			viewport: {
				x: 50,
				y: 50,
				width: 260,         //pixel
				height: 260
			},
            crop: {
                x: 20,
                y: 5,
                aspect: 1,
                width: 30,
                height: 50,
            },
			croppedImg: null,
			dataUrl: null,
			image: null
		}
	},

	componentDidMount() {

	},

	//when the video's chosen
    fileChosen(e) {
        const { dispatch }  = this.props,
		input 		= e.target,
        file        = e.target.files[0],
		imageType 	= /^image\//;

		if (!file || !imageType.test(file.type)) {
			return;
		}

		this.setState({
            image: file,
            croppedImg: null 
        })
		const reader = new FileReader();

		reader.onload = (evt) => {
		    this.setState({
		    	dataUrl : evt.target.result
		    });
		};

		reader.readAsDataURL(file);
    },

    getResult(croppedImg){
        this.setState({
            croppedImg: croppedImg,
        })
    },

    //fct called when save is clicked
    SaveToServer() {
        const self  = this,
        formData    = new FormData(),
        { dispatch, history } = this.props

        formData.append('cropped_data', this.state.croppedImg); //will be croppedData at server side
        formData.append('file', this.state.image);

        axios.post(`${BASE_PATH}/api/complete/pic`, formData)
            .then(function (res) {
                // dispatch(UserActions.setProfilePic(res.data.webPath))
                history.replace('/confirmed/infos') 
            }, function(err) {
                if(err.response) {
                    self.props.dispatch(
                        ExceptionActions.throwNewEception(true, err.response.data.message)
                    )            
                }
            })
        
        //     beforeSend:function(){
        //         if(!$('.cfmd-btm-dv').find('.cfmd-ldg-upld').length){
        //             $('.cfmd-btm-dv').append('<span class="cfmd-ldg-upld"></span>');
        //         }
        //     },
        //     success:function(response){
        //         //$('.cfmd-btn-dv').remove();
        //         if($('.cfmd-btm-dv').find('.cfmd-ldg-upld').length){
        //             $('.cfmd-ldg-upld').remove();
        //         }
        //         $('.vw-crop').text('done').css("color", 'green');               //display done text when data is saved to the server
        //         $('.prf-dv-nv-lk').html('<span class="ld-prf-img"></span>');
        //         $('.prf-dv-nv-lk').html('<img id="profilePic-in-nav" class="profilePic-in-nav" src="'+response.webPath+'" />');
        //         setTimeout(function(){
        //             window.location.href = response.url;
        //         }, 1000);
        //     },
    },

    nextPage() {
        this.history.replace('/confirmed/infos')
    },

	render() {
		const { viewport, dataUrl, croppedImg, crop, image } = this.state
		return(
            <div className="container">
                <div className="bd-cfmd-cont">
                    <div className="pnl-prof-pic-ctnr">
            			<div className="cfnd-panel-profPic">
            				<div className="bd-cfmd-empty"></div>
                            <div className="db-cfmd-dv">
                                <div className="db-cfmd-tp">
                                    <div className="wlc-nw-usr-dv">
                                        <div className="tp-lft-ctnr" style={{display: 'inline-block' }}>
                                            <span className="wlc-nw-usr-sp">Upload Picture</span>
                                        </div>
                                        <div className="tp-rght-ctnr" style={{display: 'inline-block' }}>
                                            <span className="dfault-ico">
                                                <i className="fa fa-cog" aria-hidden="true"></i>
                                            </span>
                                            <div className="dfault-ctnr"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="db-cfmd-fm">
                                    <div className="confirmedForm">
                                        <div className="confirmedForm-a" >
                                            <div id="crop-area" className="crop-area changed">
                                            	{dataUrl !== null && croppedImg === null &&
                                                    <StaticModal>
                		                            	<Cropper 
                                                            crop={crop}
                                                            image={image}
                                                            data={{
                                                                x: 10,
                                                                y: 10,
                                                                width: 800,
                                                                height: 800
                                                            }}
                                                            cropBoxData={{
                                                                left: 5,
                                                                top: 20,
                                                                width: 450,
                                                                height: 450
                                                            }}
                                                            style={{height: 400, width: '100%'}}
                                                            minContainerWidth={200}
                                                            minContainerHeight={100}
                                                            dataUrl={dataUrl} 
                                                            viewport={viewport}
                                                            aspectRatio={1/1}
                                                            getResult={this.getResult}
                		                            		onCropComplete={this.onCropComplete}
                		                            		/>
                                                    </StaticModal>
            		                            }
                                                {dataUrl !==null && croppedImg !== null &&
                                                    <div className="croppedImg-area">
                                                        <img 
                                                            src={croppedImg} 
                                                            style={{
                                                                width: '240px', 
                                                                height: '240px', 
                                                                borderRadius: '50%',
                                                                position: 'absolute',
                                                                left: '10px',
                                                                top: '10px'
                                                            }} 
                                                            />
                                                    </div>
                                                }
                                            </div>
                                            <div className="cfmd-btm-dv">
                                                <button className="fileUploadProfile btn btn-d">
                                                    <i className="fa fa-camera fa-2x ">
            				                            <input 
            				                            	type="file" 
            				                            	name="imageLoader"
            				                            	className="uploadProfile" 
            				                            	onChange={this.fileChosen}
            				                            	/>
                                                    </i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="db-cfmd-mr-adr" className="db-cfmd-mr-adr"></div>
                                <div id="db-cfmd-ln" className="db-cfmd-ln">
                                    <div className="db-cfmd-ign-lk">
                                        <div className="ign-ctnr">
                                            <button 
                                                onClick={this.nextPage}
                                                style={{outline: 'none'}}
                                                className="btn btn-default cfmd-ign">
                                                Ignore
                                            </button>
                                        </div>
                                        <div className="ign-ctnr sve-pic-ctnr">
                                        	<button 
                                        		className="btn btn-primary cfrm_sv_pic" 
                                                style={{outline: 'none'}}
                                        		id="cfrm_sv_pic" 
                                        		onClick={this.SaveToServer}>
                                        		Save
                                        	</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
            			</div>
                    </div>
                </div>
            </div>
		)
	}
})

////
export default ProfilePic