// Main.js
// Vanessa Knoppke-Wetzel
//last edited 3/13/2013
// thanks to Leaflet and Open-Source community, for map and leaflet
// related codings, and EventTarget.js and ProceessCSV.js codes from open
// course community. props

//console.log("This is working so far.");

//global variables
var map; //map object
var csvData; //array of objects
var markersLayer; //markers layer group object
var timestamp = 1999; //initial timestamp
var scaleFactor = 200; //scale factor for marker area
var timer; //timer object for animation
var timerInterval = 1000; //initial animation speed in milliseconds



//begin script when window loads
window.onload = initialize(); //->

//the first function called once the html is loaded
function initialize(){
	//<-window.onload
	document.getElementById('small').innerHTML = timestamp;
	processCSV();
	setMap(); //->
};

//set basemap parameters
function setMap() {
	//<-initialize()

	//create the map and set its initial view, as well as making sure zoom
	//control option IS !!NOT!! activated, as map is already set at appropriate level,
	//and finally, sets min and max zoom values (here, the same value), so user
	// !!can't!! zoom in and out, because again, all the data is already in the map extent.
	//also remove: panning and double click pan&zoom
	map = L.map('map', { zoomControl:false, minZoom:6, maxZoom:6, dragging: false, doubleClickZoom: false}).setView([45.644768,-111.950684],6);
		
	
	//add the tile layer to the map
	var layer = L.tileLayer(				
	
		"http://{s}.acetate.geoiq.com/tiles/acetate/{z}/{x}/{y}.png",
		{
			attribution: 'Acetate tileset from GeoIQ',
		}).addTo(map);
		
	var layerTwo = L.tileLayer(
		"http://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}.png",
		{
			attribution: 'ESRI map tile',
		}).addTo(map);
	
	
	
		
	var baseLayers = {
		"State Lines": layer,
		"Topography": layerTwo
		
	}
	
	L.control.layers(baseLayers).addTo(map);
	
   
	
	
	sequenceInteractions();
	
};


				//Sequencing Controls

function sequenceInteractions(){
	//console.log("hi are you getting here");
			
	$(".pause").hide();
			
	//play behavior
	$(".play").click(function(){
		//console.log("blaaaah");
		$(".pause").show();
		$(".play").hide();
		animateMap();
	});
			
	//pause behavior
	$(".pause").click(function(){
		$(".pause").hide();
		$(".play").show();
		stopMap();
	});
	
	//step behavior
	$(".step").click(function(){
		step();
	});
	
	//step-full behavior
	$(".step-full").click(function(){
		jump(2008); //update with last timestamp
		document.getElementById('small').innerHTML = timestamp;
	});
	
	//back behavior
	$(".back").click(function(){
		back();
	});
	
	//back-full behavior
	$(".back-full").click(function(){
		jump(1999); //update with first timestamp
		document.getElementById('small').innerHTML = timestamp;
	});
		
	//timeSlider behavior	
	$("#timeSlider").slider({

		max: 9, //size of time interval, 1999-2008 is 9 years
		step: 1,
		animate: "fast",
		slide: function(e, ui){
			stopMap();
			//timestamp = 1999 + Math.round(ui.value/50);
			//timestamp = ui.value;
			//timestamp = ui.value +1999;
			timestamp = 1999 + ui.value;
			markersLayer.eachLayer(function(layer) {
				onEachFeature(layer);
				document.getElementById('small').innerHTML = timestamp;
			})			
		}
	});
			
			
};

function processCSV() {
	//<-setMap()

	//process the csvData csv file
	var processCSV = new ProcessCSV(); //-> to ProcessCSV.js
	var csv = 'data/csvData.csv'; // set location of csv file

	processCSV.addListener("complete", function(){
		csvData = processCSV.getCSV(); //-> to ProcessCSV.js
		createMarkers();
		//console.log(csvData);
	});

	processCSV.process(csv); //-> to ProcessCSV.js
	//console.log(processCSV.process(csv));
};

function createMarkers() {
	//<-ProcessCSV()
	
	//radius
	var r = 10;
	
	//marker style obj
	var markerStyle = {
		radius: r,
		fillColor: '#580b0b',
		color: '#580b0b',
	};
	
	//create array for hold markers
	var markersArray = [];
	
	//create a circle marker for each object in csvData array
	for (var i = 0; i<csvData.length; i++) {
		var feature = {};
		feature.properties = csvData[i];
		var lat = Number(feature.properties.latitude);
		var lng = Number(feature.properties.longitude);
		var marker = L.circleMarker ([lat,lng], markerStyle);
		marker.feature = feature;
		markersArray.push(marker);
	};
	
	//create a markers layer with all the circle markers
	markersLayer = L.featureGroup(markersArray);
	
	//add the markers layer to the map
	markersLayer.addTo(map);
	
	//call function for size and to add its popup
	markersLayer.eachLayer(function(layer) {
		onEachFeature(layer);		
	})
}
	

function onEachFeature(layer) {
	//layer.closePopup();
	//calculate the area based on the data for that timestamp
	var area = layer.feature.properties[timestamp] * scaleFactor;
	
	//calculate the radius
	var radius = Math.sqrt(area/Math.PI);
	
	//set the symbol radius
	layer.setRadius(radius);
	
	//create and style the HTML in the information popup
	var popupHTML = 	"<b>" + layer.feature.properties[timestamp] + 
						" packs</b><br>" +
						"<i> "  + 
						"</i> in <i>" + timestamp + "</i>";
		
	//bind the popup to the feature
	layer.bindPopup(popupHTML, {
		offset: new L.Point(0,-radius)
	});
	
	//information popup on hover
	layer.on({
		mouseover: function(){
			layer.openPopup();
			this.setStyle({radius: radius, color: 'red'});
		},
		mouseout: function(){
			layer.closePopup();
			//window.close();
			this.setStyle({color: '#580b0b'});
		}
	});	
}



function animateMap(){
	//back to setMap()
	
	timer = setInterval (function(){
		step();//->
	},timerInterval);
}

function stopMap() {
	clearInterval(timer);
}

function step(){
	//back to animateMap()
	
	
	//cycles through years
	if (timestamp < 2008){ //last timestamp header
		timestamp++;	
		
	}
	else {
		timestamp = 1999; //defaults back to original value
		
	};
	document.getElementById('small').innerHTML = timestamp;
	
	//with changing timestamp,
	//onEachFeature will update the display
	markersLayer.eachLayer(function(layer) {
		onEachFeature(layer);	//->
	});	
	
	// //update slider position
	updateSlider();
}






function back(){
	
	//cycle through years
	if (timestamp > 1999){ //update with last timestamp header
		timestamp--;
	} else {
		timestamp = 2008; //update with first timestampe header
	};
	
	document.getElementById('small').innerHTML = timestamp;
	//upon changing the timestamp, call onEachFeature to update the display
	markersLayer.eachLayer(function(layer) {
		onEachFeature(layer);
	});
	
	// //update the slider position based on the timestamp change
	updateSlider();
}

function jump(t){
	
	//set the timestamp to the value passed in the parameter
	timestamp = t;
	
	//upon changing the timestamp, call onEachFeature to update the display
	markersLayer.eachLayer(function(layer) {
		onEachFeature(layer);
	});
	
	//update the slider position based on the timestamp change
	updateSlider();
}

function updateSlider(){
	
	//move the slider to the appropriate value
	var sliderval = (timestamp-1999);
	//var sliderval = timestamp; 
	$("#timeSlider").slider("value",sliderval);
	
}




//animateMap();