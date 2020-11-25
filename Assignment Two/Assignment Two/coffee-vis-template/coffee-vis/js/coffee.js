var chart;
var chart2;
var height = 250
var width = 300
//DEFINE YOUR VARIABLES UP HERE
var xScale;
var yScale;
var selection;
var selection2;

//Gets called when the page is loaded.
function init(){
  chart = d3.select('#vis').append('svg').attr("id", "chart1")
              .attr("id", "chart1")
              .style("height", height+50 + 'px');
  vis = chart.append('svg:g');
  chart.append('svg:text');

  //PUT YOUR INIT CODE BELOW
  selection = d3.select("#chart1");
  chart2 = d3.select('#vis').append('svg')
              .attr("id", "chart2")
              .style("height", height+50 + 'px');
  vis = chart2.append('svg:g');
  chart2.append('svg:text');
  selection2 = d3.select("#chart2");

  margin = 50,
  width = width-margin,
  height = height - margin*1.5;
  xScale = d3.scaleBand().range([0, parseInt(width-20)]);
  yScale = d3.scaleLinear().range([parseInt(height-margin/20), 0]);

  //
}

//Called when the update button is clicked
function updateClicked(){
  d3.selectAll("#chart1 > *").remove();
  d3.selectAll("#chart2 > *").remove();
  d3.csv('data/CoffeeData.csv').then(update);

}

//Callback for when data is loaded
function update(rawdata) {

  //PUT YOUR UPDATE CODE BELOW
  var dataReg = d3.nest().key(function (d){
    return d.region;
  })
  .rollup(function (n){
    return d3.sum(n, function(d){
      if (getYSelectedOption() == "sales"){
      return d.sales;
    } else {
      return d.profit;
    }
    });
  }).entries(rawdata);

  var dataCat = d3.nest().key(function (d){
    return d.category;
  })
  .rollup(function (n){
    return d3.sum(n, function(d){
      if (getYSelectedOption() == "sales"){
      return d.sales;
    } else {
      return d.profit;
    }
    });
  }).entries(rawdata);


  var allKeys = ["Central", "East", "South", "West", "Coffee", "Tea", "Espresso", "Herbal Tea"];
  var keysReg = [];
  var valuesReg = [];
  for (var i = 0; i < dataReg.length; i++){
    keysReg.push(dataReg[i].key);
    valuesReg.push(dataReg[i].value);
  }

  var keysCat = [];
  var valuesCat = [];
  for (var i = 0; i < dataCat.length; i++){
    keysCat.push(dataCat[i].key);
    valuesCat.push(dataCat[i].value);
  }


  console.log(keysReg);
  console.log(keysCat);

	xScale.domain(dataReg.map(function(d) { return d.key}));
  yScale.domain([0, d3.max(dataReg, function(d) { return d.value})+(50000-d3.max(dataReg, function(d) { return d.value})%50000)]).nice();

  var colorScheme = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
      .domain(allKeys);

  selection.append("g")
      .attr("transform", "translate(" + 5 + "," + parseInt(height+5) +")")
      .attr("padding", 20)
       .call(d3.axisBottom(xScale))
       .call(g => g.select(".domain").remove());

  selection.append("g")
  .attr("transform", "translate(" + parseInt(width-20) + "," + 5 +")")
       .call(d3.axisRight(yScale));

   selection.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2)
    .attr("y", height + 35)
    .text("Region");

  selection.selectAll("bar")
      .data(dataReg)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.key); })
      .attr("y", function(d) { return yScale(d.value); })
      .attr("width", parseInt(xScale.bandwidth()-5))
      .attr("height", function(d) { return parseInt(height - yScale(d.value)+3); })
      .style("fill", function (d){ console.log(d.key); return colorScheme(d.key) });


  xScale.domain(dataCat.map(function(d) { return d.key}));
  yScale.domain([0, d3.max(dataCat, function(d) { return d.value})+(50000-d3.max(dataCat, function(d) { return d.value})%50000)]).nice();

  colorScheme = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
      .domain(allKeys);

  selection2.append("g")
      .attr("transform", "translate(" + 0 + "," + parseInt(height+5) +")")
      .attr("padding", 20)
       .call(d3.axisBottom(xScale))
       .call(g => g.select(".domain").remove());

  selection2.append("g")
  .attr("transform", "translate(" + parseInt(width-20) + "," + 5 +")")
       .call(d3.axisRight(yScale));

  selection2.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2)
    .attr("y", height +35)
    .text("Category");

  selection2.selectAll("bar")
      .data(dataCat)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.key); })
      .attr("y", function(d) { return yScale(d.value); })
      .attr("width", parseInt(xScale.bandwidth()-5))
      .attr("height", function(d) { return parseInt(height - yScale(d.value)+3); })
      .style("fill", function (d){ console.log(d.key); return colorScheme(d.key) });

}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
// function getXSelectedOption(){
//   var node = d3.select('#xdropdown').node()
//   var i = node.selectedIndex
//   return node[i].value
// }

// Returns the selected option in the X-axis dropdown.
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node()
  var i = node.selectedIndex
  return node[i].value
}
