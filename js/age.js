var amargin = {top: 15, bottom: 15, right: 25, left: 45},
awidth = 350 - amargin.right - amargin.left,
aheight = 50 - amargin.top - amargin.bottom;



var yearParser = d3.timeParse("%Y");

var ageScale = d3.scaleLinear()
	.domain([0, 50])
	.rangeRound([0, awidth])


var boxplot = d3.box()
    .whiskers(iqr(1))
    .width(awidth)
    .height(aheight);


d3.queue()
    .defer(d3.csv, "data/mergedcountries.csv", type)
    .await(display);

function display(error,medals) {

	filterForAge = medals.filter(function(d) { return d['Age'] != 0; })
	var max = d3.max(filterForAge, function(d) { return d['Age']; }),
	min = d3.min(filterForAge, function(d) { return d['Age']; });


	boxplot.domain([min, max])
	groupBySportGenderYear = d3.nest()
		.key(function(d) { return d['Year']; })
		.key(function(d) { return d['Sport']; })
		.key(function(d) { return d['Gender']; })
	  	.entries(filterForAge)


	i = 0;
	d3.select("#age").append("div")
		.text(groupBySportGenderYear[i]['key'])
		.attr("class", "yeartext")
	setInterval(function() {
		d3.select("#age").select(".yeartext")
			.text(groupBySportGenderYear[i % 22]['key'])
		agediv = d3.select("#age").selectAll(".sm-age-div").data(groupBySportGenderYear[i % 22].values, function(d) { return d['key']})
		agediv.exit().remove();

		agediventer = agediv
			.enter()
			.append("div")
			.attr("class", "sm-age-div")
			
		agediventer.append("div")
			.text(function(d) { return d['key']})
			.attr("class", "sport")

		agediv = agediv
			.merge(agediventer)

		agesvg = agediv.selectAll(".box")
			.data(function(d) { return d.values; }, function(d) { return d['key']})


		//console.log(agesvg);

		agesvg.exit().remove()

		var bpchart = $(".box"),
		   	bpaspect = bpchart.width() / bpchart.height(),
		    bpparentcontainer = $("#sections1");
	

		agesvgenter = agesvg
			.enter()
			.append("svg")
			.attr("viewBox", "0 0 " + (awidth + amargin.right + amargin.left) + " " + (aheight + amargin.top + amargin.bottom))
		  	.attr("width", awidth + amargin.right + amargin.left)
		  	.attr("height", aheight + amargin.top + amargin.bottom)
		  	
		  	.attr("class", "box")
		  	
		agesvgenter.append('g')
		  	.attr("transform", "translate(" + amargin.left + "," + amargin.top + ")")
		  	.attr("class", "box-g")
			.call(boxplot.duration(1000))
			
		agesvgenter.append("text")
			.text(function(d) { return d['key']})
			.attr("class", "gender")
			.attr("x", 0)
			.attr("y", 25)
		  
		agesvg
		  	//.merge(agesvgenter)
		  	.select('.box-g')
			.call(boxplot.duration(1000));
	
    	i++;
  	}, 2000);




}

function type(d) { 
	d['Age'] = +d['Age of Athlete'];
	return d;
}

function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}


