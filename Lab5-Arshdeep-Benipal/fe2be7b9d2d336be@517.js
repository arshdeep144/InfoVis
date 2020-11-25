// https://observablehq.com/d/fe2be7b9d2d336be@517
import define1 from "./b2bbebd2f186ed03@929.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`
# Lab 5 - Filtering
### PURPOSE
Enhance a static visualization by implementing interactive filtering controls. Exercise
implementing dynamic behaviour with D3’s enter and exit selections. 

### TASKS
In this lab you are given a static visualization of the Diamonds dataset that depicts the
relation between diamond price and carat in a scatterplot. You are asked to make this
visualization interactive by implementing filtering functionality. 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md 
`
Note the structure of the document. You will find a range slider for the continuous attribute price, and a set of checkboxes for the ordinal attribute cut. Price is mapped to vertical position in the scatterplot, while cut
is mapped to color.

**For the purposes of this lab, you do not need to edit the CSS or the HTML structure of
the page.** 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md
`
### 1. Upon loading the data, set the correct minimum and maximum values for the range slider.

The range slider is initialized with the *minPrice* and *maxPrice* variables declared below. Update the price slider values to match the correct minimum and maximum prices in data. 

**Remember you can use d3.min, d3.max, and d3.extent to get an array’s extrema.
Array’s map function may be useful**. 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md 
`
#### 2. Filter the data and update the display whenever a slide event is triggered.

You can choose among many filtering strategies. A basic strategy is to keep two arrays:
one with all records and other with the filtered data. When a filter changes, the second
array is overridden with the result of calling Array.filter on the first.
Once you have the filtered array, bind it to your D3 selection. Make sure you remove
extra elements, which are stored in the exit selection. And create new elements, which
are accessible under the enter selection.


**If you need to refresh your understanding of D3 selections, [check out this jsfiddle](https://jsfiddle.net/rafa_veras/qj4k7agz/), which
makes use of D3 enter, exit, and update; or [read this](https://bost.ocks.org/mike/join/) concise explanation by D3’s
author Mike Bostock. **
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md 
`
#### 3. Filter the data and update the display when a checkbox event is triggered.


The filters *Price and Cut* should work together. That is, if an unchecked box is
checked, then only the records that correspond to that box AND lie within the currently
selected price range should enter the display. Likewise, when the slider is changed, 
data records should not enter the display if they have a cut value that is not selected in
the cut filter. 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md
`
#### 4. Update the scale and axis.

The price axis should respond to changes in the filter. In D3, axes are created from
scales:

\`\`\`
var yAxis = d3.axisLeft(yScale);
\`\`\`

This is very convenient because the yScale is probably already defined (it was needed
to determine the vertical position of points).
The axis is then drawn by creating an SVG group and calling the axis on the
corresponding selection.

\`\`\`
d3.select('svg')
 .append("g")
 .attr("transform", "translate(40,0)")
 .call(yAxis);
\`\`\`
In the code above, yAxis will “create itself” inside the SVG group (“g element”). It knows
the proper axis values from the scale we passed at creation time.
In order to update the axis, you just need to recreate the scale with the new data, then
empty the SVG group that wraps the old axis, and repeat the axis creation calls. 

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md
`
### SUBMISSION INSTRUCTIONS
 1. Download the code by clicking the menu button at the top of the page, and enable link-sharing.
 2. Rename the downloaded code zip folder to *Lab4-firstName-lastName.zip*, and submit the file with your **published observable link** to the BlackBoard dropbox.

`
)});
  main.variable(observer("unfiltereddata")).define("unfiltereddata", ["d3"], function(d3){return(
d3.csv("https://raw.githubusercontent.com/rafaveguim/toy-datasets/master/diamonds.tsv", d3.autoType)
)});
  main.variable(observer("data")).define("data", ["unfiltereddata"], function(unfiltereddata){return(
unfiltereddata.filter((d,i) => i % 25 ==0)
)});
  main.variable(observer("viewof priceSlider")).define("viewof priceSlider", ["rangeSlider","minPrice","maxPrice"], function(rangeSlider,minPrice,maxPrice){return(
rangeSlider({
  min: minPrice,
  max: maxPrice,
  value: this ? this.value : [minPrice, maxPrice], // Default value
  format: ("$"),
  color: '#3b99fc',
  title: 'Price',
})
)});
  main.variable(observer("priceSlider")).define("priceSlider", ["Generators", "viewof priceSlider"], (G, _) => G.input(_));
  main.variable(observer()).define(["html"], function(html){return(
html `
<style>
  g            { stroke: white; }
  g path       { stroke: white }
  .tick line   { stroke: #fff; }
  circle       { opacity: .5; }
  }
</style>

<div>
  <div id="filters" style="font-family: sans-serif; font-size:9pt;">
    <div id="cut-filter" class="categorical-filter">
      <div class="title" style="font: 700 0.9rem sans-serif;">
        <p>Cut</p>
      </div>
      <div>
        <input type="checkbox" class="box" checked id="fair" value="Fair"><label>Fair</label><br>
        <input type="checkbox" class="box" checked id="good" value="Good"><label>Good</label><br>
        <input type="checkbox" class="box" checked id="vgood" value="Very Good"><label>Very Good</label><br>
        <input type="checkbox" class="box" checked id="prem" value="Premium"><label>Premium</label><br>
        <input type="checkbox" class="box" checked id="ideal" value="Ideal"><label>Ideal</label><br>
      </div>
    </div>

  </div>

  <div id="vis-wrapper" style="background-color: #212831; margin-top: 10px; padding-top: 10px;">
    <svg id="vis"></svg>
  </div>
