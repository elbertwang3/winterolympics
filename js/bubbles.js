var scrollVis = function(medals, countries) {
	viz = d3.select("#vis"),
  	width = window.innerWidth,
  	height = window.innerHeight;
  	margin = {top: 30, bottom: 30, right: 30, left: 30}



  	var lastIndex = -1;
  	var activeIndex = 0;
  	var activateFunctions = [];
  	var updateFunctions = [];

  /*medalColor = d3.scaleOrdinal()
    .domain([1,2,3])
    .range(['#FFD700', "#C0C0C0", "#CD7F32"])*/
  	var chart = function (selection) {
      	selection.each(function (rawData) {
      		console.log(selection)
      		console.log(rawData);
        	medals = rawData;
        	setupVis(medals, countries);
        	setupSections();
      	})
    }

    var setupVis = function(medals, countries) {
    	var format = d3.format(",");
		var path = d3.geoPath();
		var svg = viz
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

		var projection = d3.geoMercator()
            .scale(130)
            .translate( [width / 2, height / 1.5]);

		var path = d3.geoPath().projection(projection);


  		

  		svg.append("g")
      		.attr("class", "countries")
    		.selectAll("path")
      		.data(countries.features)
    		.enter().append("path")
    		.attr("class", "borders")
      		.attr("d", path)
      		//.style("fill", function(d) { return color(populationById[d.id]); })
      		
      		// tooltips
       		
     

  		svg.append("path")
      		.datum(topojson.mesh(countries.features, function(a, b) { return a.id !== b.id; }))
       		// .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      		.attr("class", "borders")
      		.attr("d", path);

      


    }
    var setupSections = function () {
        // activateFunctions are called each
        // time the active section changes
    /*activateFunctions[0] = showAnno;
    activateFunctions[1] = showBeeswarm;
    activateFunctions[2] = showBeforePhoneSwitch;
    activateFunctions[3] = showAndroid;
    activateFunctions[4] = showIphone;
    activateFunctions[5] = showObama;
    activateFunctions[6] = showClinton;
    activateFunctions[7] = showCnn;
    activateFunctions[8] = searchTerm;
    activateFunctions[9] = transitionScatterTimeOfDay;
    activateFunctions[10] = showFoxAndFriends;
    activateFunctions[11] = showAndroid;
    activateFunctions[12] = showIphone;
    activateFunctions[13] = scatterTimeline;*/
    
    for (var i = 0; i < 20; i++) {
      activateFunctions[i] = function () {};
    }

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
    .await(display);

function display(error,medals, countries) {
	console.log(countries);
  	var plot = scrollVis(medals, countries);

    d3.select('#vis')
      	.data([medals,countries])
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
