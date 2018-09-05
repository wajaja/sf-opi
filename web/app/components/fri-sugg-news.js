var counter = 0;
var elements = $('.fr-sugg-ctent').length;
var nitems = elements - 1;

function doslider(){
    counter++;
	var elmenttid = Math.abs(Math.abs(nitems - counter % (nitems*2)) - nitems );
    var leftpos = $('.fr-sugg-dv .fr-sugg-ctent:first-child').height() * elmenttid;     //position of elements
    $('.fr-sugg-dv').animate({
		top: -leftpos +'px'
	}, 300);

    setTimeout(doslider,6000);
}
setTimeout(doslider,6000);
//return time
$('.fr-sugg-sp-tm').each(function(i, el){
    var db_str = $(el).data('ts-db');
})
