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

	var medalCounts = d3.nest()
	  	.key(function(d) { return d['Country']; })
	  	.rollup(function(v) { return {
		  	gold: d3.sum(v, function(d) { if (d['Medal Rank'] == 1) return 1;}),
		    silver: d3.sum(v, function(d) { if (d['Medal Rank'] == 2) return 1;}),
		    bronze: d3.sum(v, function(d) { if (d['Medal Rank'] == 3) return 1;})
		  }; })
	  	.entries(medals)
  	var groupByCountry = d3.nest()
	  	.key(function(d) { return d['Country']; })
	  	.key(function(d) { return d['Year']; })
	  	//.sortKeys(function(a,b) { console.log(a); return a.values.length - b.values.length; })
	  	.sortValues(function(a,b) { return a['Medal Rank'] - b['Medal Rank']; })
	  	.entries(medals)
	  	.sort(function(a, b){ return d3.descending(d3.sum(a.values, function(d) { return d.values.length; }), d3.sum(b.values, function(d) { return d.values.length; })); })
	  	//.sort(function(a, b){ return d3.descending(a.values.length, b.values.length); })



	var smdiv = d3.select("#smallmultiples").selectAll(".sm-div")
	  	.data(groupByCountry)
		.enter()
		.append("div")
		.attr("class", "sm-div")

	var svgdiv = smdiv.append("div")
				.attr("class", "svg-div")

	var smsvg = svgdiv.append("svg")
	  	.attr("width", smwidth)
	  	.attr("height", smheight)
	  	.attr("class", "small-multiple")

	var smimage = smdiv.append("div")
		.attr("class", "sm-image")

	/*smimage.append("img")
			.attr("src", function(d) { return 'images/flags/' + d['key'] + 'flaglarge.png';})
			//.style("top", smmargin.top)
			.style("left", 20)*/



  

	years2 = ["1950", "1975", "2000"].map(function(d) { return yearParser(d)});
	smsvg.append("g")
			.attr("class", "year-axis")
		     .attr("transform", "translate(0," + (smmargin.top) + ")")
		    .call(d3.axisTop(yearScale2).tickValues(years2).tickFormat(d3.timeFormat("%Y")));

	smsvg.append("text")
		.attr("class", "country-label")
		.attr("x", 0)
		.attr("y", 300)
		.text(function(d) { return d['key']});

	var medallabel = svgdiv.append("div")
		.attr("class", "medal-label-div")
	medallabel.append("img")
		.attr('src', function(d) { return "images/medals/1.png"; })
	medallabel.append("div")
		.text(function(d) { return medalCounts[medalCounts.findIndex(item => item.key === d['key'])].value.gold; })
	medallabel.append("img")
		.attr('src', function(d) { return "images/medals/2.png"; })
	medallabel.append("div")
		.text(function(d) { return medalCounts[medalCounts.findIndex(item => item.key === d['key'])].value.silver; })
	medallabel.append("img")
		.attr('src', function(d) { return "images/medals/3.png"; })
	medallabel.append("div")
		.text(function(d) { return medalCounts[medalCounts.findIndex(item => item.key === d['key'])].value.bronze; })
	

	hosts = hosts.map(function(d) { 
      		e = {};
      		e['data'] = d;
      		e['dx'] = d.dx;
      		e['dy'] = d.dy;
      		e['note'] = {'align': d['align']};
      		e['connector'] = {'end': "arrow"};


      		return e;
      	})
      	.map(function(l) {
      		annotation = l.data.country + " hosted in " + l.data.city + " in " + l.data.year
	        l.note = Object.assign({}, l.note, {
	          label: annotation, wrap: 100})
	        l.subject = { radius: 4}

	        return l;
      	});

    d3.selectAll(".small-multiple")
    	.each(function(d) { 
    		//console.log(d['key'])
    		//console.log(hosts);
    		data = d;
    		var filteredlabels;
    		if (d['key'] == 'Serbia') {
    			filteredlabels = hosts.filter(host => host.data['country'] == 'Yugoslavia')
    		} else {
    			filteredlabels = hosts.filter(host => host.data['country'] == d['key'])
    		}
    		//console.log(filteredlabels);
    		var hostAnnotations =  d3.annotation()
	        .annotations(filteredlabels)
	        .type(d3.annotationLabel)
	        .accessors({ x: function x(d) {
					return yearScale2(yearParser(d['year']))
				}, 
	          	y: function y(d) {	
	          		return smmargin.top + 6 + 8 * data.values[data.values.findIndex(item => item.key === d['year'])].values.length;
	          		//return groupByCountry.findIndex(item => item.key === 'John');;
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
			d3.select(this)
				.append("g")
				.attr("class", "annotations")
				.call(hostAnnotations)
    		return d;
    	})
   

	var yearbars = smsvg.append("g")
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
						.attr("class", "flag-img")
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
			.text(function(d) { return d;})
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