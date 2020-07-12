// Load simulation data
var local_data = data;


// Vertical slider
var sliderVertical = d3
    .sliderLeft()
    .min(0)
    .max(1)
    .height(300)
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
    .attr('height', 400)
    .append('g')
    .attr('transform', 'translate(60,30)');

gVertical.call(sliderVertical);

d3.select('p#value-vertical').text(d3.format('.2f')(sliderVertical.value()));

// Cost slider
var sliderCost = d3
    .sliderBottom()
    .min(0)
    .max(150000)
    .width(300)
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
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gCost.call(sliderCost);

d3.select('p#value-cost').text(d3.format('.0f')(sliderCost.value()));

// WTP slider
var sliderWtp = d3
    .sliderBottom()
    .min(0)
    .max(150000)
    .width(300)
    .tickFormat(d3.format('$,.2r'))
    // d3.format("($.2f")
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
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

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

// When the button is changed, run the updateChart function
dropdownButton.on("change", function(d) {

    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")

    // run the updateChart function with this selected option
    // updateChart(selectedOption)
    window.alert(selectedOption);
})


// Plot surface

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 50, left: 80},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));


// Add the text label for the x axis
svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 5) + ")")
    .style("text-anchor", "middle")
    .text("Life-years gained");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 500000])
      .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y)
          .tickFormat(d3.format('$,.2r')));


// Add the text label for the Y axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Cost reduction");

// Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(2.0); } )
      .attr("cy", function (d) { return y(300000); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

// JSON.stringify(local_data[2])
// JSON_VALUES(local_data[2])

// for (x in local_data) {
//     JSON.parse(local_data[x])
// }
//local_data[2]["val"]