</div>
`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","data","xScale","yScale","colorScale","d3Legend","update"], function(d3,width,height,xAxis,yAxis,data,xScale,yScale,colorScale,d3Legend,update)
{
  const svg = d3.selectAll("#vis")
      .attr("viewBox", [0, 0, width, height])
  
  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  var circles = svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle');
  
  circles.attr('cx', (d) => xScale(+d.carat))
         .attr('cy', (d) => yScale(+d.price))
         .attr('r', 1)
         .attr('fill', (d) => colorScale(d.cut));
  
  var legend = d3Legend
      .legendColor()
      .scale(colorScale)
  
  svg.append("g")
  .attr("class", "legend")
  .style('font-size', 12)
  .style('font-family', 'sans-serif')
  .attr("transform", "translate(50,20)")
  .call(legend)
  
  update()
  
  return svg.node();
}
);
  main.variable(observer("temp")).define("temp", ["d3"], function(d3){return(
function(look){
  return [d3.selectAll("#fair").property("checked"),d3.selectAll("#good").property("checked"),d3.selectAll("#vgood").property("checked"),d3.selectAll("#prem").property("checked"),d3.selectAll("#ideal").property("checked")][["Fair", "Good", "Very Good", "Premium", "Ideal"].indexOf(look)];
}
)});
  main.variable(observer()).define(["data","priceSlider"], function(data,priceSlider){return(
data.filter((row)=>
                     row.price>=priceSlider[0] &&
                     row.price<=priceSlider[1]
                    )
)});
  main.variable(observer()).define(["data","priceSlider","temp"], function(data,priceSlider,temp){return(
data.filter((row)=>
                     row.price>=priceSlider[0] &&
                     row.price<=priceSlider[1]
                    ).filter((row)=>temp(row.cut))
)});
  main.variable(observer("svg")).define("svg", ["d3","width","height"], function(d3,width,height){return(
d3.selectAll("#vis")
      .attr("viewBox", [0, 0, width, height])
)});
  main.variable(observer("update")).define("update", ["d3","svg","data","priceSlider","temp","xScale","yScale","colorScale","xAxis","yAxis"], function(d3,svg,data,priceSlider,temp,xScale,yScale,colorScale,xAxis,yAxis){return(
function() {
  d3.selectAll("svg > *").remove()
  svg.selectAll('circle').data(data.filter((row)=>
                     row.price>=priceSlider[0] &&
                     row.price<=priceSlider[1]
                    ).filter((row)=>temp(row.cut)))
    .join('circle')
       .attr('cx', (d) => xScale(+d.carat))
       .attr('cy', (d) => yScale(+d.price))
       .attr('r', 1)
       .attr('fill', (d) => colorScale(d.cut));

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);
    
}
)});
  main.variable(observer()).define(["d3","update"], function(d3,update){return(
d3.selectAll(".range-slider").on("click", update)
)});
  main.variable(observer()).define(["d3","update"], function(d3,update){return(
d3.selectAll(".box").on("click", update)
)});
  main.variable(observer("minPrice")).define("minPrice", ["d3","data"], function(d3,data){return(
d3.min(data,d =>d.price)
)});
  main.variable(observer("maxPrice")).define("maxPrice", ["d3","data"], function(d3,data){return(
d3.max(data,d =>d.price)
)});
  main.variable(observer("xScale")).define("xScale", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.carat)).nice()
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("yScale")).define("yScale", ["d3","data","priceSlider","temp","height","margin"], function(d3,data,priceSlider,temp,height,margin){return(
d3.scaleLinear()
    .domain(d3.extent(data.filter((row)=>
                     row.price>=priceSlider[0] &&
                     row.price<=priceSlider[1]
                    ).filter((row)=>temp(row.cut)), d => d.price)).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","xScale","width"], function(height,margin,d3,xScale,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(width / 80))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","yScale"], function(margin,d3,yScale){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale))
)});
  main.variable(observer("colorScale")).define("colorScale", ["d3"], function(d3){return(
d3.scaleOrdinal()
    .domain(["Fair", "Good", "Very Good", "Premium", "Ideal"])
    .range(["#E67838", "#DB9B19", "#BDBE18", "#8DDD4B", "#23F990"])
)});
  main.variable(observer("shape")).define("shape", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(data.map(d => d.category), d3.symbols.map(s => d3.symbol().type(s)()))
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 25, right: 20, bottom: 35, left: 40}
)});
  main.variable(observer("height")).define("height", function(){return(
330
)});
  main.variable(observer("width")).define("width", function(){return(
1050
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  main.variable(observer("d3Legend")).define("d3Legend", ["require"], function(require){return(
require('d3-svg-legend')
)});
  const child1 = runtime.module(define1);
  main.import("rangeSlider", child1);
  return main;
}
