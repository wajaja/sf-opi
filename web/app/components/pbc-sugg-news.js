var counter_pbc = 0;
var elements_pbc = $('.pbc-sugg-ctent').length;         //get the lenght of suggetsion elements s
var nitems_pbc = elements_pbc - 1;                          //nber minus one

function dosliderpbc(){
    counter_pbc++;
	var elmenttid_pbc = Math.abs(Math.abs(nitems_pbc - counter_pbc % (nitems_pbc*2)) - nitems_pbc );   //the selected element id
    var leftpos_pbc = $('.pbc-sugg-dv .pbc-sugg-ctent:first-child').height() * elmenttid_pbc;   //get the position of container
    $('.pbc-sugg-dv').animate({
		top: -leftpos_pbc +'px'
	}, 300);

    setTimeout(dosliderpbc,6000);
}
setTimeout(dosliderpbc,6000);
