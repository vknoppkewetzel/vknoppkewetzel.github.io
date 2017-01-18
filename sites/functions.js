window.onload = function() {
var arrFull = []; 
var committed = "rgba(176, 226, 179, .5)";
var planned = "rgba(241, 199, 136, .5)";
var estimateColor  = "rgba(225, 199, 225, .5)";


d3.csv("/dummy_sheet.csv", function(dataSheet) {
  
  dataSheet.forEach(function(d) {
    d.partner = d.partner,
    d.start_d = d.start_d,
    d.end_d = d.end_d,
    d. s_month = +d.s_month,
    d.duration = +d.duration,
    d.planned = d.planned,
    d.committed = d.committed,
    d.ganttDuration = +d.gDuration,
    d.estimate = +d.estimate;
    d.startYear = +d.startYear,
    d.startMonth = +d.startMonth,
    d.title = d.title
  });
  arrayTest = dataSheet;
  var ganttArr = [];
  var ganttDuration = arrayTest[0].ganttDuration;
  var startYear = arrayTest[0].startYear;
  var title = arrayTest[0].title;
  var startMonth = arrayTest[0].startMonth;
  var unit = 3600000; //interval to evenly change between hours - also 
  var width = 800; //changes size of graph
  var start = unit * (startMonth+5);//*(startMonth+6); //time stamp has weird offset where 7 = 01, 1 = 07....
  var end = start + unit * ganttDuration;
  var remainder = (ganttDuration%12); //total of remainder months/units
  var lastRem = remainder - (13-startMonth); // 13 for offset // creating to check if end of year has remainder months
    var years = { //set up years object so Years are in one row only
    label: "Years",
    times: [ 
    ]
  };

  console.log(startMonth);

  document.getElementById("title").textContent = title;

  printArray();
  ganttArr = createGantt(start,unit);
 
  var years = createYears(years, ganttDuration, remainder, startMonth, lastRem, startYear, unit, start);
  
  ganttArr.push(years); //pushing years content into ganArr so can be created below


  ganttChart(startMonth, unit, ganttDuration, width, start, end, ganttArr);
});


function printArray(){
  var partner;
  var startDate;
  var endDate;
  var startDuration;
  var pDuration;
  var plannedCSV;
  var committedCSV;
  var planCom;
  var funding;
  var estimate;



  for(i=0; i<arrayTest.length; i++){
   
    partner = arrayTest[i].partner;
    startDate = arrayTest[i].start_d;
    endDate = arrayTest[i].end_d;
    startDuration = arrayTest[i].s_month;
    pDuration = arrayTest[i].duration;
    plannedCSV = arrayTest[i].planned;
    committedCSV = arrayTest[i].committed;
    estimate = arrayTest[i].estimate;


    if (plannedCSV == 0){
      funding = committedCSV;
      planCom = committed;
    }

    if (committedCSV == 0){
      funding = plannedCSV;
      planCom = planned;
    }
    if (estimate == 1){
      planCom = estimateColor;
    }

  arrFull.push([partner, startDuration, pDuration, funding, planCom]);
  }

  
}


function createGantt(start, unit){ //populate Gantt Chart per input in prompts 
  var ganArr = [];
  for(i = 0; i< arrFull.length; i++){
    ganArr.push(
      {
        label: arrFull[i][0], 
        times: [
          {"color": arrFull[i][4], //could add color in ganArr
          "label":arrFull[i][3], //adding label from ganArr
          "starting_time": start + (unit*arrFull[i][1]),
          "ending_time": start + (unit*arrFull[i][1]) + (unit*arrFull[i][2]),
          }
        ]
      }
    );
    
  }
  return ganArr;
}

function createYears(years, ganttDuration, remainder, startMonth, lastRem, startYear, unit, start){ //cycling through period to add years in
  var period = (ganttDuration - remainder)/12; //find how many years needed to label
  var addRem =  (12-startMonth); //adjusting remainder for start, plus +1 for offset

//////below is for loop that checks what situation the loop is in, and adds year label accordingly////
  for(i = 0; i <= period; i++){
    if(i == 0){
      years.times.push(
      {"color":"white", 
      "label":startYear+i, 
      "starting_time": start  + (unit *(12*i)),
      "ending_time": start  + (unit *(12*i)),
      }
      );
     }else{
      years.times.push(
        {"color":"white", 
        "label":startYear+i, 
        "starting_time": start + unit +addRem*unit + (unit *(12*(i-1))),//subtracting one b/c of offset
        "ending_time": start + unit + addRem*unit + (unit *(12*(i-1))),
        }
      );
    }
    if(i == period && lastRem >= 4 ){ //checking because sometimes remainder causes another year to still be on calendar
      years.times.push(
        {"color":"white", 
        "label":startYear+i+1, 
        "starting_time": start + unit +addRem*unit + (unit *(12*(i))),
        "ending_time": start + unit + addRem*unit + (unit *(12*(i))),
        }
      );
    }
    // if(i == period && lastRem < 4 ){
    //   console.log("hello this is last rem less than");
    // }
  
  }
  return years;
}



  function ganttChart(startMonth, unit, ganttDuration, width, start, end, ganArr) {
    
    var chart = d3.timeline()
      .beginning(start) // start/end of graph
      .ending(end)
      .stack() // toggles graph stacking
      .showTimeAxisTick() //adds grid tick format
      .margin({left:70, right:30, top:0, bottom:0})
      ;
    var svg = d3.select("#timeline").append("svg").attr("width", width)
      .datum(ganArr).call(chart);
  }

  //ganttChart();

}
