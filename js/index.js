
const ringwidth = 500
$(window).on("resize", function() {
      console.log("getting resized");
	if (window.innerWidth < ringwidth) {
		d3.select(".logo")
			.attr("width", window.innerWidth - 20)
	}
})


var vis;
var topoffset;
var bottomoffset;


 

  $(window).scroll(function() {

  	topoffset = $("#graphic").position().top
  	 bottomoffset = $("#graphic").position().top + $("#sections").outerHeight(true);

  	if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - window.innerHeight) {
	  	console.log("GETTING fixed")
	  	d3.select("#vis").classed("is_fixed", true)
	  	d3.select("#vis").classed("is_unfixed", false)
	  	d3.select("#vis").classed("is_bottom", false)
	  	
	  } else if (window.pageYOffset > bottomoffset - window.innerHeight) {
	  		d3.select("#vis").classed("is_fixed", false)
	  		d3.select("#vis").classed("is_bottom", true)
	  	}
	  	else {
	  	//console.log("GETTING unfixed")
	  	d3.select("#vis").classed("is_fixed", false)
	  	d3.select("#vis").classed("is_unfixed", true)
	  }
  })