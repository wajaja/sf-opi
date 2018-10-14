Finding you on a map
Let's quickly go through a small example that uses Google Maps to display the map of the place where the user is currently located. We'll first include the script to load Google Maps onto the page:

<script src="http://maps.google.com/maps/api/js?sensor=false"></script>
Then we include our logic to determine the location and display a map centered on that location:

<script type="text/javascript">
// Determine support for Geolocation
if (navigator.geolocation) {
	// Locate position
	navigator.geolocation.getCurrentPosition(displayPosition, errorFunction);
} else {
	alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
}

// Success callback function
function displayPosition(pos) {
	var mylat = pos.coords.latitude;
	var mylong = pos.coords.longitude;
	var thediv = document.getElementById('locationinfo');
	thediv.innerHTML = '<p>Your longitude is :' +
		mylong + ' and your latitide is ' + mylat + '</p>';

//Load Google Map
var latlng = new google.maps.LatLng(mylat, mylong);
	var myOptions = {
		zoom: 15,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};

var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

//Add marker
var marker = new google.maps.Marker({
		 position: latlng,
		 map: map,
		 title:"You are here"
	 });
}

// Error callback function
function errorFunction(pos) {
	alert('Error!');
}
</script>
Finally, the HTML and CSS to display the data is as follows:

<head>
	<style type="text/css">
		html, body {
		width: 100%;
		height: 100%;
	}
	#map_canvas {
		height: 85%;
		width: 100%;
	}
	</style>
</head>
<body>
	<div id="map_canvas"></div>
	<div id="locationinfo"></div>
</body>
Figure 2 shows the resulting Geolocation example. It will ask you for permission to share your location and then display a Google Map of your location.