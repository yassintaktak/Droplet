var drop = new Droplet({
  canvas : "drop_canvas",
  debug : false
})
DropFonts("https://fonts.googleapis.com/css?family=VT323");
DropConfig("drop_cfg.json", game);
/* Game core */
function game(game_config) {
  /* Config */
  var config = {
    cfg_frame_rate : game_config.cfg_frame_rate || 77,
    cfg_mv_right : game_config.cfg_mv_right || 39,
    cfg_mv_left : game_config.cfg_mv_left || 37,
    cfg_mv_up : game_config.cfg_mv_up || 38,
    cfg_mv_down : game_config.cfg_mv_down || 40,
    cfg_mv_speed : game_config.cfg_mv_speed || 8,
    cfg_jumping_ratio : game_config.cfg_jumping_ratio || 3,
    cfg_gravity : game_config.cfg_gravity || 2,
    cfg_max_jump : game_config.cfg_max_jump || 100,
    cfg_translate_ratio : game_config.cfg_translate_ratio || 6,
    cfg_width_ratio : game_config.cfg_width_ratio || 5,
    cfg_control : game_config.cfg_control || 17,
    cfg_mv_control : game_config.cfg_mv_control || 3,
  }
  /* Variables */
  var movements = {
    up : 0,
    down : 0,
    left : 0,
    right : 0
  };
  var moving = {
    left : false,
    right : false,
    up : false,
    control : false,
    space : false
  }
  var rope_collapse_point = 0;
  var current_collision_object = 0;
  var collision_y = 0;
  var jumping = 0;
  var move_foreward = 0;
  var move_backward = 0;
  var jump_foreward = 0;
  var jump_backward = 0;
  var surface = drop.props.height-84;
  var direction = 0;
  var jumping_direction = 3;
  var jumping_vector = 0;
  var jumping_high = 0;
  var jumping_low = 0;
  var min = 0;
  var main_loop = 0;
  var upper_surface = false;
  var rope_collapse = false;
  var translate_data = 0;
  var rope_config = {
    move_right : false,
    move_left : false,
    jump : false
  }
  var gravity_ratio_2 = 1;
  var object = {
    x : 30,
    y : drop.props.height-84,
    died : false
  }
  var collide = {
    left : false,
    right : false,
    up : false
  }
  /* Sprites & Images */
  var bg = new Sprite("background.png", {frame_width:drop.props.width, frame_height:drop.props.height+350, width : drop.props.width, height : drop.props.height});
  var bg2 = new Sprite("background2.png", {frame_width:drop.props.width, frame_height:drop.props.height+350, width : drop.props.width, height : drop.props.height});
  var bg3 = new Sprite("background3.png", {frame_width:drop.props.width, frame_height:drop.props.height+350, width : drop.props.width, height : drop.props.height});
  var bg4 = new Sprite("background4.png", {frame_width:drop.props.width, frame_height:drop.props.height+350, width : drop.props.width, height : drop.props.height});
  var game = new Sprite("sprite.png", {frame_width:130, frame_height:230, height : 55, width : 55});
  var box = new Sprite("box.png", {frame_width : 520, frame_height : 520, width : 90, height : 90});
  var spike = new Sprite("spike.png", {frame_width : 520, frame_height : 520, width : 100, height : 60});
  bg.load();
  bg2.load();
  bg3.load();
  bg4.load();
  box.load();
  spike.load();
  game.load();
  /* Particles & Points */
  var objects = new Array();
  objects.push({
    asset : box,
    verlet : new DropVerlet(200, surface-36, 200, surface-36, {friction : 0.9, gravity : 2}, {surface : surface-36, width : drop.props.width, height : drop.props.height}, false, false),
    movable : true
  });
  objects.push({
    asset : box,
    verlet : new DropVerlet(400, surface-36, 400, surface-36, {friction : 0.9, gravity : 2}, {surface : surface-36, width : drop.props.width, height : drop.props.height}, false, false),
    movable : true
  });
  objects.push({
    asset : box,
    verlet : new DropVerlet(600, surface-36, 600, surface-36, {friction : 0.9, gravity : 2}, {surface : surface-36, width : drop.props.width, height : drop.props.height}, false, false),
    movable : true
  });
  objects.push({
    asset : box,
    verlet : new DropVerlet(600, 100, 600, 100, {friction : 0.9, gravity : 2}, {surface : surface-36, width : drop.props.width, height : drop.props.height}, false, false),
    movable : true
  });
  objects.push({
    asset : spike,
    verlet : new DropVerlet(708, surface+30, 708, surface+30, {friction : 1, gravity : 0}, {surface : surface+300, width : drop.props.width, height : drop.props.height}, false, false),
    trap : true,
    movable : true
  });
  objects.push({
    asset : spike,
    verlet : new DropVerlet(800, surface+30, 800, surface+30, {friction : 1, gravity : 0}, {surface : surface+300, width : drop.props.width, height : drop.props.height}, false, false),
    trap : true,
    movable : true
  });
  objects.push({
    asset : box,
    verlet : new DropVerlet(900, surface-36, 900, surface-36, {friction : 0.9, gravity : 0.5}, {surface : surface-36, width : drop.props.width, height : drop.props.height}, false, false),
    trap : false,
    movable : false
  });
  /* Rope */
  var rope1 = {
    sticks : [],
    points : []
  }
  rope1.points.push(new DropVerlet(800, 200, 800, 200, {friction : 0.999, gravity : 5}, {surface : surface, width : drop.props.width, height : drop.props.height}, true, false));
  rope1.points.push(new DropVerlet(750, 200, 750, 200, {friction : 0.999, gravity : 5}, {surface : surface, width : drop.props.width, height : drop.props.height}, false, false));
  rope1.points.push(new DropVerlet(700, 200, 700, 200, {friction : 0.999, gravity : 5}, {surface : surface, width : drop.props.width, height : drop.props.height}, false, false));
  rope1.points.push(new DropVerlet(650, 200, 650, 200, {friction : 0.999, gravity : 5}, {surface : surface, width : drop.props.width, height : drop.props.height}, false, false));
  rope1.sticks.push({
    p0 : rope1.points[0],
    p1 : rope1.points[1],
    length : Math.sqrt((rope1.points[1].x-rope1.points[0].x)*(rope1.points[1].x-rope1.points[0].x)+(rope1.points[1].y-rope1.points[0].y)*(rope1.points[1].y-rope1.points[0].y))
  });
  rope1.sticks.push({
    p0 : rope1.points[1],
    p1 : rope1.points[2],
    length : Math.sqrt((rope1.points[2].x-rope1.points[1].x)*(rope1.points[2].x-rope1.points[1].x)+(rope1.points[2].y-rope1.points[1].y)*(rope1.points[2].y-rope1.points[1].y))
  });
  rope1.sticks.push({
    p0 : rope1.points[2],
    p1 : rope1.points[3],
    length : Math.sqrt((rope1.points[3].x-rope1.points[2].x)*(rope1.points[3].x-rope1.points[2].x)+(rope1.points[3].y-rope1.points[2].y)*(rope1.points[3].y-rope1.points[2].y))
  });
  /* Objects */
  var collisionModule = new DropCollide();
  /* Functions */
  function environment() {
    drop.sprite2D(bg, 0, 0, 0, 0);
    drop.sprite2D(bg2, drop.props.width, 0, 0, 0);
    drop.sprite2D(bg3, drop.props.width+400, 0, 0, 0);
    drop.sprite2D(bg4, drop.props.width+660, 0, 0, 0);
    for(var i=0; i<10000; i+=260) {
      drop.sprite2D(bg4, drop.props.width+(920+i), 0, 0, 0);
    }
    for(var i=0; i<objects.length; i++) {
      var object = objects[i];
      drop.sprite2D(object.asset, object.verlet.x, object.verlet.y, 0, 0);
    }
    for(var i=0; i<rope1.points.length; i++) {
      drop.draw2D("arc", {
        x : rope1.points[i].x,
        y : rope1.points[i].y,
        radian : Math.PI*2,
        radius : 2,
        color : "red"
      })
    }
    for(var i=0; i<rope1.sticks.length; i++) {
      drop.context.beginPath();
      drop.context.moveTo(rope1.sticks[i].p0.x, rope1.sticks[i].p0.y);
      drop.context.lineTo(rope1.sticks[i].p1.x, rope1.sticks[i].p1.y);
      drop.context.stroke();
    }
  }
  /* Game */
  environment();
  drop.sprite2D(game, object.x, object.y, 0, 0);
  /* Movement control options */
  window.onkeydown = function(e) {
    switch(e.keyCode) {
      case config.cfg_mv_right:
        if(!moving.right && !object.died) {
          moving.right = true;
          if(!rope_collapse) {
            direction = 0;
            movements.right = DropLoop(function() {
              if(!collide.right) {
                object.x += config.cfg_mv_speed;
                translate_data += config.cfg_translate_ratio;
                drop.transform(1, {
                  x : -config.cfg_translate_ratio,
                  y : 0
                });
              }
              if(!moving.up) {
                  drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
                  environment();
                  drop.sprite2D(game, object.x, object.y, 0, move_foreward);
                  if(move_foreward > 4) {
                    move_foreward = 0;
                  }
                  move_foreward++;
              }
            }, config.cfg_frame_rate);
          } else {
            direction = 0;
            rope_config.move_right = true;
          }
        }
        break;
      case config.cfg_mv_left:
        if(!moving.left && !object.died) {
          moving.left = true;
          if(!rope_collapse) {
            direction = 1;
            movements.left = DropLoop(function() {
              if(object.x > 0) {
                if(!collide.left) {
                  object.x -= config.cfg_mv_speed;
                  translate_data -= config.cfg_translate_ratio;
                  drop.transform(1, {
                    x : config.cfg_translate_ratio,
                    y : 0
                  });
                }

              }
              if(!moving.up) {
                drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
                environment();
                drop.sprite2D(game, object.x, object.y, 1, move_backward);
                if(move_backward > 4) {
                  move_backward = 0;
                }
                move_backward++;
              }

            }, config.cfg_frame_rate);
          } else {
            rope_config.move_left = true;
            direction = 1;
          }
        }
        break;
      case config.cfg_control:
        moving.control = true;
        break;
      case config.cfg_mv_up:
        if(!object.died) {
          if(direction == 0) {
            jumping_vector = 0;
            jumping_direction = 2;
            jumping_high = 0;
            jumping_low = 2;
          } else {
            jumping_vector = 1;
            jumping_direction = 3;
            jumping_high = 1;
            jumping_low = 0;
          }
          if(rope_collapse) {
            if(direction == 0) {
              object.x += 70;
            } else {
              object.x -= 70;
            }
            drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
            environment();
            drop.sprite2D(game, object.x, object.y, direction, 0);
            rope_collapse = false;
          }
          if(!moving.up && !rope_collapse) {
            moving.up = true;
            movements.up = DropLoop(function() {
              drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
              environment();
              if(jumping < config.cfg_max_jump) {
                jumping += config.cfg_jumping_ratio;
                object.y += 2;
                object.y -= config.cfg_jumping_ratio;
                drop.sprite2D(game, object.x, object.y, jumping_direction, jumping_high);
              } else {
                if(!collide.up) {
                  object.y += config.cfg_gravity;
                  drop.sprite2D(game, object.x, object.y, jumping_direction, jumping_low);
                  if(object.y >= surface) {
                    drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
                    environment();
                    object.y = surface;
                    moving.up = false;
                    if(movements.up != 0) {
                      closeLoop(movements.up);
                    }

                    jump_foreward = 0;
                    jumping = 0;
                    drop.sprite2D(game, object.x, object.y, jumping_vector, 0);
                  }
                } else {
                  drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
                  environment();
                  moving.up = false;
                  if(movements.up != 0) {
                    closeLoop(movements.up);
                  }
                  jump_foreward =
                  0;
                  jumping = 0;
                  object.y = collision_y;
                  drop.sprite2D(game, object.x, object.y, 0, 0);
                }
            }
            }, config.cfg_frame_rate-20);
          }
        }
        break;
    }
  }
  window.onkeyup = function(e) {
    switch(e.keyCode) {
      case config.cfg_mv_right:
        if(!object.died) {
          drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
          if(moving.left && movements.left != 0) {
            closeLoop(movements.left);
          }
          environment();
          if(movements.right != 0) {
            closeLoop(movements.right);
          }
          move_foreward = 0;
          drop.sprite2D(game, object.x, object.y, 0, move_foreward);
          moving.right = false;
          if(rope_collapse) {
            rope_config.move_right = false;
          }
        }
        break;
      case config.cfg_mv_left:
        if(!object.died) {
          drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
          if(moving.right && movements.right != 0) {
            closeLoop(movements.right);
          }
          environment();
          if(movements.left != 0) {
            closeLoop(movements.left);
          }
          move_backward = 0;
          drop.sprite2D(game, object.x, object.y, 1, move_backward);
          moving.left = false;
          if(rope_collapse) {
            rope_config.move_left = false;
          }
        }
        break;
      case config.cfg_control:
        moving.control = false;
        break;
    }
  }
  /* Main Loop */
  main_loop = DropLoop(function() {
    if(object.died) {
      closeLoop(main_loop);
      closeLoop(movements.up);
      closeLoop(movements.left);
      closeLoop(movements.right);
      drop.draw2D("text", {
        x : drop.props.width/2+translate_data-148,
        y : drop.props.height/2-10,
        text : "YOU DIED !",
        font : "68px VT323"
      })
    }
    for(var i=0; i<objects.length; i++) {
      var object_a = objects[i];
      object_a.verlet.render();
    }
    for(var i=0; i<rope1.points.length; i++) {
      rope1.points[i].render();
    }
    if(rope_config.move_right) {
        for(var i=0; i<rope1.points.length; i++) {
          if(!rope1.points[i].pinned) {
            rope1.points[i].x += 0.9;
            rope1.points[i].y -= 2;
          }
        }
    }
    if(rope_config.move_left) {
        for(var i=0; i<rope1.points.length; i++) {
          if(!rope1.points[i].pinned) {
            rope1.points[i].x -= 0.9;
            rope1.points[i].y -= 2;
          }
        }
    }
    for(var i=0; i<rope1.sticks.length; i++) {
      var p0 = rope1.sticks[i].p0,
          p1 = rope1.sticks[i].p1,
          dx = p1.x-p0.x,
          dy = p1.y-p0.y,
          ds = Math.sqrt(dx*dx+dy*dy),
          df = rope1.sticks[i].length-ds,
          pc = df/ds/2,
          ox = dx*pc,
          oy = dy*pc;
      if(!p0.pinned) {
        rope1.sticks[i].p0.x -= ox;
        rope1.sticks[i].p0.y -= oy;
      }
      if(!p1.pinned) {
        rope1.sticks[i].p1.x += ox;
        rope1.sticks[i].p1.y += oy;
      }
    }
    for(var i=0; i<objects.length; i++) {
      var object_a = objects[i];
      if(!collisionModule.collide(2, {
        r0 : {
          x : object.x,
          y : object.y,
          width : 33,
          height : 55
        },
        r1 : {
          x : object_a.verlet.x,
          y : object_a.verlet.y,
          width : 90,
          height : 90
        }
      })) {
        collide.up = false;
      } else {
        if(object.y < object_a.verlet.y) {
          collide.up = true;
          collision_y = object_a.verlet.y-56;
          current_collision_object = i;
          break;
        }
      }
    }
    if(!moving.right && !moving.left && !moving.up) {
      drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
      environment();
      drop.sprite2D(game, object.x, object.y, direction, 0);
    }
    if(!collide.up && object.y < surface-10 && !moving.up) {
      var object_a = objects[current_collision_object];
      if(!collisionModule.collide(2, {
        r0 : {
          x : object.x,
          y : object.y,
          width : 55,
          height : 60
        },
        r1 : {
          x : object_a.verlet.x,
          y : object_a.verlet.y,
          width : 90,
          height : 90
        }
      })  && object.y < surface-10 && !moving.up) {
        upper_surface = true;
      } else {
        upper_surface = false;
      }
    }
    if(upper_surface && object.y < surface-10 && !moving.up && !rope_collapse) {
      object.y += 10;
    }
    for(var i=0; i<objects.length; i++) {
      var object_a = objects[i];
      if(moving.control) {
        if(collisionModule.collide(2, {
          r0 : {
            x : object.x,
            y : object.y,
            width : 55,
            height : 55
          },
          r1 : {
            x : object_a.verlet.x,
            y : object_a.verlet.y,
            width : 90,
            height : 90
          }
        })) {
          if(object_a.verlet.x > 100 && object_a.movable) {
            if(moving.right && !moving.left) {
              object_a.verlet.x += config.cfg_mv_control;
            } else if(moving.left && !moving.right) {
              object_a.verlet.x -= config.cfg_mv_control;
            }
          }
        }
      }
    }
    for(var i=0; i<objects.length; i++) {
      var object_a = objects[i];
      if(!collisionModule.collide(2, {
        r0 : {
          x : object.x,
          y : object.y,
          width : 55,
          height : 55
        },
        r1 : {
          x : object_a.verlet.x,
          y : object_a.verlet.y,
          width : 90,
          height : 90
        }
      }) ) {
        if(direction == 0) {
          collide.right = false;
        } else {
          collide.left = false;
        }
      } else {
        if(direction == 0) {
          collide.right = true;
          object.x -= 0.8;
        } else {
          collide.left = true;
          object.x += 0.8;
        }
        break;
      }
    }

  for(var i=0; i<objects.length; i++) {
    var object_a = objects[i];
    for(var j=0; j<objects.length; j++) {
      if(i != j) {
        var object_b = objects[j];
        if(collisionModule.collide(2, {
          r0 : {
            x : object_a.verlet.x,
            y : object_a.verlet.y,
            width : 90,
            height : 90
          },
          r1 : {
            x : object_b.verlet.x,
            y : object_b.verlet.y,
            width : 90,
            height : 90
          }
        })) {
          if(object_b.verlet.y == object_a.verlet.y) {
            if(object_b.movable) {
              if(direction == 0) {
                object_b.verlet.x = object_a.verlet.x+90.00005;
              } else {
                object_a.verlet.x = object_b.verlet.x-90.00005;
              }
            } else {
              object_a.verlet.x -= 6;
            }
          } else {
            var pin = object_b.pinned || false;
            object_b.verlet.y = object_a.verlet.y-90.0005;
            if(pin) {
              object_b.verlet.x = object_a.verlet.x;
            }
          }
        }
      }

  }
}
for(var i=0; i<objects.length; i++) {
  var trap = false || objects[i].trap;
  if(trap) {
    if(collisionModule.collide(2, {
      r0 : {
        x : object.x,
        y : object.y,
        width : 55,
        height : 55
      },
      r1 : {
        x : objects[i].verlet.x,
        y : objects[i].verlet.y,
        width : 99,
        height : 99
      }
    })) {
      object.y += 10;
      object.died = true;
    }
  }
}
for(var i=0; i<rope1.points.length; i++) {
  var p = rope1.points[i];
  if(collisionModule.collide(1, {
    x : p.x,
    y : p.y,
    rx : object.x,
    ry : object.y,
    rwidth : 55,
    rheight : 55
  })) {
    rope_collapse_point = i;
    moving.up = false;
    if(movements.up != 0) {
      closeLoop(movements.up);
    }
    object.x = p.x-20;
    object.y = p.y-25;
    rope_collapse = true;
    drop.resetCanvas(0, 0, drop.props.width*config.cfg_width_ratio, drop.props.height);
    environment();
    drop.sprite2D(game, object.x, object.y, direction, 0);
  }
}
});
}
