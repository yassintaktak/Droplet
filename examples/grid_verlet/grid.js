window.onload = function() {
  var drop = new Droplet({
    canvas : "drop_canvas",
    debug : false
  });
  var start_x = 0, start_y = 0;
  var width = 200, height = 200;
  var mouse = {
    x : 0,
    y : 0,
    ox : 0,
    oy  : 0,
    down : false
  }
  var cloth = new Grid(width, height, start_x, start_y, {line_width : 0.4, color : "#EEE"});
  cloth.build();

  window.onmousedown = function(e) {
    mouse.down = true;
  }
  window.onmouseup = function(e) {
    mouse.down = false;
  }
  window.onmousemove = function(e) {
    if(mouse.down) {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  }
  DropLoop(function() {
    drop.resetCanvas();
    drop.grid2D(cloth);
    for(var i=0; i<cloth.grid_points.length; i++) {
      if(mouse.down) {
        if(cloth.grid_points[i].x < mouse.x+20 && cloth.grid_points[i].x > mouse.x-20 && cloth.grid_points[i].y < mouse.y+20 && cloth.grid_points[i].y > mouse.y-20) {
          if(!cloth.grid_points[i].pinned) {
            var vx = (mouse.x-mouse.px)*0.999,
                vy = (mouse.y-mouse.py)*0.999;
            cloth.grid_points[i].px = cloth.grid_points[i].x;
            cloth.grid_points[i].py = cloth.grid_points[i].y;
            cloth.grid_points[i].x += vx;
            cloth.grid_points[i].y += vy;
          }
        }
      }
    }
  })
}
