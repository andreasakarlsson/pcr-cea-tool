// Load simulation data
// var data = mdata;

// https://github.com/johnwalley/d3-simple-slidre
// Vertical slider
var sliderVertical = d3
    .sliderLeft()
    .min(0)
    .max(1)
    .height(700)
    .tickFormat(d3.format('.0%'))
    .ticks(6)
    .step(0.01)
    .default(0.40)
    .fill('#2196f3')
    // https://github.com/johnwalley/d3-simple-slider
    .on('end', val => {
        d3.select('p#value-vertical').text(d3.format('.2f')(val));
        updateGraph(d3.select("#selectButton").property("value"));
    });

var gVertical = d3
    .select('div#slider-vertical')
    .append('svg')
    .attr('width', 100)
    .attr('height', 800)
    .append('g')
    .attr('transform', 'translate(70,30)');

gVertical.call(sliderVertical);

d3.select('p#value-vertical').text(d3.format('.2f')(sliderVertical.value()));

// Cost slider
var sliderCost = d3
    .sliderBottom()
    .min(0)
    .max(150000)
    .width(600)
    .tickFormat(d3.format('$,.2r'))
    // d3.format("($.2f")
    .ticks(3)
    .step(10000)
    .default(50000)
    .fill('#2196f3')
    .on('end', val => {
        d3.select('p#value-cost').text(d3.format('.0f')(val));
        updateGraph(d3.select("#selectButton").property("value"));
    });
var gCost = d3
    .select('div#slider-cost')
    .append('svg')
    .attr('width', 700)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,10)');

gCost.call(sliderCost);

d3.select('p#value-cost').text(d3.format('.0f')(sliderCost.value()));

// WTP slider
var sliderWtp = d3
    .sliderBottom()
    .min(0)
    .max(150000)
    .width(600)
    .tickFormat(d3.format('$,.2r'))
    .ticks(3)
    .step(10000)
    .default(100000)
    .fill('#2196f3')
    .on('end', val => {
        d3.select('p#value-wtp').text(d3.format('.0f')(val));
    });
var gWtp = d3
    .select('div#slider-wtp')
    .append('svg')
    .attr('width', 700)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,10)');

gWtp.call(sliderWtp);

// This returns the value of the slider
sliderWtp.value()

// This creates a div that can be shown from html
d3.select('p#value-wtp').text(d3.format('.0f')(sliderWtp.value()));

// // poor mans error bars
// var errorBarArea = d3.svg.area()
//     .x(function(d) {return x(d.state); })
//     .y0(function(d) {return y(d.value - d.moe); })
//     .y1(function(d) {return y(d.value + d.moe); })
//     .interpolate("linear");

// var errorBarSVG = d3.select("body").append("svg")

// var errorBars = errorBarSVG.selectAll("path")
//          .data(data);

// errorBars.enter().append("path");

// errorBars.attr("d", function(d){return errorBarArea([d]);})
//              //turn the data into a one-element array
//              //and pass it to the area function
//     .attr("stroke", "red")
//     .attr("stroke-width", 1.5);

// Select subtype
// function getSubData (sub) {
//     for (i in mdata) {
//         if (mdata[i]["sub"] == sub) {
//             if (mdata[i]["scale"] == "ly") {
//                 var ly = parseFloat(mdata[i]["val"]);
//                 var ly_low = parseFloat(mdata[i]["low"]);
//                 var ly_high = parseFloat(mdata[i]["high"]);
//             }
//             if (mdata[i]["scale"] == "cost") {
//                 // var costs = {cost:parseFloat(mdata[i]["val"]), cost_low:parseFloat(mdata[i]["low"]), cost_high:parseFloat(mdata[i]["high"])};
//                 var cost = parseFloat(mdata[i]["val"]);
//                 var cost_low = parseFloat(mdata[i]["low"]);
//                 var cost_high = parseFloat(mdata[i]["high"]);
//             }
//             var out = [ {ly, ly_low, ly_high, cost, cost_low, cost_high} ];
//             // append vectors
//         }
//     }
//     return out
// }


