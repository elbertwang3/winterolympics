var scrollVis = function(medals, countries, games) {
	viz = d3.select("#vis"),
  	width = window.innerWidth,
  	height = window.innerHeight;
  	mapmargin = {top: 0, bottom: 0, right: 0, left: 0}

  	var svg = viz
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", "0 0 " + (width) + " " + (height))
        .attr("class", "svg")
        
    map = svg.append('g')
        .attr('class', 'map')

    linegraph = svg.append('g')
    	.attr("class", "linegraph")
    	.attr("opacity", 0)

    var path = d3.geoPath();
	
	var projection = d3.geoMercator()
        .scale(230)
        .translate( [width / 2, height / 1.5]);

    var yearParser = d3.timeParse("%Y")
   
   
	
	var path = d3.geoPath().projection(projection);



  	var lastIndex = -1;
  	var activeIndex = 0;
  	var activateFunctions = [];
  	var updateFunctions = [];

  /*medalColor = d3.scaleOrdinal()
    .domain([1,2,3])
    .range(['#FFD700', "#C0C0C0", "#CD7F32"])*/
  	var chart = function (selection) {
      	selection.each(function (rawData) {
        	setupVis(medals, countries, games);
        	setupSections();
      	})
    }

    var setupVis = function(medals, countries, games) {

  		mapg = map.append("g")
      		.attr("class", "countries")
    		.selectAll("path")
      		.data(countries.features)
    		.enter().append("path")
    		.attr("class", "borders")
      		.attr("d", path)

      	cities = map.append("g")
      		.attr("class", "host-cities")
      		.selectAll("g")
      		.data(games)
      		.enter()
      		.append('g')
      		.attr("class", "city-g")
      		.attr("transform", function(d) { 
      			pt = projection([d['longitude'], d['latitude']])
      			return "translate(" + pt[0] + ", " + pt[1] + ")";
      		})
      		.attr("opacity", 0);
      	

      	cities.append("circle")
      		.attr("class", "citydot")
      		//.attr("cx", function(d) {  return projection([d['longitude'], d['latitude']])[0]})
      		//.attr("cy", function(d) {  return projection([d['longitude'], d['latitude']])[1]})
      		.attr("r", 2)
      		.attr("fill", "#53412d")

      	cities.append("text")
      		.attr("class", "citytext")
      		.text(function(d) { 
      			if (d['city'] == "Lake Placid") {
      				return d['year'] + ", " + "1980" + ": " + d['city'] + ", " + d['country'];
      			} else if (d['city'] == 'Sankt Moritz') {
      				return d['year'] + ", " + "1948" + ": " + d['city'] + ", " + d['country'];
      			} else {
      				return d['year'] + ": " + d['city'] + ", " + d['country'];
      			}
      		})
      		.attr("x", 5)
      		//.attr("y", function(d) {  return projection([d['longitude'], d['latitude']])[1]})
      		.attr("alignment-baseline", "middle")
      		//.attr("opacity", 0)

      	cities.select("circle")
      		.on("mouseover", function(d) { 
      			console.log(d['city'])
      			d3.select(this.parentNode)
      			.select("text")
      			.attr("opacity", 1);

      		})
      		.on("mouseout", function() { 
      			d3.select(this.parentNode)
      			.select("text")
      			.attr("opacity", 0);

      		})


      	linemargin = {top: 50, bottom: 50, right: 100, left: 100}

      	lineg = linegraph.append("g")
      				.attr("class", "line-g")



      	yearScale = d3.scaleTime()
      		.domain(d3.extent(games, function(d) { return yearParser(d['year']);}))
      		.range([linemargin.left, width-linemargin.right])

      	yearScale.ticks(d3.timeYear.every(4));

      	countriesScale = d3.scaleLinear()
      		.domain(d3.extent(games, function(d) { return d['countriesparticipating']}))
      		.range([height-linemargin.bottom, linemargin.top])

      	participantScale = d3.scaleLinear()
      		.domain(d3.extent(games, function(d) { return d['participants']}))
      		.range([height-linemargin.bottom, linemargin.top])

      	sportScale = d3.scaleLinear()
      		.domain(d3.extent(games, function(d) { return d['sports']}))
      		.range([height-linemargin.bottom, linemargin.top])

      	eventScale = d3.scaleLinear()
      		.domain(d3.extent(games, function(d) { return d['events']}))
      		.range([height-linemargin.bottom, linemargin.top])


		lineg.append("g")
		    .attr("transform", "translate(0," + (height - linemargin.bottom) + ")")
		    .call(d3.axisBottom(yearScale))

		console.log(_.range(0, 105, 10))
		yticks = lineg.selectAll("g")
			.data(_.range(0, 105, 10))
			.enter()
			.append("g")
			.attr("class", "ytick-g")

		//yticks.append("line")

		yticks.append("text")
			.attr("x", width-linemargin.right)
			.attr("y", function(d) { return countriesScale(d); })
			.text(function(d) { return countriesScale(d); })


      	







      	var chart = $(".svg"),
	   	aspect = chart.width() / chart.height(),
	    container = $("#sections");
		$(window).on("resize", function() {
	
		    var targetWidth = container.width();
		    chart.attr("width", targetWidth);
		    //chart.attr("height", Math.round(targetWidth / aspect));
		    chart.attr("height", window.innerHeight);
		}).trigger("resize");
    }
    
    var setupSections = function () {
        // activateFunctions are called each
        // time the active section changes
	    activateFunctions[0] = showIntro;
	    activateFunctions[1] = showKorea;
	    activateFunctions[2] = showChina;
	    activateFunctions[3] = showAllHosts;
	    activateFunctions[4] = showLineGraph;
	   
	    
	    /*for (var i = 0; i < 20; i++) {
	      activateFunctions[i] = function () {};
	    }*/

	    // updateFunctions are called whilec
	    // in a particular section to update
	    // the scroll progress in that section.
	    // Most sections do not need to be updated
	    // for all scrolling and so are set to
	    // no-op functions.
	    for (var i = 0; i < 20; i++) {
	      	updateFunctions[i] = function () {};
	    }
	    //updateFunctions[7] = updateCough;
	};

	function showIntro() {
		reset();
		d3.selectAll(".city-g").attr("opacity", 0);
		d3.selectAll(".citytext").attr("opacity", 0);
	}
	function showKorea() {

		korea = countries['features'].filter(function(d) { return d['properties']['name'] == 'South Korea'; })[0]
		zoomTo(korea);
		
      	
		d3.selectAll(".city-g").attr("opacity", 0);
		d3.selectAll(".citytext").attr("opacity", 1);
		d3.selectAll(".city-g").filter(function(d) { return d['year'] == 2018 }).attr("opacity", 1)

		

	}
	function showChina() {
		china = countries['features'].filter(function(d) { return d['properties']['name'] == 'China'; })[0]
		zoomTo(china);

		d3.selectAll(".city-g").attr("opacity", 0);
		d3.selectAll(".citytext").attr("opacity", 1);
		d3.selectAll(".city-g").filter(function(d) { return d['year'] == 2022 }).attr("opacity", 1)

	}
	function showAllHosts() {

		console.log(lastIndex);
		 if (lastIndex >= 4) {
		 	map
			.transition()
			.duration(500)
			.attr('opacity', 1)
		}
		else {
			reset();
			d3.selectAll(".city-g").attr("opacity", 1)
			d3.selectAll(".citytext").attr("opacity", 0);
		}
	}

	function showLineGraph() {
		map
			.transition()
			.duration(500)
			.attr('opacity', 0)

		linegraph
			.transition()
			.duration(500)
	    	.attr("opacity", 1)

	}

	function zoomTo(dpath) {
	  	var bounds = path.bounds(dpath),
      	dx = bounds[1][0] - bounds[0][0],
      	dy = bounds[1][1] - bounds[0][1],
      	x = (bounds[0][0] + bounds[1][0]) / 2,
      	y = (bounds[0][1] + bounds[1][1]) / 2,
      	scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      	translate = [width / 2 - scale * x, height / 2 - scale * y];
   

  		map.transition()
      		.duration(1000)
      // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
      		//.call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));
      		.attr("transform", "translate(" + translate + ") scale(" + scale + ")");

      	map.selectAll(".citydot")
      		.attr("r", 0.5);

      	map.selectAll(".citytext")
      		.classed("zoomed", true)

      	map.selectAll(".citytext")
      		.classed("unzoomed", false)


      

   	}
	function reset() {
		map
			.transition()
    		.duration(1000)
 			.attr("transform", "");

 		map.selectAll(".citydot")
      		.attr("r", 2);

      	map.selectAll(".citytext")
      		.classed("zoomed", false)

      	map.selectAll(".citytext")
      		.classed("unzoomed", true)



	
	}
 

	chart.activate = function (index) {

	    activeIndex = index;
	    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
	    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
	    scrolledSections.forEach(function (i) {
	      activateFunctions[i]();
	    });
	    lastIndex = activeIndex;
	};

	chart.update = function (index, progress) {
		updateFunctions[index](progress);
	};
	return chart;
}


