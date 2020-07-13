// Load simulation data
var data = mdata;

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
    .on('onchange', val => {
        d3.select('p#value-vertical').text(d3.format('.2f')(val));
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
    .on('onchange', val => {
        d3.select('p#value-cost').text(d3.format('.0f')(val));
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
    .on('onchange', val => {
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

d3.select('p#value-wtp').text(d3.format('.0f')(sliderWtp.value()));


// Select subtype

// Create data = list of groups
var allGroup = ["HR-,HER2-", "HR+,HER2-", "HR-,HER2+", "HR+,HER2+"]

// Initialize the button
var dropdownButton = d3.select("#subtype_choice")
  .append('select')

// add the options to the button
dropdownButton // Add a button
  .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
 	.data(allGroup)
  .enter()
	.append('option')
  .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

// // Initialize a circle
// var zeCircle = d3.select("#subtype_choice")
//   .append("svg")
//   .append("circle")
//     .attr("cx", 100)
//     .attr("cy", 70)
//     .attr("stroke", "black")
//     .style("fill", "yellow")
//     .attr("r", 20)

// // A function that update the color of the circle
// function updateChart(mycolor) {
//   zeCircle
//     .transition()
//     .duration(1000)
//     .style("fill", mycolor)
// }

// A function that update the color of the circle
// function updateData(selectedSubtype) {
//     for (x in data) {
//         if (data[x]["sub"] == selectedSubtype) {
//             if (data[x]["scale"] == "ly") {
//                 var ly = parseFloat(data[x]["val"]);
//                 var ly_low = parseFloat(data[x]["low"]);
//                 var ly_high = parseFloat(data[x]["high"]);
//             }
//             if (data[x]["scale"] == "cost") {
//                 // var costs = {cost:parseFloat(data[x]["val"]), cost_low:parseFloat(data[x]["low"]), cost_high:parseFloat(data[x]["high"])};
//                 var cost = parseFloat(data[x]["val"]);
//                 var cost_low = parseFloat(data[x]["low"]);
//                 var cost_high = parseFloat(data[x]["high"]);
//             }
//             var adata = [ {x:2, y:200000}, {x:3, y:90000}, {x:1, y:50000} ];
//             // append vectors
//         }
//     }
//     return adata
// }


// When the button is changed, run the updateChart function
dropdownButton.on("change",function(d) {

    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")

    // run the updateChart function with this selected option
    // updateChart(selectedOption)
    // updateData(selectedOption)

    for (x in data) {
        if (data[x]["sub"] == selectedOption) {
            if (data[x]["scale"] == "ly") {
                var ly = parseFloat(data[x]["val"]);
                var ly_low = parseFloat(data[x]["low"]);
                var ly_high = parseFloat(data[x]["high"]);
            }
            if (data[x]["scale"] == "cost") {
                // var costs = {cost:parseFloat(data[x]["val"]), cost_low:parseFloat(data[x]["low"]), cost_high:parseFloat(data[x]["high"])};
                var cost = parseFloat(data[x]["val"]);
                var cost_low = parseFloat(data[x]["low"]);
                var cost_high = parseFloat(data[x]["high"]);
            }
            // var adata = [ {x:2, y:200000}, {x:3, y:90000}, {x:1, y:50000} ];
            // append vectors
        }
    }
    window.alert(cost);
})



function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];

    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    if (val == "HR+,HER2-") {
        var val = [ {x:2, y:500000}, {x:3, y:90000}, {x:1, y:50000} ];
    } else {
        var val = [ {x:2, y:100000}, {x:3, y:90000}, {x:1, y:50000} ];
    }
    return val; // return value of checked radio or undefined if none checked
}

var val = getRadioVal( document.getElementById('subForm'), 'sub' );
// alert(val);

function updateGraph(sub) {
    if (sub == "HR+,HER2-") {
        var newval = [ {x:2, y:500000}, {x:3, y:90000}, {x:1, y:50000} ];
        window.alert(sub);
    } else {
        var newval = [ {x:2, y:100000}, {x:3, y:90000}, {x:1, y:50000} ];
    }
    dot
        .data(newval) // set the new data
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return x(d.x) })
        .attr("cy", function(d) { return y(d.y) })
}


document.getElementById('subForm').onsubmit = function() {
    // this (keyword) refers to form to which onsubmit attached
    // 'sub' is name of radio button group
    var val = getRadioVal(this, 'sub');
    // display value obtained
    alert(val);
    // more code here ...

    // apply the new data values
    updateGraph(val)
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
    .domain([-500000, 500000])
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

// var adata = [ {x:2, y:200000}, {x:3, y:90000}, {x:1, y:50000} ]

// Add dots
// svg.append('g')
//     .selectAll("dot")
//     .data(getRadioVal( document.getElementById('subForm'), 'sub' ))
//     .enter()
//     .append("circle")
//     .attr("cx", function (d) { return x(d.x); } )
//     .attr("cy", function (d) { return y(d.y); } )
//     .attr("r", 5)
//     .style("fill", "#69b3a2")

// Initialize dots with group a
var dot = svg
    .selectAll('circle')
    .data(val)
    .enter()
    .append('circle')
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("r", 7)
    .style("fill", "#69b3a2")

// When the button is changed, run the updateChart function
// https://www.d3-graph-gallery.com/graph/connectedscatter_select.html
d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateGraph(selectedOption)
})


// var data = mdata;
// for (x in data) {
//     if (data[x]["sub"] == "HR-,HER2-") {
//         if (data[x]["scale"] == "ly") {
//             var ly = parseFloat(data[x]["val"]);
//             var ly_low = parseFloat(data[x]["low"]);
//             var ly_high = parseFloat(data[x]["high"]);
//         }
//         if (data[x]["scale"] == "cost") {
//             var costs = {cost:parseFloat(data[x]["val"]), cost_low:parseFloat(data[x]["low"]), cost_high:parseFloat(data[x]["high"])};
//             // var costs = cost:parseFloat(data[x]["val"]);
//             // var cost_low:parseFloat(data[x]["low"]);
//             // var cost_high:parseFloat(data[x]["high"]);
//         }
//     }
// }


// for (x in data) {
//     if (data[x]["sub"] == "HR-,HER2-") {
//         if (data[x]["scale"] == "ly") {
//             ly = parseFloat(data[x]["val"]);
//             ly_low = parseFloat(data[x]["low"]);
//             ly_high = parseFloat(data[x]["high"]);
//         }
//         if (data[x]["scale"] == "cost") {
//             cost = parseFloat(data[x]["val"]);
//             cost_low = parseFloat(data[x]["low"]);
//             cost_high = parseFloat(data[x]["high"]);
//         }
//     }
// }

// JSON.stringify(local_data[2])
// JSON_VALUES(local_data[2])

// for (x in local_data) {
//     JSON.parse(local_data[x])
// }
//local_data[2]["val"]
// for (x in local_data) {
//     JSON.parse(local_data[x])
// }

// local_data[2]["val"]
