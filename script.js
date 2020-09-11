// Load simulation data
// var data = mdata;

var holder = d3.select("#text")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 60);

holder.append("text")
    .attr("class", "icer")
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(205,10) rotate(0)");

holder.append("text")
    .attr("class", "ly")
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(530,10) rotate(0)");

holder.append("text")
    .attr("class", "cost")
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(800,10) rotate(0)");

function getCEcolor (icer, wtp) {
    if (icer <= wtp) {
        return "black"
    } else {
        return "red"
    }
}

function updateText(data) {

    holder.select("text.icer")
        .text("ICER: " +
              d3.format('$,.3r')(data.icer) + " (95% CrI " +
              d3.format(',.3r')(data.icer_low) + "−" +
              d3.format(',.3r')(data.icer_high) + ") per life-year")
        .style("fill", getCEcolor(data.icer, sliderWtp.value()))

    holder.select("text.ly")
        .text("Life-years: " +
              d3.format('.1f')(data.ly) + " (95% CrI " +
              d3.format('.1f')(data.ly_low) + "−" +
              d3.format('.1f')(data.ly_high) + ")");

    holder.select("text.cost")
        .text("Cost: " +
              d3.format('$,.3r')(data.cost) + " (95% CrI " +
              d3.format(',.3r')(data.cost_low) + "−" +
              d3.format(',.3r')(data.cost_high) + ")");
}

// https://github.com/johnwalley/d3-simple-slidre
// Pcr slider
var sliderPcr = d3
    .sliderBottom()
    .min(0)
    .max(1)
    .width(600)
    .tickFormat(d3.format('.0%'))
    .ticks(6)
    .step(0.01)
    .default(0.40)
    .fill('#2196f3')
    .on('onchange', val => {
        updateGraph(d3.select("#selectButton").property("value"));
        updateText(getSubData(d3.select("#selectButton").property("value"))[0]);
    });

var gPcr = d3
    .select('div#slider-pcr')
    .append('svg')
    .attr('width', 700)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(30,10)');

gPcr.call(sliderPcr);

// Cost slider
var sliderCost = d3
    .sliderBottom()
    .min(0)
    .max(150000)
    .width(600)
    .tickFormat(d3.format('$,.2r'))
    .ticks(3)
    .step(10000)
    .default(50000)
    .fill('#2196f3')
    .on('onchange', val => {
        updateGraph(d3.select("#selectButton").property("value"));
        updateText(getSubData(d3.select("#selectButton").property("value"))[0]);
    });

var gCost = d3
    .select('div#slider-cost')
    .append('svg')
    .attr('width', 700)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(30,10)');

gCost.call(sliderCost);

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
        updateWTP(sliderWtp.value());
        updateText(getSubData(d3.select("#selectButton").property("value"))[0]);
    });
var gWtp = d3
    .select('div#slider-wtp')
    .append('svg')
    .attr('width', 700)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(30,10)');

gWtp.call(sliderWtp);

// This returns the value of the slider
// sliderWtp.value()

// This creates a div that can be shown from html
// d3.select('p#value-wtp').text(d3.format('.0f')(sliderWtp.value()));

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


function getSubData (sub) {
    for (i in mdata) {
        if (mdata[i]["sub"] == sub) {
            if (mdata[i]["scale"] == "ly") {
                var ly = parseFloat(mdata[i]["val"]) * sliderPcr.value();
                var ly_low = parseFloat(mdata[i]["low"]) * sliderPcr.value();
                var ly_high = parseFloat(mdata[i]["high"]) * sliderPcr.value();
            }
            if (mdata[i]["scale"] == "cost") {
                // costs in mdata are actually cost reduction (e.g. sign & high <-> low fix).
                var cost = - parseFloat(mdata[i]["val"]) * sliderPcr.value() + sliderCost.value();
                var cost_high = - parseFloat(mdata[i]["low"]) * sliderPcr.value() + sliderCost.value();
                var cost_low = - parseFloat(mdata[i]["high"]) * sliderPcr.value() + sliderCost.value();
            }
            var icer = cost / ly;
            var icer_low = cost_low / ly_high;
            var icer_high = cost_high / ly_low;
            var out = [ {ly, ly_low, ly_high, cost, cost_low, cost_high, icer, icer_low, icer_high} ] ;
        }
    }
    return out
}


function updateGraph(sub) {
    dot
        .data(getSubData(sub)) // set the new data
        .transition()
        .duration(100)
        .attr("cx", function(d) { return x(d.ly) })
        .attr("cy", function(d) { return y(d.cost) })
}

function updateWTP(wtp) {
    // update line
    line
        .data([[{x:0, y:0}, {x:5, y:5 * wtp}]])
        .transition()
        .duration(100)
        .attr("d", d3.line()
              .x(function(d) { return x(d.x) })
              .y(function(d) { return y(d.y) }))
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
var margin = {top: 10, right: 20, bottom: 50, left: 120},
    width = 750 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 25) + ")")
    .style("text-anchor", "middle")
    .text("Life-years gained");

// Add Y axis
var y = d3.scaleLinear()
    .domain([-250000, 250000])
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

// Initialize point estimate dot
var dot = svg
    .selectAll('circle')
    // .data(getSubData("HR-,HER2-"))
    .data(getSubData(d3.select("#selectButton").property("value")))
    .enter()
    .append('circle')
    .attr("cx", function(d) { return x(d.ly) })
    .attr("cy", function(d) { return y(d.cost) })
    .attr("r", 7)
    .style("fill", "#69b3a2")

// Initialize wtp line
var line = svg
    .append("path")
    .data([[{x:0, y:0}, {x:5, y:5 * sliderWtp.value()}]])
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
          .x(function(d) { return x(d.x) })
          .y(function(d) { return y(d.y) }))

updateText(getSubData(d3.select("#selectButton").property("value"))[0])
// updateText(getSubData("HR-,HER2-")[0])


// Place holder for CEAC-curves
// https://stackoverflow.com/questions/13728402/what-is-the-difference-d3-datum-vs-data
// data with multiple svgs

// var pgon = svg.selectAll("polygon")
//     .data([poly])
//   .enter().append("polygon")
//     .attr("points",function(d) {
//         return d.map(function(d) {
//             return [scaleX(d.x),scaleY(d.y)].join(",");
//         }).join(" ");
//     })
//     .attr("stroke","black")
//     .attr("stroke-width",2);

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
    updateText(getSubData(selectedOption)[0]);
})
