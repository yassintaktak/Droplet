var drop = new Droplet({
  canvas : "drop_canvas",
  debug : false
});
var points = [];
var sticks = [];

points.push(new DropVerlet(drop.props.width/2, 0, drop.props.width/2, 0, {gravity : 0.1, friciton : 0.9}, {width : drop.props.width, height : drop.props.height}, true));
points.push(new DropVerlet(drop.props.width/2-60, 0, drop.props.width/2-60, 0, {gravity : 0.1, friciton : 0.9}, {width : drop.props.width, height : drop.props.height}, false));
points.push(new DropVerlet(drop.props.width/2-120, 0, drop.props.width/2-120, 0, {gravity : 0.1, friciton : 0.9}, {width : drop.props.width, height : drop.props.height}, false));
points.push(new DropVerlet(drop.props.width/2-180, 0, drop.props.width/2-180, 0, {gravity : 0.1, friciton : 0.9}, {width : drop.props.width, height : drop.props.height}, false));

sticks.push({
  p1 : points[0],
  p2 : points[1],
  length : 60
});
sticks.push({
  p1 : points[1],
  p2 : points[2],
  length : 60
});
sticks.push({
  p1 : points[2],
  p2 : points[3],
  length : 60
})

var down = false;

window.onmousedown = function(e) {
  down = true;
  points.push(new DropVerlet(e.clientX, e.clientY, e.clientX, e.clientY, {gravity : 0.1, friciton : 0.9}, {width : drop.props.width, height : drop.props.height}, true));
  sticks.push({
    p1 : points[3],
    p2 : points[points.length-1],
    length : Math.sqrt((points[points.length-1].x-points[3].x)*(points[points.length-1].x-points[3].x)+(points[points.length-1].y-points[3].y)*(points[points.length-1].x-points[3].x))
  })
}
DropLoop(function() {
  drop.resetCanvas();
  for(var i=0; i<points.length; i++) {
    points[i].render();
    drop.draw2D("arc", {
      x : points[i].x,
      y : points[i].y,
      radius : 3,
      radian : Math.PI*2,
      color : "#c0392b"
    })
  }
  for(var i=0; i<sticks.length; i++) {
    var p1 = sticks[i].p1;
    var p2 = sticks[i].p2;
    var dx = p2.x-p1.x,
        dy = p2.y-p1.y,
        ds = Math.sqrt(dx*dx+dy*dy),
        df = sticks[i].length-ds,
        pc = df/ds/2,
        ox = dx*pc,
        oy = dy*pc;
    if(!p1.pinned) {
      sticks[i].p1.x -= ox;
      sticks[i].p1.y -= oy;
    }
    if(!p2.pinned) {
      sticks[i].p2.x += ox;
      sticks[i].p2.y += oy;
    }
    drop.context.beginPath();
    drop.context.moveTo(sticks[i].p1.x, sticks[i].p1.y);
    drop.context.lineTo(sticks[i].p2.x, sticks[i].p2.y);
    drop.context.line_width = 0.5;
    drop.context.color = "#c0392b";
    drop.context.stroke();
  }

});
