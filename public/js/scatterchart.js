// source
// [0] = day
// [1] = time
// [2] = betvalue
// [3] = account
var data = 
[
  ["0101" , 800  , 08 , "atwt001"] ,
  ["0102" , 1100 , 08 , "atwt002"] ,
  ["0103" , 2300 , 05 , "atwt003"] ,
  ["0104" , 1700 , 10 , "atwt004"] ,
  ["0105" , 2100 , 50 , "atwt005"] ,
  ["0105" , 0000 , 10 , "atwt006"] ,
  ["0106" , 0700 , 10 , "atwt007"]
];

// svg screen setting
var margin = {top: 20, right: 15, bottom: 60, left: 60}
  , width  = 1200 - margin.left - margin.right
  , height = 500  - margin.top  - margin.bottom;

var xRangeList = [0] ;

// cal x.label's offset
for (var k = 0 ; k < data.length ; k++)
{
  xRangeList.push(k * width / data.length + 150)
}

// init x axis
var x = d3.scale.ordinal()
                .domain( ['' , '0101' , '0102' , '0103' , '0104' , '0105' , '0106'])
                .range(xRangeList);
   
// init y axis
var y = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d[1]; })])
                .range([ height, 0 ]);
 
var chart = d3.select('body')
              .append('svg:svg')
              .attr('width'  , width  + margin.right + margin.left)
              .attr('height' , height + margin.top   + margin.bottom)
              .attr('class'  , 'chart')

var main = chart.append('g')
                .attr('transform' , 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('width'     , width)
                .attr('height'    , height)
                .attr('class'     , 'main')   
        
// draw the x axis
var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient('bottom');

// draw the y axis
var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient('left');

main.append('g')
    .attr('transform' , 'translate(0,' + height + ')')
    .attr('class'     , 'main axis date')
    .call(xAxis);

main.append('g')
    .attr('transform' , 'translate(0,0)')
    .attr('class'     , 'main axis date')
    .call(yAxis);

var g = main.append("svg:g"); 
    
// insert data?
var nodes = g.selectAll("g")
             .data(data)
             .enter().append("g");

// random color
var color = d3.scale.category20();

// draw circle
nodes.append("circle")
     .attr("cx"    , function (d , i) { return x(d[0]);    } ) 
     .attr("cy"    , function (d)     { return y(d[1]);    } ) 
     .attr("r"     , function (d)     { return d[2]        } ) 
     //.attr("class" , function (d)     { return "c-" + d[3] })
     .style("fill" , function (d , i) { return color(i);  }) ;

// draw text
nodes.append("text")
     .attr("x"     , function (d) {return x(d[0]);    } )
     .attr("y"     , function (d) {return y(d[1]);    } )
     //.attr("class" , function (d) {return "t-" + d[3] } )
     .style("text-anchor", "middle")
     .text(function (d) {return d[3] });   