if($('.thr-participant').lenght<1){
    console.log('is thread participant');   
}else{
    console.log(' oko ici ça va');
}
//
$('.add-subj').on('click', function(e){
    e.preventDefault();
    $('.nw-thr-ttl-b').css('display','block');
    return false;
});
