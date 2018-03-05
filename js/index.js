
const ringwidth = 500
$(window).on("resize", function() {
	if (window.innerWidth < ringwidth) {
		d3.select(".logo")
			.attr("width", window.innerWidth - 20)
	}
})


var vis;
var topoffset;
var bottomoffset;



$(window).scroll(function() {

  	topoffset = $("#graphic1").position().top
  	bottomoffset = $("#graphic1").position().top + $("#sections1").outerHeight(true);

  	if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - window.innerHeight) {
	  	d3.select("#vis1").classed("is_fixed", true)
	  	d3.select("#vis1").classed("is_unfixed", false)
	  	d3.select("#vis1").classed("is_bottom", false)
	  	
	} else if (window.pageYOffset > bottomoffset - window.innerHeight) {
	  		d3.select("#vis1").classed("is_fixed", false)
	  		d3.select("#vis1").classed("is_bottom", true)
	}
	else {
	  	console.log("GETTING unfixed")
	  	d3.select("#vis1").classed("is_fixed", false)
	  	d3.select("#vis1").classed("is_unfixed", true)
	}

	/*topoffset2 = $("#graphic2").position().top
  	bottomoffset2 = $("#graphic2").position().top + $("#sections2").outerHeight(true);

  	if (window.pageYOffset >= topoffset2 && window.pageYOffset <= bottomoffset2 - window.innerHeight) {
  		console.log("second one is getting fixed");
	  	d3.select("#vis2").classed("is_fixed", true)
	  	d3.select("#vis2").classed("is_unfixed", false)
	  	d3.select("#vis2").classed("is_bottom", false)
	  	
	} else if (window.pageYOffset > bottomoffset2 - window.innerHeight) {
	  		d3.select("#vis2").classed("is_fixed", false)
	  		d3.select("#vis2").classed("is_bottom", true)
	} else {
	  	//console.log("GETTING unfixed")
	  	d3.select("#vis2").classed("is_fixed", false)
	  	d3.select("#vis2").classed("is_unfixed", true)
	}*/
})