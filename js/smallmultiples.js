var smwidth = 350,
smheight = 325;
smmargin = {top: 25, bottom: 25, right: 5, left: 5}


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

medaltooltip = d3.select("#smallmultiples")
    .append("div")
    .attr("class","medal-tool-tip")
    //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .on("click",function(){
      medaltooltip.style("visibility",null);
    });

d3.queue()
    .defer(d3.csv, "data/mergedcountries.csv", type)
    .defer(d3.csv, "data/hostannotations.csv", type3)
    .await(display);

function display(error,medals, hosts) {
	console.log(medals);

  	var groupByCountry = d3.nest()
	  	.key(function(d) { return d['Country']; })
	  	.key(function(d) { return d['Year']; })
	  	//.sortKeys(function(a,b) { console.log(a); return a.values.length - b.values.length; })
	  	.sortValues(function(a,b) { return a['Medal Rank'] - b['Medal Rank']; })
	  	.entries(medals)
	  	.sort(function(a, b){ return d3.descending(d3.sum(a.values, function(d) { return d.values.length; }), d3.sum(b.values, function(d) { return d.values.length; })); })
	  	//.sort(function(a, b){ return d3.descending(a.values.length, b.values.length); })

	console.log(groupByCountry)


	var smsvg = d3.select("#smallmultiples").selectAll("svg")
	  	.data(groupByCountry)
		.enter()
		.append("svg")
	  	.attr("width", smwidth)
	  	.attr("height", smheight)
	  	.attr("class", "small-multiple")


  

	years2 = ["1950", "1975", "2000"].map(function(d) { return yearParser(d)});
	console.log(years);
	smsvg.append("g")
			.attr("class", "year-axis")
		     .attr("transform", "translate(0," + (smmargin.top) + ")")
		    .call(d3.axisTop(yearScale2).tickValues(years2).tickFormat(d3.timeFormat("%Y")));

	console.log(smsvg)
	smsvg.append("text")
		.attr("class", "country-label")
		.attr("x", 25)
		.attr("y", 250)
		.text(function(d) { return d['key']});

	hosts = hosts.map(function(d) { 
      		e = {};
      		e['data'] = d;
      		e['dx'] = d.dx;
      		e['dy'] = d.dy;
      		e['note'] = {'align': d['align']};
      		e['connector'] = {'end': "arrow",  'type': "curve"};


      		return e;
      	})
      	.map(function(l) {
      		annotation = l.data.city + " hosted in " + l.data.country + " in " + l.data.year
	        l.note = Object.assign({}, l.note, {
	          label: annotation, wrap: 200})
	        l.subject = { radius: 4}

	        return l;
      	});
     console.log(hosts);
	window.hostAnnotations =  d3.annotation()
	        .annotations(hosts)
	        .type(d3.annotationLabel)
	        .accessors({ x: function x(d) {
	        	console.log(d);
	        		console.log(yearScale2(yearParser(d['year'])))
					return yearScale2(yearParser(d['year']))
				}, 
	          	y: function y(d) {	
	          		return 300;
	        	}
	    	})
	    	.accessorsInverse({
			    year: function year(d) {
			      return yearFormatter(yearScale2.invert(d.x));
			    },
			    countries: function freq(d) {
			      return yScale.invert(d.y);
			    }
			})
	smsvg.append("g")
				.attr("class", "annotations")
				.call(hostAnnotations)

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
		.attr("cy", function(d,i) { 
	
				return smmargin.top + 6 + 8*i; 
			
		})
		.attr("class", "sm-medal")
		.on("mouseover", function(d) { 
			console.log(d);
			data = d
			mouseOverEvents(d,d3.select(this));
		})
		.on('mouseout', function(d) {
			data = d;
			d3.select(this).classed("hover", false);
			mouseOutEvents(d,d3.select(this));
		})

	function mouseOverEvents(d) { 
		var tooltipcontainer = medaltooltip.append("div");

    	/*tooltipcontainer.append("div")
						.attr("class", "play")
						.text(function () { return "Click to play"; })*/
					

      	nameline = tooltipcontainer.append("div")
						.attr("class", "athlete-name")
						.text(function (d) { return data['Name of Athlete or Team'] + "      "; })
		nameline.append("img")
						.attr('src', function(d) { return "images/flags/"+ data['Country']+"flag.png"; })
		nameline.append("img")
						.attr('src', function(d) { return "images/medals/"+ data['Medal Rank']+".png"; });
      	/*tooltipcontainer.append("div")
				
						.text(function () { 
							return 'Combined score: ' + data['combined'];
						})
      	tooltipcontainer.append("div")
      					.attr("class", "skater-time")
      					.text(function () { 
      					
      						return data['competition']
      						
      					})*/
      	tooltiprows = tooltipcontainer.selectAll(".row")
			.data([["Year", data['Year']], ['Gender', data['Gender']], ['Sport', data['Sport']], ['Event', data['Event']]])
			.enter()
			.append("div")
			.attr("class", "tooltip-row")
		tooltiprows.selectAll(".column")
			.data(function(d) { return d})
			.enter()
			.append("div")
			.text(function(d) { console.log(d); return d;})
			.attr("class", function(d,i) { 
				if (i % 2 == 0) {
					return "column-left";
				} else {
					return "column-right";
				}
			})
			

     						

      	
      	medaltooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/
            return (d3.event.pageY+15)+"px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            return (d3.event.pageX-200) +"px";
          })

	}

	function mouseOutEvents(d) { 
		medaltooltip.selectAll("div").remove();
    	medaltooltip
       		.style("visibility",null);
	  
	
	}
}

function type3(d) { 
	d['dx'] = +d['dx'] * 350;
	d['dy'] = +d['dy'] * 325;
	return d
}