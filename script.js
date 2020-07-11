// Vertical
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

// Cost
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

// Wtp
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
