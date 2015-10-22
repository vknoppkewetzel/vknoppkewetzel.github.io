// Vanessa Knoppke-WEtzel
// last edited 4/17/2013

//global variables
var keyArray = ["residential","commercial","industrial","transportation","electric"];
var expressed = keyArray[0]; //initial attribute

//begin script when window loads 
window.onload = initialize();


//the first function called once the html is loaded
function initialize(){
setMap();
};


//set choropleth map parameters
function setMap(){

	//map frame dimensions
	var width = 900;
	var height = 460;

	//create a new svg element with the above dimensions
	var map = d3.select("#map-container")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	//create Europe albers equal area conic projection, centered on France
	var projection = d3.geo.albersUsa()
		.scale(1000)
		.translate([width / 2, height / 2]);

	//create svg path generator using the projection
	var path = d3.geo.path()
		.projection(projection);

	//retrieve data in csv data file for coloring choropleth
	d3.csv("data/petroleum.csv", function(petroleum){ //callback #1	
		var recolorMap = colorScale(petroleum);
		drawPcp(petroleum);

		
		//retrieve and process states json file
		d3.json("data/states.json", function(error, states) { //callback #2

		//variables for csv to json data transfer
			var jsonST = states.objects.usStates.geometries; //for brevity

		//loop through csv data to assign each csv state's values to json state properties
		for (var i=0; i<petroleum.length; i++) {		
			var csvState= petroleum[i]; //the current state
			var ST = csvState.ST; //adm1 code from csv features

			//loop through json provinces to assign csv data to the right states
			for (var a=0; a<jsonST.length; a++){
				//where ST match, attach csv data to json object
				if (jsonST[a].properties.ST == ST){

					//one more for loop to assign all five key/value pairs to json object
					for (var b=0; b<keyArray.length; b++){
						var key = keyArray[b]; //assign key from keys array
						var val = parseFloat(csvState[key]); //convert corresponding csv attribute value to float
						jsonST[a].properties[key] = val; //assign key and value pair to json object
					};
					
				jsonST[a].properties.name = csvState.name; //replace TopoJSON name property
				break; //stop looking through the json provinces
				};
			};
		};
		
		var states = map.selectAll(".states")
			.data(topojson.object(states, 
							states.objects.usStates).geometries) 
			.enter() //create elements
			.append("path") //append elements to svg
			.attr("class", "STs") //assign class for additional styling
			.attr("id", function(d) { return d.properties.ST}) 
			.attr("d", path) //project data as geometry in svg
			.style("fill", function(d) { //color enumeration units
				return choropleth(d, recolorMap);
			})
			.on("mouseover", highlight)
			.on("mouseout", dehighlight)
			.on("mousemove", moveLabel)
			.append("desc") //append the current color
				.text(function(d) {
				return choropleth(d, recolorMap);
			});
		});
	});
	
};

function colorScale(petroleum){

	//create quantile classes with color scale
	var color = d3.scale.quantile() //designate quantile scale generator
		.range([
			"#F9D1E3",
			"#EE76AC",
			"#DD1C77",
			"#9E1452",
			"#440823"
		]);

		//set min and max data values as domain
	color.domain([
		d3.min(petroleum, function(d) { return Number(d[expressed]); }),
		d3.max(petroleum, function(d) { return Number(d[expressed]); })
	]);

	//return the color scale generator
	return color;	

};

function choropleth(d, recolorMap){
	//<-setMap d3.json provinces.style

	//Get data value
	var value = d.properties[expressed];
	//If value exists, assign it a color; otherwise assign gray
	if (value) {
		return recolorMap(value);
	} else {
		return "#CDC1C5";
	};
};




