var $nt_arraw = $('#nt_nv_arraw'),
    $nt_ct    = $('#nt_nv_ct'),
    $invit_arraw = $('#invit_nv_arraw'),
    $invit_ct    = $('#invit_nv_ct');
$('#msg_nv_a_lk').click(function(e){
    e.preventDefault();

    
    
    return false;
});

//Document Click
$(document).click(function(){
    $("#msg_nv_ct").hide();
    $(".msg-nv-arraw").hide();
    $(".configArraw").hide();
    $("#navSettingContainer").hide();
});
//Popup Click
$("#msg_nv_ct").click(function() {
    return false;
});
$("#msg_nv_arraw").click(function() {
    return false;
});







