d3.queue()
    .defer(d3.csv, "data/mergedcountries.csv", type)

    .await(display);

function display(error,medals) {
	console.log(medals);
  	smwidth = 350,
  	smheight = 300;
  	smmargin = {top: 35, bottom: 25, right: 5, left: 5}

  	var groupByCountry = d3.nest()
	  	.key(function(d) { return d['Country']; })
	  	.key(function(d) { return d['Year']; })
	  	//.sortKeys(function(a,b) { console.log(a); return a.values.length - b.values.length; })
	  	.sortValues(function(a,b) { return a['Medal Rank'] - b['Medal Rank']; })
	  	.entries(medals)
	  	.sort(function(a, b){ return d3.descending(a.values.length, b.values.length); })
	  	//.sort(function(a, b){ return d3.descending(a.values.length, b.values.length); })

	console.log(groupByCountry)


  	var smsvg = d3.select("#smallmultiples").selectAll("svg")
      	.data(groupByCountry)
    	.enter()
    	.append("svg")
      	.attr("width", smwidth)
      	.attr("height", smheight)
      	.attr("class", "small-multiple")

    var yearParser = d3.timeParse("%Y");

    yearScale2 = d3.scaleTime()
      		.domain([yearParser("1924"), yearParser("2014")])
      		.range([smmargin.left, smwidth-smmargin.right])

    medalColor = d3.scaleOrdinal()
	    .domain([1,2,3])
	    .range(['#FFD700', "#C0C0C0", "#CD7F32"])

	medalScale = d3.scaleLinear()
		.domain([0, 35])
		.range([smheight-smmargin.bottom, smmargin.top])

	years2 = ["1950", "1975", "2000"].map(function(d) { return yearParser(d)});
	console.log(years);
	smsvg.append("g")
			.attr("class", "year-axis")
		     .attr("transform", "translate(0," + (smheight - smmargin.bottom) + ")")
		    .call(d3.axisBottom(yearScale2).tickValues(years2).tickFormat(d3.timeFormat("'" + "%y")));

	console.log(smsvg)
	yearbars = smsvg.append("g")
		.attr("class", "sm-medals")
		.selectAll(".medal")
		.data(function(d) { return d.values})
		.enter()
		.append("g")
		.attr("class", "year-bar")
	
	yearbars.selectAll("sm-medal")
		.data(function(d) { return d.values})
		.enter()
		.append("circle")
		.attr("r", 3)
		.attr("fill", function(d) { return medalColor(d['Medal Rank']) })
		.attr("cx", function(d) { return yearScale2(yearParser(d['Year']))})
		.attr("cy", function(d,i) { return 8*i; })
		.attr("class", "sm-medal")





    	


}