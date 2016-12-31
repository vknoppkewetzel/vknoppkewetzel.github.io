window.onload = function() {
var arrFull = []; 
var input = "y";
var committed = "rgba(176, 226, 179, .5)";
var planned = "rgba(241, 199, 136, .5)";
var title = prompt("Welcome to the Gantt Generator. What would you like to title this chart as?");

document.getElementById("title").textContent = title;




var ganttDuration = prompt("Please enter entire duration of Gantt Chart in total number of months.");
//in months, full gantt chart, ie, 3 years - 36 months, etc
ganttDuration = Number(ganttDuration); //ensures is Number
while(isNaN(ganttDuration)){
  if(isNaN(ganttDuration)){
    ganttDuration = prompt("You have not entered a number. Please try again:");
  }
  ganttDuration = Number(ganttDuration);
}

var startMonth = prompt("Please enter starting month of Gantt Chart (1 - 12). For example: if first funding on chart begins in August, enter 7.");
startMonth = Number(startMonth);  
checkMonth(); //checks if actually a number

while(startMonth <1 || startMonth>12){ //make sure only 1 - 12 is input
  startMonth = prompt("Please enter a number between 1-12:");
  startMonth = Number(startMonth);
  checkMonth();
}

while(input !== "quit"){ ///partner information only
  if(input === "y"){

    var partner = prompt("Please enter Partner name:");
    var startDuration = sDuration();

    while(startDuration > ganttDuration){
      alert("Uh Oh! Looks like you accidently made the starting point bigger than the Gantt Chart (" + ganttDuration + " months)! Please re-enter start info for " + partner);
      var startDuration = sDuration(); 
    }

    var pDuration = progDuration();

    while(pDuration > ganttDuration){ //ensuring people don't have to start over if they accidently enter something too big
      alert("Uh Oh! Looks like you entered a program duration longer than your Gantt Chart time frame (" + ganttDuration + " months). Please re-enter " + partner + "'s month duration.");
    var pDuration = progDuration();  
    }

    var funding = prompt("Please enter funding amount for this Partner ($x,xxx,xxx):"); // funding
    var planCom = prompt("Finally, is this funding currently Planned or Committed? Enter '1' for Planned or '2' for Committed:");
    
    planCom = Number(planCom);

    while(isNaN(planCom)){
      planCom = prompt("Please enter one of the following numbers: 1 (planned) or 2 (committed):");
    }

    var checkNum = false; 
    while(checkNum === false){
      ifPC();
    }

   if(planCom == 1){ //choosing bar color here within these if statements
    planCom = planned;
   }
   else{
    planCom = committed;
   }

   arrFull.push([partner, startDuration, pDuration, funding, planCom]); //create array, continuously adding when more input 'y'

   var checkInput = false;
   while(checkInput === false){ //doing this to make sure prompt doesn't disappear if something entered in wrong
      input = "random";
      if(input !== 'y' || input !== 'quit'){
        input = prompt("Please enter'y' to continue adding partners, or 'quit' to see graph:");
      }
      if(input =='y'){
        checkInput = true;
      }
      if(input =='quit'){
        checkInput = true;
      }
   }
  }  
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////some functions to make while loop easier to read /////////////////////////////
function checkMonth(){ //checking if month is nmber or not
    while(isNaN(startMonth)){ 
    if(isNaN(startMonth)){
      startMonth = prompt("You have not entered a number. Please enter 1-12:");
    }
    startMonth = Number(startMonth);
  }
}

function sDuration(){ //function to create start Duration variable above in while loop
  var startDuration = prompt("Please enter how many months from start of Gantt Chart this program begins. If first month is August, then August is 0; if first month of funding is December and first month of Gantt Chart is August, then count how many months from August your funding begins (December is 4 months from August):"); // how many months from start of gantt chart did program start, ie:

  startDuration = Number(startDuration);

  while(isNaN(startDuration)){ //checking to see if actual number, otherwise prompts again
    if(isNaN(startDuration)){
      startDuration = prompt("You have not entered a number. Please enter again:");
    }
    startDuration = Number(startDuration);
  }
  return startDuration;
}

function progDuration(){
    var pDuration = prompt("Please enter duration (months) of program funding (ie, 1, 10, 48, etc). Numbers only."); //how long a program lasts, ie - if above example lasted 10 months 
    // a  s  o  n  d  j  f  m  a  m  j  j  a  s  o  n  d  j  f
    //[ ][ ][ ][ ][-][-][-][-][-][-][-][-][-][-][ ][ ][ ][ ][ ]
    pDuration = Number(pDuration);
    while(isNaN(pDuration)){
      if(isNaN(pDuration)){
        pDuration = prompt("You have not entered a number. Please try again:");
      }
      pDuration = Number(pDuration);
    }
  return pDuration;
}

function ifPC(){ //making sure commit vs planned is only a 1 or 2, otherwise re-entering
  if(planCom <1 || planCom>2){
    planCom = prompt("Please only enter 1 (planned) or 2 (committed):");
  }
  else{
    checkNum = true;
  }
}
/////////////////////////////////--------------//////////////////////////////////

var unit = 3600000; //interval to evenly change between hours - also 
//pseudo month since 12 hour cycle is used for display
var start = unit * (startMonth+6);//*(startMonth+6); //time stamp has weird offset where 7 = 01, 1 = 07....
var end = start + unit * ganttDuration;

var ganArr = [];

function createGantt(){ //populate Gantt Chart per input in prompts 
  for(i = 0; i< arrFull.length; i++){
    ganArr.push(
      {
        label: arrFull[i][0], 
        times: [
          {"color": arrFull[i][4], //could add color in ganArr
          "label":arrFull[i][3], //adding label from ganArr
          "starting_time": start + (unit*arrFull[i][1]),
          "ending_time": start + (unit*arrFull[i][2]),
          }
        ]
      }
    );
  }
}

createGantt();


var width = 800; //changes size of graph


  function ganttChart() {
    var chart = d3.timeline()
      .beginning(start) // we can optionally add beginning and ending times to speed up rendering a little
      .ending(end)
      .stack() // toggles graph stacking
      .showTimeAxisTick() //adds grid tick format
      .margin({left:70, right:30, top:0, bottom:0})
      ;
    var svg = d3.select("#timeline").append("svg").attr("width", width)
      .datum(ganArr).call(chart);
  }

  ganttChart();

}