function drawPcp(petroleum){
	//pcp dimensions
	var width = 550;
	var height = 700;
	
	//create attribute names array for pcp axes
	var keys = [], attributes = [];
	
	//fill keys array with all property names
	for (var key in petroleum[0]){
		keys.push(key);
	};
	//fill attributes array with only the attribute names
	for (var i=2; i<keys.length; i++){
		attributes.push(keys[i]);
	};
	//create horizontal pcp coordinate generator
	var coordinates = d3.scale.ordinal() //create an ordinal scale for plotting axes
		.domain(attributes) //horizontally space each attribute's axis evenly
		.rangePoints([0, width]); //set the horizontal scale width as the SVG width
	var axis = d3.svg.axis() //create axis generator
		.orient("left"); //orient generated axes vertically
	
	//create vertical pcp scale
	scales = {}; //object to hold scale generators
	attributes.forEach(function(att){ //for each attribute
    	scales[att] = d3.scale.linear() //create a linear scale generator for the attribute
        	.domain(d3.extent(petroleum, function(data){ //compute the min and max values of the scale
				return +data[att]; //create array of data values to compute extent from
			})) 
        	.range([height, 0]); //set the height of each axis as the SVG height
	});
	
	var line = d3.svg.line(); //create line generator
	
	//create a new svg element with the above dimensions
	var pcplot = d3.select("#pcp-container")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "pcplot") //for styling
		.append("g") //append container element
		.attr("transform", d3.transform( //change the container size/shape
			"scale(0.8, 0.6),"+ //shrink
			"translate(96, 50)")); //move
			
	// var pcpBackground = pcplot.append("rect") //background for the pcp
		// .attr("x", "-30")
		// .attr("y", "-35")
		// .attr("width", "600")
		// .attr("height", "460")
		// .attr("rx", "15")
		// .attr("ry", "15")
		// .attr("class", "pcpBackground");
		
	//add lines
	var pcpLines = pcplot.append("g") //append a container element
		.attr("class", "pcpLines") //class for styling lines
		.selectAll("path") //prepare for new path elements
		.data(petroleum) //bind data
		.enter() //create new path for each line
		.append("path") //append each line path to the container element
		.attr("id", function(d){
			return d.ST; //id each line by admin code
		})
		.attr("d", function(d){
			return line(attributes.map(function(att){ //map coordinates for each line to arrays object for line generator
				return [coordinates(att), scales[att](d[att])]; //x and y coordinates for line at each axis
			}));
		})
		.on("mouseover", highlight)
		.on("mouseout", dehighlight)
		.on("mousemove", moveLabel);
		

		
	//add axes	
	var axes = pcplot.selectAll(".attribute") //prepare for new elements
		.data(attributes) //bind data (attribute array)
		.enter() //create new elements
		.append("g") //append elements as containers
		.attr("class", "axes") //class for styling
		.attr("transform", function(d){
			return "translate("+coordinates(d)+")"; //position each axis container
		})
		.each(function(d){ //invoke the function for each axis container element
			d3.select(this) //select the current axis container element
				.call(axis //call the axis generator to create each axis path
					.scale(scales[d]) //generate the vertical scale for the axis
					.ticks(0) //no ticks
					.tickSize(0) //no ticks, I mean it!
				)
				.attr("id", d) //assign the attribute name as the axis id for restyling
				//.style("stroke-width", "10px") //style each axis		
				.on("click", function(){ //click listener
					sequence(this, petroleum);
				});
		})
		
		.each(function(d){ //invoke the function for each axis container element
			d3.select(this)
				.append("svg:text")
					.attr("text-anchor","middle")
					.attr("y",-9)
					.text(String)
				//.style("font-size", "12px")
				.attr("id", d) //assign the attribute name as the axis id for restyling
				//.style("stroke-width", "10px") //style each axis		
				.on("click", function(){ //click listener
					sequence(this, petroleum);
				})
				.on("mouseover", function(){ //click listener
					d3.select(this)
						.attr("fill","#8B8989");
				})
				.on("mouseout", function(){ //click listener
					d3.select(this)
						.attr("fill","black");
				});	
		});
		
	pcplot.select("#"+expressed) //select the expressed attribute's axis for special styling
		//.style("stroke-width", "10px");
};


function highlight(data){
	//<-setMap d3.json provinces.on("mouseover"...
	//<-drawPcp pcpLines.on("mouseover"...
	if(data.properties){
		var targetContainer = "#map-container";
	} else {
		var targetContainer = "#pcp-container";
	}
	var props = datatest(data);	//standardize json or csv data

	d3.select("#"+props.ST) //select the current ST in the DOM
		.style("fill", "#2C0617"); //set the enumeration unit fill to black
	
	//highlight corresponding pcp line
	d3.selectAll(".pcpLines") //select the pcp lines
		.select("#"+props.ST) //select the right pcp line
		.style("stroke","#DD1C77"); //restyle the line
		
		
	var labelAttribute = "<h1>"+props.ST+":"+props[expressed]+"%"+"</h1><br><b>"+expressed+"</b>"; //Label content
	var labelName = props.name; //html string for name to go in child div

	
	
	//create info label div
	var infolabel = d3.select(targetContainer).append("div")
		.attr("class", "infolabel") //for styling label
		//.attr("id", props.ST+"label") //for future access to label div
		.html(labelAttribute) //add text
		.append("div") //add child div for feature name
		.attr("class", "labelname") //for styling name
		.html(labelName); //add feature name to label
	
};


function dehighlight(data){
	var props = datatest(data);	//standardize json or csv data
	
	var prov = d3.select("#"+props.ST); //designate selector variable for brevity
	var fillcolor = prov.select("desc").text(); //access original color from desc
	prov.style("fill", fillcolor); //reset enumeration unit to orginal color
	
	
	//dehighlight corresponding pcp line
	d3.selectAll(".pcpLines") //select the pcp lines
		.select("#"+props.ST) //select the right pcp line
		.style("stroke","#8B8989"); //restyle the line
	

	d3.select(".infolabel").remove(); //remove info label
	
	
};


function datatest(data){
	if (data.properties){ //if json data
		return data.properties;
	} else { //if csv data
		return data;
	};
};


function moveLabel(d) {
		//console.log(d);
		var x = d3.mouse(this)[0] + 20; //horizontal label coordinate based mouse position stored in d3.event
		var y = d3.mouse(this)[1] - 50; //vertical label coordinate
		
		//console.log('x ',x);
		d3.select(".infolabel") //select the label div for moving
			.style("left", x+"px") //reposition label horizontal
			.style("top", y+"px") //reposition label vertical
		

};

function sequence(axis, petroleum){
		//<-drawPcp axes.each.on("click"...
	
		//restyle the axis
		d3.selectAll(".axes") //select every axis
			.style("stroke-width", "5px"); //make them all thin
		axis.style.strokeWidth = "10px"; //thicken the axis that was clicked as user feedback
		
		expressed = axis.id; //change the class-level attribute variable
		
		//recolor the map
		d3.selectAll(".STs") //select every province
			.style("fill", function(d) { //color enumeration units
				return choropleth(d, colorScale(petroleum)); //->
			})
			.select("desc") //replace the color text in each province's desc element
			.text(function(d) {
				return choropleth(d, colorScale(petroleum)); //->
			});
	
	
};


