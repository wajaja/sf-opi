//edit cover in homepage link
$(document).on('click', '.hm-edt-cov-pic', function(e){
	e.preventDefault();

	var $this = $(this),
		$window = $(window),
    	window_size = $window.width(),
		leftLength = Math.floor((window_size - 700)/2) + 'px';

	//second argument will be empty string; trying to get default user's picture
	SetProfilesImage.OpenModal('cover', '');
	return false;
});

//edit profile picture in homepage link
$(document).on('click', '.hm-edt-prof-pic', function(e){
	e.preventDefault();

	//second argument will be empty string; trying to get default user's picture
	SetProfilesImage.OpenModal('profile', '');
	return false;
});

$(document).on('click', '.close-profSet-modal', function(e) {
    e.preventDefault();
    SetProfilesImage.CloseModal();
});

$(document).on('change', '.inpUploadImageSet', function(e) {
	SetProfilesImage.ReadFile(this);
});

$(document).on('click', '.cancel-set-prof', function (e) {
	e.preventDefault();
	SetProfilesImage.Reset();
})