window.onload = function() {
    var drop = new Droplet({
      canvas : "drop_canvas",
      debug : false
    });
    var target = {
      x : 0,
      y : 0
    }
    var influence = 80;
    var particles = [];
    for(var i=0; i < 400; i++) {
      particles.push(new DropParticle(Math.random()*drop.props.width, Math.random()*drop.props.height, Math.PI+Math.random()*-10+10, Math.random()*0.7, 0, false));
    }
    var in_particles_d1 = [];
    window.onmousemove = function(e) {
      in_particles_d1 = [];
      target.x = e.clientX;
      target.y = e.clientY;
    }
    DropLoop(function() {
      drop.resetCanvas();
      for(var i=0; i<400; i++) {
        particles[i].render();
        particles[i].handleEdge(0, 0, drop.props.width, drop.props.height, -0.9, 3);
        var color = "#EEE";
        if(particles[i].x < target.x+influence && particles[i].x > target.x-influence && particles[i].y < target.y+influence && particles[i].y > target.y-influence) {
          color = "#EEE";
        } else if(particles[i].x+influence < target.x+(influence+30)  && particles[i].x-influence > target.x-(influence+30) && particles[i].y+influence < target.y+(influence+30) && particles[i].y-influence > target.y-(influence+30)) {
          color = "#EEE";
        } else if(particles[i].x+(influence+30) < target.x+(influence+70) && particles[i].x-(influence+30) > target.x-(influence+70) && particles[i].y+(influence+30) < target.y+(influence+70) && particles[i].y-(influence+30) > target.y-(influence+70)) {
          color = "#EEE";
        } else {
          color = "rgba(189, 195, 199,0.05)";
        }
        drop.draw2D("arc", {
          x : particles[i].x,
          y : particles[i].y,
          color : color,
          radius : 3,
          radian : Math.PI*2
        });
        if(target.x != 0 && target.y != 0) {
          if(particles[i].x < target.x+influence && particles[i].x > target.x-influence && particles[i].y < target.y+influence && particles[i].y > target.y-influence) {
            not_in = true;
            not_in2 = true;
            not_in3 = true;
            for(var j=0; j<in_particles_d1.length; j++) {
              if(in_particles_d1[j] == particles[i]) {
                not_in = false;
                break;
              }
            }
            if(not_in) {
                in_particles_d1.push(particles[i]);
            }
          }
        }
        for(var j=0; j<in_particles_d1.length; j++) {
          if(in_particles_d1[j].x < target.x+influence && in_particles_d1[j].x > target.x-influence && in_particles_d1[j].y < target.y+influence && in_particles_d1[j].y > target.y-influence) {
            // do nothing
          } else {
            in_particles_d1.splice(j, 1);
          }
        }
        drop.draw2D("path", {
          color : "rgba(236, 240, 241,0.01)",
          points : in_particles_d1,
          style : "stroke"
        })
      }
    });
}
