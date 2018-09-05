//function used to find an occurences elements in array
function findOccurences(arr, val){
	var i, j, count = 0;
	for(i=0, j=arr.length; i<j; i++){
		(arr[i]===val) && count++;
	}
	return count;
}

function getQuikStories(){
	jQuery.ajax({
		type:"get",
		url:"http://127.0.0.1/opinion/web/app_dev.php/notification/",
		beforeSend:function(data){
		},
		contentType:false,
		processData: false,
		success:function(data){

				//  	//add footer to ul (notif container)
				//  	if(jQuery('.q-stor-dta').find('li').length > 10){
				//     jQuery('#').append('<div id="notificationFooter"><a class="s-all-not" href="#">See All</a></div>');
				//  	}else{
				// 	jQuery('#qkContainer').append('<div id="notificationFooter"></div>');
				//  	}
				//
				//
				$('.q-stor-gph-lk-a').click(function(e){
					e.preventDefault();
					var stor_elem 	= $(this),
						totl_number = stor_elem.data('notif-number'),
						d_date 		= stor_elem.data('date'),
						title 		= stor_elem.data('title'),
						tooltip 	= $(this).parents('.q-stor-gph-dv').find('.tootip-clk-stor-dv'),	//get last opened  tooltip to remove before next
						tooltip_parent = tooltip.parents('.q-stor-gph-lk-a'),
						tooltip_length = tooltip.length;	//find the lenght of all quick tooltip in the body

							/** append data to tooltip in according of class name (from date)
							/** tri data using each function ** get html of each  element; insert in div */
							var day_month_date = stor_elem.data('date'),
								class_name = "dta-"+day_month_date;
								array_part_notif = "";
							$('.q-stor-gph-dta-notif').each(function(i, el){
								if($(this).attr('id')===class_name){
									array_part_notif = array_part_notif+' '+'<div class="q-stor-gph-dta-notif"  id="" notedataid="">'+$(el).html()+'</div>';
								}else{
									//reject all element that have'nt same id like the matched elements
								}
							});

							if(tooltip_length>0) {
								tooltip_parent.html('');
								if(stor_elem.find('.tootip-hver-stor').length>0)
								{
									stor_elem.html('');				//set html content for element
									//if an tootip-clk-stor-dv element exist in the body do nothing
									if($('body').find('.tootip-clk-stor-dv').length>0)
									{
									}else{
										stor_elem.append('<div class="tootip-clk-stor-dv">'+
															'<span class="tootip-clk-stor-hdr">'+
																'<span class="tootip-clk-stor-dte">'+d_date+'</span>'+
																'<span class="tootip-clk-stor-nb-not">'+totl_number+' '+title+'</span>'+
																'<a href="#" class="tootip-clk-stor-cls">x</a>'+
															'</span>'+
															'<div class="tootip-clk-stor-bd">'+array_part_notif+'</div>'+
														'</div>');
									}
								}else{
									//when the link have same content do nothing
								}
							}else{
								// when tooltip_length greatest then zero
								if(stor_elem.find('.tootip-hver-stor').length>0){
									stor_elem.html('');
									/** append data to tooltip in according of class name (from date)
									/** tri data using each function ** get html of each  element; insert in div */
									var day_month_date = stor_elem.data('date'),
										class_name = "dta-"+day_month_date;
										array_part_notif = "";
									$('.q-stor-gph-dta-notif').each(function(i, el){
										if($(this).attr('id')===class_name){
											//get html of each  element; insert in div
											array_part_notif = array_part_notif+' '+'<div class="q-stor-gph-dta-notif"  id="" notedataid="">'+$(el).html()+'</div>';
										}else{
											//reject
										}
									});
									}
								}else{
									//*******************
								}
							}
				});
		}	//end success Properties
	});
}
getQuikStories();
