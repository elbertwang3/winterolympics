
const ringwidth = 500
$(window).on("resize", function() {
      console.log("getting resized");
	if (window.innerWidth < ringwidth) {
		d3.select(".logo")
			.attr("width", window.innerWidth - 20)
	}
})