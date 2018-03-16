var sel = d3.select('#matrix')
const bbox = sel.node().getBoundingClientRect();
//console.log(bbox);
mmargin = {top: 125, bottom: 30, left: 80, right: 80};
mheight = 720 - mmargin.top - mmargin.bottom;
mwidth = 377.308 - mmargin.right - mmargin.left;
var translation = "translate(" + mmargin.left + "," + mmargin.top + ")"
//var rotation = "rotate(45 " + mwidth/2 + " " + 0 + ")"
var transform = translation 
msvg = d3.select("#matrix")
	.append("svg")
	.attr("class", "matrix-svg")
	.attr("width", mwidth + mmargin.right + mmargin.left)
	.attr("height", mheight + mmargin.top + mmargin.bottom)
	//.attr("transform", rotation);

mg = msvg.append("g")
	.attr("transform", translation)
	
	//.attr("transform", "translate(" + mmargin.left + "," + mmargin.top + ")");

var yearParser = d3.timeParse("%Y");
var yearFormatter = d3.timeFormat("%Y");

d3.queue()
    .defer(d3.csv, "data/mergedcountries.csv", type)
    .await(display);

function display(error,medals) {

	var uniqueYears = d3.map(medals, function(d){return d['Year'];}).keys()
	var uniqueSports = d3.map(medals, function(d){return d['Sport'];}).keys()
	var groupedCountries = d3.nest()
	  	.key(function(d) { return d['Country']; })
	  	.key(function(d) { return d['Year']; })
	  	.entries(medals)
	  	.sort(function(a, b){ return d3.ascending(d3.sum(a.values, function(d) { return d.values.length; }), d3.sum(b.values, function(d) { return d.values.length; })) })
	var uniqueCountries = groupedCountries.map(function(d) { return d['key']; })

	var groupedTotal = d3.nest()
		.key(function(d) { return d['Sport']; })
		.key(function(d) { return d['Year']; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(medals);

	var groupedTotalAll = d3.nest()
		.key(function(d) { return d['Sport']; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(medals);

	groupedTotal = Object.assign(...groupedTotal.map(({key, values}) => {
		return ({ [key]: Object.assign(...values.map(({key, value}) => {
				return ({ [key]: value }) 
			}))
		})
	}));

	groupedTotalAll = Object.assign(...groupedTotalAll.map(({key, value}) => {
		return ({ [key]: value }) 
	}));

	var groupedCountries = d3.nest()
		.key(function(d) { return d['Sport']; })
		.key(function(d) { return d['Country']; })
		.key(function(d) { return d['Year']; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(medals);


	var groupedCountriesAll = d3.nest()
		.key(function(d) { return d['Sport']; })
		.key(function(d) { return d['Country']; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(medals);

	groupedCountries = Object.assign(...groupedCountries.map(({key, values}) => {
		return ({ [key]: Object.assign(...values.map(({key, values}) => {
				return ({ [key]: Object.assign(...values.map(({key, value}) => {
					return ({ [key]: value  }) 
					}))
				})
			}))
		})	
	}));

	groupedCountriesAll = Object.assign(...groupedCountriesAll.map(({key, values}) => {
		return ({ [key]: Object.assign(...values.map(({key, value}) => {
			return ({ [key]: value  }) 
			}))
		})
	}));
	for (var property in groupedCountriesAll) {
	    if (groupedCountriesAll.hasOwnProperty(property)) {
	    	let a = new Set(Object.keys(groupedCountriesAll[property]))
	    	let b = new Set(uniqueCountries)
	    	let c = new Set([...b].filter(x => !a.has(x)));
	    	c.forEach(function(d) {
	    		groupedCountriesAll[property][d] = 0
	    	})
	    }
	}
	uniqueSports.forEach(function(sport) {
		years = groupedCountries[sport];
		uniqueCountries.forEach(function(country) {
			countries = groupedCountries[sport][country]
			uniqueYears.forEach(function(year) {
				if (groupedCountries[sport][country] == null) {
					groupedCountries[sport][country] = {};
				} else if (groupedCountries[sport][country][year] == null) {
					groupedCountries[sport][country][year] = 0;
				} else {
					groupedCountries[sport][country][year] /= groupedTotal[sport][year]
				}

			})

			
		})
	})
	uniqueSports.forEach(function(sport) {
		years = groupedCountriesAll[sport];
		uniqueCountries.forEach(function(country) {
			if (groupedCountriesAll[sport] == null) {
				groupedCountriesAll[sport] = {};
			} else if (groupedCountriesAll[sport][country] == null) {
				groupedCountriesAll[sport][country] = 0;
			} else {
				groupedCountriesAll[sport][country] /= groupedTotalAll[sport]
			}
		})	
	})

	flattened = flattenObject(groupedCountries)
	flattenedAll = flattenObject(groupedCountriesAll);
	
	flattenedobjects = Object.keys(flattened).map(d => {
		//console.log(d);
		return {'year': d, 'share': flattened[d]}
	})

	flattenedobjectsAll = Object.keys(flattenedAll).map(d => {
		//console.log(d);
		return {'year': d, 'share': flattenedAll[d]}
	})


	flattenedobjects = flattenedobjects.filter(d => d['share'] != 0)

	yearScale3 = d3.scaleTime()
  		.domain([yearParser("2014"), yearParser("1924")])
  		.range([0, -100])
	countryScale2 = d3.scaleBand()
		.domain(uniqueCountries)
		.range([mheight, 0])
		.padding(0.1)

	sportScale2 = d3.scaleBand()
		.domain(uniqueSports)
		.range([0, mwidth])
		.padding(0.1)
	var cellSize = 20;

	shareScale = d3.scaleQuantize()
		//.domain([0.00000001, 0.025,0.05,0.1,0.4,0.6])
		.range(['#ffffd9','#a4d7c0','#43aabf','#3377a8','#1e4785','#081d58'])



	mg.append("g")
		.attr("class", "cells")
		.selectAll(".cell")
		.data(flattenedobjectsAll)
		.enter()
		.append("rect")
		.attr("class", function(d) { 
			return "cell"
		})
		.attr("height", countryScale2.bandwidth())
		.attr("width", sportScale2.bandwidth())
		.translate(function(d){ 
			[sport, country] = d['year'].split(".")

			return [sportScale2(sport), countryScale2(country)]
		})
		/*.attr("y", function(d) { 
			[sport, country] = d['year'].split(".")
			return yearScale3(year)
		})*/
		/*.attr("x", function(d) {
			[sport, country] = d['year'].split(".")
			if (year != "1924") {
				return -sportScale2.bandwidth();
			} else {
				return 0;
			}
		})*/
		.attr("fill", function(d) { 
			[sport, country] = d['year'].split(".")
			var values = Object.values(groupedCountriesAll[sport])
			shareScale.domain([0, d3.max(values)])
			return shareScale(d['share'])})
		.on("mouseover", function(d) { 
			data = d
			mouseOverEvents(d,d3.select(this));
		})
		.on('mouseout', function(d) {
			data = d;
			d3.select(this).classed("hover", false);
			mouseOutEvents(d,d3.select(this));
		})
		/*.attr("transform", function(d) {
			[sport, year, country] = d['year'].split(".")
			var translate = "translate(" + sportScale2(sport) + ", " + countryScale2(country) +")"
			var rotate = "rotate(-45)"
			return translate + " " + rotate
		})*/



	countryAxis = d3.axisLeft(countryScale2)
	mg.append("g")
		.attr("class", "country-axis")
		.call(countryAxis)
		.selectAll("text")	
        .style("text-anchor", "end")
        // .attr("dy", "-1em")
        // .attr("dx", "1em")
        // .attr("transform", "rotate(-45)");

	sportAxis = d3.axisTop(sportScale2)
	mg.append("g")
		.attr("class", "sport-axis")
		.call(sportAxis)
		.selectAll("text")	
        .style("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .attr("dy", "1em")
        .attr("dx", "1em")
      	.attr("transform", "rotate(-90)");


	function mouseOverEvents(d) {
		[sport, country] = data['year'].split(".")

		/*d3.selectAll(".cell")
			.classed("unselected", function(d) {
				console.log(d);
				[sport2, country2] = d['year'].split(".")
				if (sport != sport2 || country != country2) {
					return true;
				} 
			})
			.classed("unselected", true);*/
		//d3.select(this).classed("unselected", false)
		/*mg
			.append("g")
			.attr("class", "year-cells")
			.selectAll(".year.cell")
			.data(function() { 
				years = groupedCountries[sport][country]
				flattenedYearObjects = Object.keys(years).map(d => {
		//console.log(d);
		return {'year': d, 'share': years[d]}
	})
				console.log(flattenedYearObjects);
				return flattenedYearObjects;
			})
			.enter()
			.append("rect")
			.attr("class", function(d) { 
				return "year cell"
			})
			.attr("height", 3)
			.attr("width", 13)
			.attr("transform", function(d){ 
				console.log(d)
				transform = "translate(" + (sportScale2(sport)) + ", " + (countryScale2(country))+ ") rotate(135 " + 0 + " " + 0 +")";
				console.log(transform);
				return transform
			})
			.attr("y", function(d) { 
				return yearScale3(yearParser(d['year']))
			})
		
		.attr("fill", function(d) { 
			console.log(groupedCountries)
			var values = Object.values(groupedCountriesAll[sport])
			console.log(values);
			shareScale.domain([0, d3.max(values)])
			return shareScale(d['share'])})*/



		d3.select(".country-axis")
			.selectAll("text")
			.attr("fill", function(d) {
				if (d == country) {
					return "red"
				} else {
					return "black";	
				}
			})
		d3.select(".sport-axis")
			.selectAll("text")
			.attr("fill", function(d) {
				if (d == sport) {
					return "red"
				} else {
					return "black";	
				}
			})


	}

	function mouseOutEvents(d) {
		d3.select(".country-axis")
			.selectAll("text")
			.attr("fill", function(d) {
				return "black";
			})

		d3.select(".sport-axis")
			.selectAll("text")
			.attr("fill", function(d) {
				return "black";
			})

		d3.select(".year-cells")
			.remove()

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