d3.queue()
    .defer(d3.csv, "data/medals.csv", type)
    .defer(d3.json, "data/world_countries.json")
    .defer(d3.csv, "data/gamescoded.csv", type2)
    .await(display);

function display(error,medals, countries, games) {

  	var plot = scrollVis(medals, countries, games);

    d3.select('#vis')
      	.data([medals,countries, games])
      	.call(plot);

     var scroll = scroller()
    	.container(d3.select('#graphic'));

    scroll(d3.selectAll('.step'));


    scroll.on('active', function (index) {
    	// highlight current step text
    	d3.selectAll('.step')
      		.style('opacity', function (d, i) { 
         		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600) {
            		return i === index ? 0.8 : 0.1; 
         		} else {
         			return i === index ? 1 : 0.1; 
      			}
      		});

    	// activate current section
    	plot.activate(index);
  	});
    
    scroll.on('progress', function (index, progress) {
    	plot.update(index, progress);
  	});
}

function type(d) {
  if (d['Age of Athlete'] == null) {
     d['Age of Athlete'] = +d['Age of Athlete'];
  }
  d['Medal Rank'] = +d['Medal Rank']
 

  return d;
}
function type2(d) {
 	d['countriesparticipating'] = +d['countriesparticipating'];
 	d['participants'] = +d['participants'];
 	d['men'] = +d['men'];
 	d['women'] = +d['women'];
 	d['sports'] = +d['sports'];
 	d['events'] = +d['events'];
 	d['latitude'] = +d['latitude'];
 	d['longitude'] = +d['longitude'];
  	return d;
}