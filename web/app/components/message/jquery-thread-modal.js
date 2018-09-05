//jquery plugin for flash_modal_thread
    (function($) {
        $.fn.thread_modal = function(options) {
            options = $.extend({
              modalTarget:'',
              text: 'Done',
              open: 'false',
              how: 'before',
              class_name: '',
              position:'fixed',
              width:'100%',
              height:'100%',
              top:'0px',
              left:'0px',
              zIndexIn: '9999',
              zIndexOut: '-9999',
              opacityIn:'1',
              opacityOut:'0',
              animatedIn:'zoomIn',
              animatedOut:'zoomOut',
              animationDuration:'.6s',
              overflow:'auto',
              // Callbacks
              beforeOpen: function() {},
              afterOpen: function() {},
              beforeClose: function() {},
              afterClose: function() {}
            }, options);        //add options

            //Init styles
            var initStyles = {
                'open':options.open,
                'position':options.position,
                'height':options.height,
                'width':options.width,
                'top':options.top,
                'left':options.left,
                'overflow-y':options.overflow,
                'z-index':options.zIndexOut,
                'opacity':options.opacityOut,
                '-webkit-animation-duration':options.animationDuration
            };
            
            var modal_thread = $('.modal_thread');
            var closeBt = '';
            var cancelBt = '';
            //Apply stles
            modal_thread.css(initStyles);
            //test if open option is set to true
            if(options.open == "true"){
                $('body, html').css({'overflow':'hidden'});
                if (modal_thread.hasClass(options.modalTarget+'-off')) {
                    modal_thread.removeClass(options.animatedOut);
                    modal_thread.removeClass(options.modalTarget+'-off');
                    modal_thread.addClass(options.modalTarget+'-on');
                }

                 if (modal_thread.hasClass(options.modalTarget+'-on')) {
                    options.beforeOpen();
                    modal_thread.css({'opacity':options.opacityIn,'z-index':options.zIndexIn});
                    modal_thread.addClass(options.animatedIn);
                    modal_thread.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', afterOpen);

                    //set and select closeBt & cancelBt element when the modal is open
                    closeBt = $('#'+options.modalTarget+'-close');
                    cancelBt = $('#'+options.modalTarget+'-cancel');
                };
            }

            closeBt.click(function (e) {
                e.preventDefault();
                $('body, html').css({'overflow':'auto'});
                options.beforeClose(); //beforeClose
                console.log('opi1');
                // $(".opinion_share_form").remove();
                if (modal_thread.hasClass(options.modalTarget+'-on')) {
                    modal_thread.removeClass(options.modalTarget+'-on');
                    modal_thread.addClass(options.modalTarget+'-off');
                    console.log('opi2');
                }

                if (modal_thread.hasClass(options.modalTarget+'-off')) {
                    modal_thread.removeClass(options.animatedIn);
                    modal_thread.addClass(options.animatedOut);
                    modal_thread.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', afterClose);
                    console.log('opi3');
                };
            });

            //the button to cancel action
            cancelBt.click(function (e) {
                e.preventDefault();
                $('body, html').css({'overflow':'auto'});
                options.beforeClose(); //beforeClose
                // $(".opinion_share_form").remove();
                if (modal_thread.hasClass(options.modalTarget+'-on')) {
                    modal_thread.removeClass(options.modalTarget+'-on');
                    modal_thread.addClass(options.modalTarget+'-off');
                }

                if (modal_thread.hasClass(options.modalTarget+'-off')) {
                    modal_thread.removeClass(options.animatedIn);
                    modal_thread.addClass(options.animatedOut);
                    modal_thread.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', afterClose);                                               //to be empty on modal element
                };
            });
            if(options.open == "false"){
                $('body, html').css({'overflow':'auto'});
                options.beforeClose(); //beforeClose
                modal_thread.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', afterClose);
            }
            function afterClose () {
                modal_thread.css({'z-index':options.zIndexOut});
                modal_thread.html('');                           //to be empty the modal element
                options.afterClose(); //afterClose
            }
            function afterOpen () {
                options.afterOpen(); //afterOpen
            }
        };
    })(jQuery);



