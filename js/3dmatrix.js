var sel = d3.select('#matrix')
const bbox = sel.node().getBoundingClientRect();
console.log(bbox);
mmargin = {top: 100, bottom: 30, left: 80, right: 50};
mheight = 800 - mmargin.top - mmargin.bottom;
mwidth = 380 - mmargin.right - mmargin.left;
console.log(mwidth);
console.log(mheight);
console.log(mmargin);
console.log(mwidth + mmargin.right + mmargin.left)
console.log(mheight + mmargin.top + mmargin.bottom)
var translation = "translate(" + mmargin.left + "," + mmargin.top + ")"
var rotation = "rotate(45 " + mwidth/2 + " " + 0 + ")"
var transform = translation + " " + rotation
msvg = d3.select("#matrix")
	.append("svg")
	.attr("class", "matrix-svg")
	.attr("width", mwidth + mmargin.right + mmargin.left)
	.attr("height", mheight + mmargin.top + mmargin.bottom)
	.attr("transform", rotation);



//var transform = translation;
console.log(transform);
mg = msvg.append("g")
	.attr("transform", translation)
	
	//.attr("transform", "translate(" + mmargin.left + "," + mmargin.top + ")");

var yearParser = d3.timeParse("%Y");
//var yearFormatter = d3.timeFormat("%Y");

d3.queue()
    .defer(d3.csv, "data/mergedcountries.csv", type)
    .await(display);

function display(error,medals) {
	console.log(medals);

	var uniqueYears = d3.map(medals, function(d){return d['Year'];}).keys()
	var uniqueSports = d3.map(medals, function(d){return d['Sport'];}).keys()
	var groupedCountries = d3.nest()
	  	.key(function(d) { return d['Country']; })
	  	.key(function(d) { return d['Year']; })
	  	.entries(medals)
	  	.sort(function(a, b){ return d3.ascending(d3.sum(a.values, function(d) { return d.values.length; }), d3.sum(b.values, function(d) { return d.values.length; })) })
	var uniqueCountries = groupedCountries.map(function(d) { return d['key']; })
	console.log(uniqueCountries);
	console.log(uniqueCountries.length)
	console.log(uniqueSports.length)

	var groupedTotal = d3.nest()
		.key(function(d) { return d['Sport']; })
		.key(function(d) { return d['Year']; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(medals);
	console.log(groupedTotal);

	/*groupedTotal = groupedTotal.map((e) => {
   		return {[e.key]: e.values.map((e) => {
	   		return {[e.key]: e.value};
	   	})
	}});*/
	//console.log(groupedTotal);
	groupedTotal = Object.assign(...groupedTotal.map(({key, values}) => {
		return ({ [key]: Object.assign(...values.map(({key, value}) => {
				return ({ [key]: value }) 
			}))
		})
	}));

	console.log(groupedTotal);
	var groupedCountries = d3.nest()
		.key(function(d) { return d['Sport']; })
		.key(function(d) { return d['Year']; })
		.key(function(d) { return d['Country']; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(medals);

	console.log(groupedCountries);
	groupedCountries = Object.assign(...groupedCountries.map(({key, values}) => {
		return ({ [key]: Object.assign(...values.map(({key, values}) => {
				return ({ [key]: Object.assign(...values.map(({key, value}) => {
					return ({ [key]: value  }) 
					}))
				})
			}))
		})	
	}));
	console.log(groupedCountries);

	uniqueSports.forEach(function(sport) {
		years = groupedCountries[sport];
		uniqueYears.forEach(function(year) {
			countries = groupedCountries[sport][year]
			uniqueCountries.forEach(function(country) {
				if (groupedCountries[sport][year] == null) {
					groupedCountries[sport][year] = {};
				} else if (groupedCountries[sport][year][country] == null) {
					groupedCountries[sport][year][country] = 0;
				} else {
					groupedCountries[sport][year][country] /= groupedTotal[sport][year]
				}

			})

			
		})
	})
	console.log(groupedCountries);
	/*for (var property in groupedCountries) {
	    if (groupedCountries.hasOwnProperty(property)) {
	        for (var property2 in groupedCountries[property]) {
			    if (grouped.hasOwnProperty(property2)) {
			        // do stuff
			    }
			}
		}
	}*/
	flattened = flattenObject(groupedCountries)
	console.log(flattened);
	flattenedobjects = Object.keys(flattened).map(d => {
		//console.log(d);
		return {'year': d, 'share': flattened[d]}
	})
	console.log(flattenedobjects);

	flattenedobjects = flattenedobjects.filter(d => d['share'] != 0)
	console.log(flattenedobjects);

	yearScale3 = d3.scaleTime()
  		.domain([yearParser("1924"), yearParser("2014")])
  		.range([0, 100])
	countryScale2 = d3.scaleBand()
		.domain(uniqueCountries)
		.range([mheight, 0])
		.padding(0.1)
	console.log(uniqueSports);
	console.log(uniqueYears);
	sportScale2 = d3.scaleBand()
		.domain(uniqueSports)
		.range([0, mwidth])
		.padding(0.1)
	var cellSize = 20;
	console.log(chroma.scale(['#fafa6e','#2A4858'])
    .mode('lch').colors(6));
	shareScale = d3.scaleQuantile()
		.domain([0, 0.5])
		.range(chroma.scale(['#fafa6e','#2A4858'])
    .mode('lch').colors(6))


	mg.append("g")
		.attr("class", "cells")
		.selectAll(".cell")
		.data(flattenedobjects)
		.enter()
		.append("rect")
		.attr("class", "cell")
		.attr("height", countryScale2.bandwidth())
		.attr("width", sportScale2.bandwidth())
		.translate(function(d){ 
			[sport, year, country] = d['year'].split(".")

			return [sportScale2(sport), countryScale2(country)]
		})
		/*.attr("y", function(d) { 
			[sport, year, country] = d['year'].split(".")
			return yearScale3(year)
		})*/
		.attr("fill", function(d) { return shareScale(d['share'])})
		.on("mouseover", function(d) { 
			data = d
			mouseOverEvents(d,d3.select(this));
		})
		.on('mouseout', function(d) {
			data = d;
			d3.select(this).classed("hover", false);
			mouseOutEvents(d,d3.select(this));
		})



	countryAxis = d3.axisLeft(countryScale2)
	mg.append("g")
		.attr("class", "country-axis")
		.call(countryAxis)
		.selectAll("text")	
        .style("text-anchor", "end")
        .attr("dy", "-1em")
        .attr("dx", "1em")
        .attr("transform", "rotate(-45)");

	sportAxis = d3.axisTop(sportScale2)
	mg.append("g")
		.attr("class", "sport-axis")
		.call(sportAxis)
		.selectAll("text")	
        .style("text-anchor", "start")
        .attr("transform", "rotate(-45)");


	function mouseOverEvents(d) {
		console.log(d);
	}

	function mouseOutEvents(d) {

	}
}

function type(d) { 
	return d
}

var flattenObject = function(ob) {
	var toReturn = {};
	
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

/*const resizeDb = _.debounce(() => {
  msvg
          .attr('width', width)
          .attr('height', height)
  // myMultiLineChart.resize();
}, 400);

window.addEventListener('resize', () => {
  resizeDb();
});*/