function CreateGallery(){
    var win, doc, $, winW, winH, $mContainer, mOverlay, mContainer;
    
    /**
     * Before OpenModal Get profile pic or Image by its id
     * @param {String} imgId
     * @returns {undefined}
     */
    function beforeOpenModal (imgId) {
        
    }
    
    /**
     * get Others user's images
     * @returns {undefined}
     */
    function afterOpenModal () {
        //call all user'images 
    }

    function beforeCloseModal (type) {
        //
    }

    function afterCloseModal () {

    }

    /**
     * Save cropped data or if possible image file to Server
     * @param {String} cropped_data
     * @returns {undefined}
     */
    function SaveToServer (cropped_data){
        $.ajax({
            type:'post',
            url: url,
            data:formData,
            contentType:false,
            processData: false,
            beforeSend:function(){
                
            },
            success:function(response){
//                if($('#crop-area').find('.cfmd-ldg-upld').length){
//                    $('.cfmd-ldg-upld').remove();
//                }  
                console.log(response.data);
                //TODO flash message
//                setTimeout(function(){
//                    window.location.href = response.url;
//                }, 1000);
            },
            failure:function(){
                console.log('error');
            }
        });
    }
    
    /**
     * Open Modal
     * @param {String} type
     * @param {String} imgId
     * @returns {undefined}
     */
    this.OpenModal = function (type, imgId) {

        win             = window;
        doc             = document;
        $               = win.jQuery;
        winW            = win.innerWidth;
        winH            = win.innerHeight;
        $mContainer     = $('#create-gal-container');
        mOverlay        = doc.getElementById('create-gal-overlay');
        mContainer      = doc.getElementById('create-gal-container');

        mOverlay.style.display  = "block";
        mContainer.style.left   = ((winW / 2) - (600 / 2)) + "px";
        mContainer.style.top    = "60px";
        global_type             = type;

        //add Animation Class
        mContainer.style.display = "block";
        $mContainer.addClass('prof-openModal');
        // $mContainer.html(template);
        beforeOpenModal(imgId);   
        afterOpenModal();
    }
    
    /**
     * Close Modal
     * @returns {undefined}
     */
    this.CloseModal = function () {
        // beforeCloseModal(type);
        mOverlay.style.display  = "none";
        $mContainer.removeClass('prof-openModal');
        $mContainer.html('');
        mContainer.style.display = "none";
        // afterCloseModal()
    }
    
    /**
     * Reset Modal Content
     * @returns {undefined}
     */
    this.Reset = function () {

    }
    
    /**
     * ReadFile After change event
     * @param {Object} input
     * @returns {undefined}
     */
    this.ReadFile = function (input) {
        
    }
}

var CreateGallery = new CreateGallery();