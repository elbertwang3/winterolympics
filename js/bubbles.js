var scrollVis = function(medals) {
  /*bubblewidth = window.innerWidth;
  bubbleheight = window.innerHeight;
  bubblemargin = {top: 30, bottom: 30, right: 30, left: 30}


  bubblesdiv = d3.select('.bubbles')*/
  var lastIndex = -1;
  var activeIndex = 0;
  var activateFunctions = [];
  var updateFunctions = [];

  /*medalColor = d3.scaleOrdinal()
    .domain([1,2,3])
    .range(['#FFD700', "#C0C0C0", "#CD7F32"])*/
  var chart = function (selection) {
      selection.each(function (rawData) {
        medals = rawData;
        setupVis(medals);
        setupSections();
      })
    }

    var setupVis = function(medals) {
       /*var bubblesvg = bubblesdiv.append("svg")
          .attr("width", bubblewidth)
          .attr("height", bubbleheight)
          .attr("class", "bubblessvg")

      var base = 4,
          dif = 12;

      var fakemedals = d3.range(300).map(function() { return {'radius': Math.random() * dif + base, 'color': medalColor(Math.floor(Math.random() * 3) + 1)  }})   
      console.log(fakemedals);
      rootmedal = fakemedals[0];
      rootmedal.radius = 0;
      rootmedal.fixed = true;

      const forceX = d3.forceX(bubblewidth / 2).strength(0.02)
      const forceY = d3.forceY(bubbleheight / 2).strength(0.04)

      var simulation =  d3.forceSimulation()
            .velocityDecay(0.5) //velocityDecay is how much the bubbles go out when mousing around
            .force("x", forceX)
            .force("y", forceY)
            .force("collide", d3.forceCollide().radius(function(d){
              if(d === rootmedal){
                return Math.random() * 300 + 50;
              }
              return d['radius'] + 6
            }))
            .nodes(fakemedals).on("tick", ticked);
                  
   

      var medalsselection = bubblesvg.selectAll(".node")
          .data(fakemedals)

      medalsselection
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function(d) { console.log(d); return d['radius']; })
        .attr("fill", function(d, i) { return d['color'] });

      function ticked(e) {
        bubblesvg.selectAll("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      };

      bubblesvg.on("mousemove", function() {
        var p1 = d3.mouse(this);
        rootmedal.fx = p1[0];
        rootmedal.fy = p1[1];
        simulation.alphaTarget(0.1).restart();//reheat the simulation //how 
      });*/


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

var w = window.innerWidth,
    h = window.innerHeight;

d3.queue()
    .defer(d3.csv, "data/medals.csv", type)
    .await(display);

function display(error,medals) {

  var plot = scrollVis();

    d3.select('#vis')
      .datum(medals)
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
