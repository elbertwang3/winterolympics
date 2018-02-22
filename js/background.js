


//Home Page Graphic
//adapted from https://bl.ocks.org/mbostock/3231307

var bgwidth = d3v3.select(".bubbles").node().clientWidth,
    bgheight = d3v3.select(".bubbles").node().clientHeight;

var num = 300,
    base = 4,
    dif = 12;

var nodes = d3v3.range(num).map(function() { return {radius: Math.random() * dif + base }; }),
    root = nodes[0]
   color = ['#FFD700', "#C0C0C0", "#CD7F32"];

root.radius = 0;
root.fixed = true;
root.px = bgwidth/2;
root.py = bgheight/2;

var force = d3v3.layout.force()
    .gravity(0.015)
    .charge(function(d, i) { return i ? 0 : - (bgheight + bgwidth); })
    .nodes(nodes)
    .size([bgwidth, bgheight]);

force.start();

var canvas = d3v3.select(".bubbles").append("canvas")
    .attr("width", bgwidth)
    .attr("height", bgheight);

var context = canvas.node().getContext("2d");

force.on("tick", function(e) {
  var q = d3v3.geom.quadtree(nodes),
      i,
      d,
      n = nodes.length;

  for (i = 1; i < n; ++i) q.visit(collide(nodes[i]));

  context.clearRect(0, 0, bgwidth, bgheight);
  force.size([bgwidth, bgheight]);
  for (i = 1; i < n; ++i) {
    context.fillStyle = color[i % color.length];
    context.globalAlpha = 0.6;
    d = nodes[i];
    context.moveTo(d.x, d.y);
    context.beginPath();
    context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
    context.fill();
  }
});

canvas.on("mousemove", move);
canvas.on("touchmove", move);

function move() {
  var p1 = d3v3.mouse(this);
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
};

function collide(node) {
  var r = node.radius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius + 7;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

$(window).on("resize", function () {
  bgwidth = d3v3.select(".bubbles").node().clientWidth,
  bgheight = d3v3.select(".bubbles").node().clientHeight;
  canvas.attr("width", bgwidth).attr("height", bgheight);
  force.start();
});

    