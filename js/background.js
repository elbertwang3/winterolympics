bubblewidth = window.innerWidth;
  bubbleheight = window.innerHeight;
  bubblemargin = {top: 30, bottom: 30, right: 30, left: 30}


  bubblesdiv = d3.select('.bubbles')

  medalColor = d3.scaleOrdinal()
    .domain([1,2,3])
    .range(['#FFD700', "#C0C0C0", "#CD7F32"])



var bubblesvg = bubblesdiv.append("svg")
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

      const forceX = d3.forceX(bubblewidth / 2).strength(0.005)
      const forceY = d3.forceY(bubbleheight / 2).strength(0.005)

      var simulation =  d3.forceSimulation()
            .velocityDecay(0.15) //velocityDecay is how much the bubbles go out when mousing around
            .force("x", forceX)
            .force("y", forceY)
            .force("collide", d3.forceCollide().radius(function(d){
              if(d === rootmedal){
                return Math.random() * 50 + 300;
              }
              return d['radius'] + 5
            }))
            .nodes(fakemedals).on("tick", ticked);
                  
   

      var medalsselection = bubblesvg.selectAll(".node")
          .data(fakemedals)

      var node = medalsselection
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function(d) { console.log(d); return d['radius']; })
        .attr("fill", function(d, i) { return d['color'] });

      node.transition()
    .duration(750)
    .delay(function(d, i) { return i * 5; })
    .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

      function ticked(e) {
        bubblesvg.selectAll("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      };

      bubblesvg.on("mousemove", function() {
        var p1 = d3.mouse(this);
        rootmedal.fx = p1[0];
        rootmedal.fy = p1[1];
        simulation.alphaTarget(0.3).restart();//reheat the simulation //how 
      });