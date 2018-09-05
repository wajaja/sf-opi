function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-online').offset().top;
    if (window_top > div_top) {
        $('#_2').addClass('stick');
        $('#sticky-online').height($('#sticky').outerHeight());
    } else {
        $('#_2').removeClass('stick');
        $('#sticky-online').height(0);
    }
}

$(function() {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});