function getSubData (sub) {
    for (i in mdata) {
        if (mdata[i]["sub"] == sub) {
            if (mdata[i]["scale"] == "ly") {
                var ly = parseFloat(mdata[i]["val"]) * sliderVertical.value();
                var ly_low = parseFloat(mdata[i]["low"]) * sliderVertical.value();
                var ly_high = parseFloat(mdata[i]["high"]) * sliderVertical.value();
            }
            if (mdata[i]["scale"] == "cost") {
                // var costs = {cost:parseFloat(mdata[i]["val"]), cost_low:parseFloat(mdata[i]["low"]), cost_high:parseFloat(mdata[i]["high"])};
                var cost = parseFloat(mdata[i]["val"]) * sliderVertical.value() - sliderCost.value();
                var cost_low = parseFloat(mdata[i]["low"]) * sliderVertical.value() - sliderCost.value();
                var cost_high = parseFloat(mdata[i]["high"]) * sliderVertical.value() - sliderCost.value();
            }
            var out = [ {ly, ly_low, ly_high, cost, cost_low, cost_high} ] ;
            // append vectors
        }
    }
    return out
}


function updateGraph(sub) {
    dot
        .data(getSubData(sub)) // set the new data
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return x(d.ly) })
        .attr("cy", function(d) { return y(-d.cost) })
}

function updateWTP(wtp) {
    line
        .transition()
        .duration(1000)
        .attr("y2", wtp * 5)
}

// List of groups (here I have one group per column)
var allGroup = ["HR-,HER2-", "HR+,HER2-", "HR-,HER2+", "HR+,HER2+"]

// add the options to the button
d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

// Plot surface

// set the dimensions and margins of the graph
var margin = {top: 50, right: 20, bottom: 100, left: 120},
    width = 700 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

 // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 5])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height / 2 + ")")
    .call(d3.axisBottom(x));


// Add the text label for the x axis
svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 70) + ")")
    .style("text-anchor", "middle")
    .text("Life-years gained");

// Add Y axis
var y = d3.scaleLinear()
    .domain([-300000, 300000])
      .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y)
          .tickFormat(d3.format('$,.2r')));


// Add the text label for the Y axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Cost difference");

// Initialize dots with group a
var dot = svg
    .selectAll('circle')
    .data(getSubData("HR-,HER2-"))
    .enter()
    .append('circle')
    .attr("cx", function(d) { return x(d.ly) })
    .attr("cy", function(d) { return y(-d.cost) })
    .attr("r", 7)
    .style("fill", "#69b3a2")


//Draw the line
var line = svg.append('line')
    .style("stroke", "blue")
    .style("stroke-width", 0.02)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", sliderWtp.value() * 5)
    .attr("transform", "translate(0," + height / 2 + "), scale(" + width / 5 + "," + -height / 600000 + ")")

// .selectAll('line')
    // .enter()
    // .transition()
    // .duration(1000)
    // .attr("x1", 0)
    // .attr("y1", 0)
    // .attr("x2", 1000)
    // .attr("y2", 10000)
    // .style("stroke", "lightgreen")
    // .style("stroke-width", 50)


// const line = d3.line()
//     .x(function(d) { return xScale(d.date); })
//     .y(function(d) { return yScale(d.measurement); });

// let id = 0;
// const ids = function () {
//     return "line-"+id++;
// }

// var linedata = [{x:0, y:0}, {x:5, y:200000}];


// var line = svg.append("path")
//     .data(linedata)
//     .attr("fill", "none")
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 1.5)
//     .attr("d", d3.line()
//           .x(function(d) { return x(d.x) })
//           .y(function(d) { return y(d.y) })
//          )
// svg.append('line')
//     .style("stroke", "lightgreen")
//     .style("stroke-width", 2)
//     .attr("x2", 3* 100)
//     .attr("y2", 300);



  // var eb = errorBar()
  //         .oldXScale(x)
  //         .xScale(x)
  //         .oldYScale(y)
  //         .yScale(y)
  //         .yValue(function(d){return d.cost})
  //         .xValue(function(d){return d.ly})
  //         .xError(function(d){return d.ly_high - d.ly_low})
  //         .yError(function(d){return null});

// When the button is changed, run the updateChart function
// https://www.d3-graph-gallery.com/graph/connectedscatter_select.html
d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    // alert(d3.select(this));
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateGraph(selectedOption)
})

// d3.select("#slider-wtp").on("drag".)

// selection.on("drag", function() {
//   dispatch.apply("custom", this, arguments);
// });


// d3.select("#slider-wtp").onchange(function(d) {
//     // recover the option that has been chosen
//     // alert(d3.select(this));
//     gWtp.call(sliderWtp)
//     // run the updateChart function with this selected option
//     updateWTP(sliderWtp.value())
// })



// d3.selectAll(".global-control")
//   .on("change.pie", changePieValue)

// function changePieValue(_ctrl){
//   var ctrlValue = _ctrl.grabYourValueHere;
//   pieChart.readjustPie(_ctrlValue);
//   d3.select('#pie-chart-container1')
//     .call(pieChart)
// }
