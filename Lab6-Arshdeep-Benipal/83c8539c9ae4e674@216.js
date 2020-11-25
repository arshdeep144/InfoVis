// https://observablehq.com/@arshdeep/lab-6-time-oriented-data@216
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["gapminder.csv",new URL("./files/c3efadd0da84a8ac2299baf18ca945b57e6f4e7a79579ce5c6105675c65c7cf9b36f18aeb79a80320213a8f453c547bbe55499a6e97e829855c7f2465a28e1f7",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Lab 6 - Time-Oriented Data
### PURPOSE
Create an animated visualization of the Gapminder dataset Exercise using marks and channels in D3. Solidify understanding of d3 transitions.

### TASKS
The Gapminder dataset contains economic indicators for countries over the years.

Open *gapminder.csv* with your tool of choice or explore it within the Observable notebook, and familiarize yourself with the dataset attributes.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `
#### 1. Load the dataset
Use ***d3.csv*** to parse the dataset. ***d3.csv***  makes a HTTP GET request to a URL pointing to a csv file, then transforms the file into an array of objects, each of which represents a single row.

Then parse all numerical attributes to Number. ***d3.csv*** assumes all values are strings. This can cause bugs later when you perform calculations.

\`\`\`
    records.forEach(function(record){
    record.year = Number(record.year);
    // continue for all other numerical attributes
    });
\`\`\`

*The code above uses Array’s forEach function. Feel free to write a traditional for loop
instead.*

**Note that this function is asynchronous; that is, the result will be passed to a callback. As a consequence, any code placed after the call will not have access to the
data. Data access is guaranteed only within the callback.**
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `
#### 2. Group the records by year
\`\`\`
    let recordsByYear = {};
    records.forEach(function(record){
        let year = record.year;
        if (recordsByYear[year] == undefined){
            recordsByYear[year] = [];
        }
        recordsByYear[year].push(record);
    });
\`\`\`

*The code above uses Array’s forEach function. Feel free to write a traditional for loop
instead.*

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `
#### 3. Create a function that displays Life Expectancy vs GDP per Capita for an array of records. The size of a data point should be proportional to Population. The colour should encode Continent.

##### 3.1 Create a function with the following structure.
\`\`\`
    function plot(records){


    }
\`\`\`

##### 3.2 Create scales for every mapping of continuous attributes (life expectancy to y position, GDP per capita to x position, population to radius).
\`\`\`
    var yScale = d3.scaleLinear()
        .domain(d3.extent(records, function(record){
            return record.lifexp;
        }))
        .range([450, 20]);

    // yScale(records[0].lifexp) // testing the scale
\`\`\`

It’s a good idea to use a Log scale for population. For x and y, use ***d3.scaleLinear***.

*Many examples containing scales and selections can be found in the [first d3 intro lecture](http://vialab-collins.science.uoit.ca/d3-intro-one/). D3 scales are also well documented [here](https://github.com/d3/d3-scale).*

##### 3.3 Create an ordinal scale for color (which will encode continent). This scale is different from the others because both the domain and range are discrete.
\`\`\`
    d3.scaleOrdinal()
        .domain(arrayOfDistinctContinentValues) // e.g. [“Africa”,...]
        .range(arrayOfColors); // one colour for each continent
\`\`\`

*To easily extract the distinct values of an array, you can pass the array to Set, then back to Array with the spread operator (...). Of course, you can accomplish this in many other different ways.*

\`\`\`
    var arr = new Set([1,1,1,1,1,2,4,4,5]);
    var uniq = [...arr]; // [1,2,4,5]
\`\`\`

##### 3.4 Create and/or Update and/or Remove elements.
index.html has an SVG element already defined. Select this element, then select all circles inside it and bind the records to it. Store this selection in a variable.

***The highlighted variables or values below should be replaced with the name of the appropriate variables.***
\`\`\`
    var selection = d3.select(‘svg’)
        .selectAll(‘element’)
        .data(dataArray);
\`\`\`

Use the enter selection to create elements, if needed:
\`\`\`
    selection.enter()
        .append(‘element’)
        .attr(‘attrName’, function(d){ return aScale(d.anAttribute); });
        // chain .attr calls until you have set all attributes
        // call .style if you need to set a CSS attribute
\`\`\`

Remove elements when needed
\`\`\`
    selection.exit().remove();
\`\`\`
With the code blocks above, our plot function will treat every possible case. When called
the first time (e.g., for the first year, 1960), the block using selection.enter will make sure
new DOM elements are created.
When called a second time (e.g., for the next year, 1961), the update block will ensure
the existing elements (created in the first call) are repositioned and resized. The enter
selection will ensure new elements are created, if this time the array of records is larger
(e.g., there’s a new country), and the exit selection will remove elements if the new
array is shorter (e.g, a country disappeared, as it happened with USSR).

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `
#### 4. Create axes
In D3, axes are created from scales:
\`\`\`
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);
\`\`\`

This is very convenient because the scales are already defined.
The axis is then formed by creating an SVG group and calling the axis on the corresponding selection.

\`\`\`
    d3.select('svg')
        .append("g")
        .attr("transform", “translate(30,0)")
        .call(yAxis);
\`\`\`

In the code above, yAxis will “create itself” inside the SVG group (“g element”). It knows
the proper axis values from the scale we passed at creation time. Note the transform
attribute. It sets the offset of the axis.

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `
#### 5. Call plot(recordsByYear[1960]) from your d3.csv callback function.
This should display a scatterplot.

#### BONUS TASK - ANIMATE THE PLOT ACROSS THE YEARS
Animations in d3 are called transitions. Any attribute set on a transition is interpolated
from the old value to the new over a defined duration, and after a defined delay *(0 by default)*. For instance, in the code below, all elements under the transition will transition smoothly to the new position we set:

\`\`\`
    circles.transition()
        .attr(‘cx’, function(d){ calculate and return new value });
\`\`\`

Most of the time, all we need to do is add a call to ***.transition()*** before the calls to ***.attr()***.
Additionally, in order to animate yearly changes in the Gapminder data, we need to
make repeated calls to plot, one for each year. These calls should be chained so that a call for year 1974, for instance, only occurs after the transition for year 1973 has finished.

** Fortunately, d3.transition triggers an event when a transition ends. We can listen
to this event; when it is fired, we know it is time to plot the next year. However,
there is a catch: the event is fired for every element of a selection. We will only
know when all elements have finished if we count the events. The skeleton goes
like this: **
\`\`\`
    var counter = data.length; // in our case, this is 83 (countries)
    selection.transition()
        .attr(...)
        .attr(...)
        .on(‘end’, function(){ // this function is called upon ‘end’
            counter -= 1;
            if (counter == 0) { // if animation ended for all elements
                // increment year (you may want to have year as a global)
                // call plot(recordsByYear[newYear])
            }
        });
\`\`\`
If you want want to make the function plot agnostic of application state (that’s good
design), you can require a callback:
\`\`\`
    function plot(records, callback){...}
\`\`\`
Then instead of calling plot when the transition ends, you call back the supplied function.

### SUBMISSION
1. Download the code by clicking the menu button at the top of the page, and enable link sharing.
2. Rename the downloaded code zip folder to *Lab6-firstName-lastName.zip*, and submit the file with your published observable link to the BlackBoard dropbox.
`
)});
  main.variable(observer()).define(["html"], function(html){return(
html
`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
   <h3 style="margin-left: 30%;
    text-decoration: underline;">Lab 6 - Time-Oriented Data</h3>
   <svg width="700" height="500"></svg>
</body>
</html>
`
)});
  main.variable(observer("csvUrl")).define("csvUrl", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("gapminder.csv").url()
)});
  main.variable(observer()).define(["d3","csvUrl"], function(d3,csvUrl){return(
d3.csv(csvUrl).then(function(records){
  // Any code that relies on data goes here.  
  records.forEach(function(record){
    record.year = Number(record.year);
    record.gdpcap = Number(record.gdpcap);
    record.lifexp = Number(record.lifexp);
    record.pop = Number(record.pop);
    // continue for all other numerical attributes
    });
  let recordsByYear = {};
  records.forEach(function(record){
    let year = record.year;
    if (recordsByYear[year] == undefined){
        recordsByYear[year] = [];
    }
    recordsByYear[year].push(record);
  })
   function plot(records){ 

     var yScale = d3.scaleLinear()
     .domain(d3.extent(records, function(record){
       return record.lifexp;
     })).range([450, 20]);
     
     var xScale = d3.scaleLinear()
     .domain(d3.extent(records, function(record){
       return record.gdpcap;
   })).range([20, 450]);
     
     var pop = d3.scaleLog()
     .domain(d3.extent(records, function(record){
       return record.pop
     }));
     
     var yAxis = d3.axisLeft(yScale);
     var xAxis = d3.axisBottom(xScale);
     d3.select("svg").append("g")
        .attr("transform", "translate(30,0)")
        .call(yAxis); 
     
     d3.select("svg").append("g")
      .attr("transform", "translate(30,450)")
      .call(xAxis);
     
     var dots = d3.select("svg").selectAll(".dot")
     .data(records)
     .enter().append("circle")
     .attr("class", "dot")
     .attr("r", function(record){ return pop(record.pop) * 10})
     .attr("cx", function(record){ return xScale(record.gdpcap)})
     .attr("cy", function(record){ return yScale(record.lifexp)});
     
     dots.exit().remove();
   }
 
  plot(recordsByYear[1960])
})
)});
  main.variable(observer("csvData")).define("csvData", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("gapminder.csv").text()
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("records")).define("records", ["csvData"], function(csvData){return(
csvData
)});
  return main;
}
