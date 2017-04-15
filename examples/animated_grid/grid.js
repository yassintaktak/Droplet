  window.onload = function() {
      console.log("Press {ENTER} to animate your drawing.");
      console.log("Type <extract()> to get your drawing in array format.")
      console.log("type <draw([], [])> to draw your array.");
      var drop = new Droplet({
        canvas : "drop_canvas",
        debug : false
      });
      var start_x = 0,
          start_y = 0;
      var mouse = {
        x : 0,
        y : 0,
        ox : 0,
        oy : 0,
        down : false
      }
      var animation_points = [];
      var animation_points_small = [];
      var influence = 10;
      var gravity = 0;
      var points = [];

      var grid = new Grid(200, 30, start_x, start_y, {color : "#bdc3c7", line_width : 0.4, spacing : 50});
      var grid2 = new Grid(200, 70, start_x, start_y, {color : "#bdc3c7", line_width : 0.4, spacing : 10});
      var points = grid.build();
      var points2 = grid2.build();
      var animating = false;

      window.onkeydown = function(e) {
        switch(e.keyCode) {
          case 13:
            drop.resetCanvas();
            grid = new Grid(200, 30, start_x, start_y, {color : "#bdc3c7", line_width : 0.4, spacing : 50});
            grid2 = new Grid(200, 70, start_x, start_y, {color : "#bdc3c7", line_width : 0.4, spacing : 10});
            points = grid.build();
            points2 = grid2.build();
            animating = true;
            closeLoop(0);
            var i, j = 0;
            var small, big;
            DropLoop(function() {
              drop.resetCanvas();
              drop.grid2D(grid);
              drop.grid2D(grid2);
              if(i < animation_points.length) {
                grid.grid_points[animation_points[i].index].x += animation_points[i].x;
                grid.grid_points[animation_points[i].index].y += animation_points[i].y;
              } else {
                big = true;
              }
              if(j < animation_points_small.length) {
                grid2.grid_points[animation_points_small[j].index].x += animation_points_small[j].x;
                grid2.grid_points[animation_points_small[j].index].y += animation_points_small[j].y;
              } else {
                small = true;
              }
              i++;
              j++;
              if(small && big) {
                closeLoop(1);
              }
            }, 1000/60);
            break;
        }
      }
      window.onmousedown = function(e) {
        if(!animating) {
          mouse.ox = mouse.x;
          mouse.oy = mouse.y;
          mouse.x = e.clientX;
          mouse.y = e.clientY;
          mouse.down = true;
        }
      }
      window.onmouseup = function(e) {
        if(!animating) {
            mouse.down = false;
        }
      }
      window.onmousemove = function(e) {
        if(mouse.down && !animating) {
          mouse.ox = mouse.x;
          mouse.oy = mouse.y;
          mouse.x = e.clientX;
          mouse.y = e.clientY;
        }
      }

       window.extract = function() {
         var txt = document.createElement("textarea");
         var arrays_string = "[";
         for(var i=0; i<animation_points.length; i++) {
           arrays_string += "{index:"+animation_points[i].index+", x : "+animation_points[i].x+", y : "+animation_points[i].y+"},";
         }
         arrays_string += "{index : NaN, x : NaN, y : NaN}] , [";
         for(var i=0; i<animation_points_small.length; i++) {
           arrays_string += "{index:"+animation_points_small[i].index+", x : "+animation_points_small[i].x+", y : "+animation_points_small[i].y+"},";
         }
         arrays_string += "{index : NaN, x : NaN, y : NaN}]";
         txt.value = arrays_string;
         document.body.appendChild(txt);
      }
      window.draw = function(big, small) {
        animation_points = big;
        animation_points_small = small;
      }
      DropLoop(function() {
        drop.resetCanvas();
        drop.grid2D(grid);
        drop.grid2D(grid2);
        for(var i=0; i<grid.grid_points.length; i++) {
          var p = grid.grid_points[i];
          if(mouse.down && !animating) {
            if(points[i].x < mouse.x+influence && points[i].x > mouse.x-influence && points[i].y < mouse.y+influence && points[i].y > mouse.y-influence) {
              var vx = (mouse.x-mouse.px)*0.999,
                  vy = (mouse.y-mouse.py)*0.999;
              p.px = p.x;
              p.py = p.y;
              p.x += vx;
              p.y += vy;
              animation_points.push({
                index : i,
                x : vx,
                y : vy
              })
            }
          }
        }
        for(var i=0; i<grid2.grid_points.length; i++) {
          var p = grid2.grid_points[i];
          if(mouse.down && !animating) {
            if(points2[i].x < mouse.x+influence && points2[i].x > mouse.x-influence && points2[i].y < mouse.y+influence && points2[i].y > mouse.y-influence) {
              var vx = (mouse.x-mouse.px)*0.999,
                  vy = (mouse.y-mouse.py)*0.999;
              p.px = p.x;
              p.py = p.y;
              p.x += vx;
              p.y += vy;
              animation_points_small.push({
                index : i,
                x : vx,
                y : vy
              })
            }
          }
        }
      });
  }
