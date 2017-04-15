/*
  _____  _____   ____  _____  _      ______ _______
 |  __ \|  __ \ / __ \|  __ \| |    |  ____|__   __|
 | |  | | |__) | |  | | |__) | |    | |__     | |
 | |  | |  _  /| |  | |  ___/| |    |  __|    | |
 | |__| | | \ \| |__| | |    | |____| |____   | |
 |_____/|_|  \_\\____/|_|    |______|______|  |_|


          Javascript small game engine
          Written by Yessine Taktak
          Version 0.1
          Graphics supported : 2D
          Thanks to : Keith Peter ( Coding Math )
*/

/* Properties */
drop_loops = [];
/* Methods */
var Droplet = function(argv) {
  this.props = {};
  try {
    var canvas_area = document.getElementById(argv.canvas);
    var canvas = document.createElement("canvas");
    this.props.width = canvas.width = argv.width || window.innerWidth;
    this.props.height = canvas.height = argv.height || window.innerHeight;
    this.props.debug = argv.debug || false;
    this.drop_element = true;
    if(argv.title != undefined && argv.title != "") {
      var title = document.createElement("title");
      title.innerHTML = argv.title;
      document.getElementsByTagName("head")[0].appendChild(title);
    }
    canvas_area.appendChild(canvas);

    this.context = canvas.getContext("2d");
    this.props.graphics = argv.graphics || "2d";

    if(this.props.debug) {
      console.log("[DROPLET] DEBUG : Initializing canvas {", this.props.width, this.props.height, this.props.graphics, "}");
    }

  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
Droplet.prototype.save = function() {
  this.context.save();
}
Droplet.prototype.restore = function() {
  this.context.restore();
}
Droplet.prototype.resetCanvas = function(x, y, width, height) {
  try {
    this.context.clearRect(x || 0, y || 0, width || this.props.width, height || this.props.height);
    if(this.props.debug) {
      console.log("[DROPLET] DEBUG : Resetting canvas {", x || 0, y || 0, width || this.props.width, height || this.props.height, "}");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
Droplet.prototype.draw2D = function(type, props) {
  try {
    if(this.props.graphics == "2d") {
      switch(type) {
        case "rect":
          this.context.beginPath();
          this.context.fillStyle = props.color || "#000";
          this.context.strokeStyle = props.color || "#000";
          this.context.rect(props.x, props.y, props.width, props.height);
          this.context.lineWidth = props.lineWidth || 1;
          this.context.shadowColor = props.shadow || "#FFFFFF";
          this.context.shadowBlur = props.blur || 0;
          this.context.lineCap = props.lineCap || "butt";
          props.style == "stroke" ? this.context.stroke() : this.context.fill();
          if(this.props.debug) {
            console.log("[DROPLET] DEBUG : Drawing rectangle {",props.color || "#000",props.x,props.y,props.width, props.height,props.lineWidth || 1,props.shadow || "#FFFFFF",props.blur || 0,props.lineCap || "butt",props.style,"}");
          }
          break;
        case "arc":
          this.context.beginPath();
          this.context.fillStyle = props.color || "#000";
          this.context.strokeStyle = props.color || "#000";
          this.context.arc(props.x, props.y, props.radius, props.radian, 0);
          this.context.lineWidth = props.lineWidth || 1;
          this.context.shadowColor = props.shadow || "#FFFFFF";
          this.context.shadowBlur = props.blur || 0;
          props.style == "stroke" ? this.context.stroke() : this.context.fill();
          if(this.props.debug) {
            console.log("[DROPLET] DEBUG : Drawing arc {",props.color || "#000",props.x,props.y,props.radius, props.radian, props.lineWidth || 1,props.shadow || "#FFFFFF",props.blur || 0,props.style,"}");
          }
          break;
        case "path":
          this.context.beginPath();
          this.context.fillStyle = props.color || "#000";
          this.context.strokeStyle = props.color || "#000";
          (props.points[0] != undefined) && this.context.moveTo(props.points[0].x, props.points[0].y);
          for(var i=0; i<props.points.length; i++) {
            this.context.lineTo(props.points[i].x, props.points[i].y);
          }
          props.close && this.context.closePath();
          this.context.lineWidth = props.lineWidth || 1;
          this.context.shadowColor = props.shadow || "#FFFFFF";
          this.context.shadowBlur = props.blur || 0;
          props.style == "stroke" ? this.context.stroke() : this.context.fill();
          if(this.props.debug) {
            console.log("[DROPLET] DEBUG : Drawing path {",props.points.length || 0,props.close, props.lineWidth || 1,props.shadow || "#FFFFFF",props.blur || 0,props.style,"}");
          }
          break;
        case "text":
          this.context.beginPath();
          this.context.fillStyle = props.color || "#000";
          this.context.strokeStyle = props.color || "#000";
          this.context.font = props.font;
          this.context.fillText(props.text, props.x, props.y);
          break;
      }
    } else {
      console.log("[DROPLET] WARNING : Graphics type is not 2D.");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
Droplet.prototype.sprite2D = function(sprite, x, y, row, col) {
  try {
    if(this.props.graphics == "2d") {
      if(sprite.droplet_component) {
        if(sprite.loaded) {
          this.context.beginPath();
          this.context.drawImage(sprite.sprite, sprite.props.fw*col, sprite.props.fh * row, sprite.props.fw, sprite.props.fh, x, y, sprite.props.width || sprite.props.fw, sprite.props.height || sprite.props.fh);
          if(this.props.debug) {
            console.log("[DROPLET] DEBUG : Drawing sprite <"+x+":"+y+":"+row+":"+col+":"+sprite.props.fw+":"+sprite.props.fh +":"+ sprite.props.width + ":" + sprite.props.height+ ">");
          }
        } else {
          console.log("[DROPLET] WARNING : Sprite not loaded.");
        }
      } else {
        console.log("[DROPLET] WARNING : Not a Droplet component.");
      }
    } else {
      console.log("[DROPLET] WARNING : Graphics type is not 2D.");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
Droplet.prototype.transform = function(transformation, props) {
  try {
    switch(transformation) {
      case 1:
        this.context.translate(props.x, props.y);
        if(this.props.debug) {
          console.log("[DROPLET] DEBUG : Translating context <"+props.x+":"+props.y+">");
        }
        break;
      case 2:
        this.context.rotate(props.angle);
        if(this.props.debug) {
          console.log("[DROPLET] DEBUG : Rotating context <"+props.angle+">");
        }
        break;
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
Droplet.prototype.grid2D = function(grid) {
  try {
    if(grid.droplet_component) {
      if(grid.built) {
        this.context.beginPath();
        for(var i=0; i<grid.grid_points.length; i++) {
          var p=grid.grid_points[i];
          if(p.p2 != null) {
            if(grid.lines) {
              this.context.moveTo(p.p2.x, p.p2.y);
              this.context.lineTo(p.x, p.y);
            }
          }
          if(p.p3 != null) {
            if(grid.lines) {
              this.context.moveTo(p.p3.x, p.p3.y);
              this.context.lineTo(p.x, p.y);
            }
          }
        }
        if(grid.lines) {
          this.context.strokeStyle = grid.grid_color;
          this.context.lineWidth = grid.line_width;
          this.context.stroke();
        }
        for(var i=0; i<grid.grid_points.length; i++) {
          var p=grid.grid_points[i];
          if(grid.points.shown) {
            this.context.beginPath();
            this.context.fillStyle = grid.points.color || "#7f8c8d";
            this.context.arc(p.x, p.y, grid.points.radius || 2, Math.PI*2, 0);
            this.context.fill();
          }
        }
        if(this.props.debug) {
          console.log("[DROPLET] DEBUG : Grid drawn successfully <"+grid.grid_width+":"+grid.grid_height+">.");
        }
      } else {
        console.log("[DROPLET] WARNING : Grid not built yet.");
      }
    } else {
      console.log("[DROPLET] WARNING : Not a droplet component.");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}

var Sprite = function(sprite_path, props,debug_mode) {
  try {
    this.path = sprite_path;
    this.loaded = false;
    this.debug_mode = debug_mode || false;
    this.sprite = null;
    this.props = {};
    this.props.fw = props.frame_width;
    this.props.fh = props.frame_height;
    this.props.width = props.width;
    this.props.height = props.height;
    this.droplet_component = true;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Creating sprite <"+this.path+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
Sprite.prototype.load = function() {
  try {
    this.sprite = new Image();
    this.sprite.src = this.path;
    this.sprite.onload = this.setup();
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
Sprite.prototype.setup = function() {
  try {
    this.loaded = true;
    if(this.loaded) {
      this.props.img_width = this.sprite.width;
      this.props.img_height = this.sprite.height;
      if(this.debug_mode) {
        console.log("[DROPLET] DEBUG : Sprite loaded <"+this.path+"> : "+this.props.img_width+":"+this.props.img_height);
      }
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var Point = function(x, y) {
  this.px = x;
  this.py = y;
  this.x = x;
  this.y = y;
  this.p2 = null;
  this.p3 = null;
  this.pinned = false;
  this.t = null;
}
Point.prototype.attach = function(p, t) {
  if(t==2) {
    this.p2 = p;
    this.t = 1;
  } else {
    this.p3 = p;
    this.t = 2;
  }
}
Point.prototype.pin = function() {
  this.pinned = true;
}
var Grid = function(width, height, sx, sy, props, debug_mode, points) {
  try {
    this.grid_width = width;
    this.grid_height = height;
    this.start_x = sx;
    this.start_y = sy;
    this.spacing = props.spacing || 7;
    this.debug_mode = debug_mode || false;
    this.grid_color = props.color || "#EEEEEE";
    this.line_width = props.line_width || 1;
    this.lines = props.lines || true;
    this.droplet_component = true;
    this.built = false;
    this.points = points || {shown : false};
    this.grid_points = [];
    if(this.debug_mode) {
        console.log("[DROPLET] DEBUG : Grid initialized <"+this.grid_width+":"+this.grid_height+":"+this.start_x+":"+this.start_y+">.")
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
Grid.prototype.build = function() {
  try {
    for(var y=0; y<this.grid_height; y++) {
      for(var x=0; x<this.grid_width; x++) {
        var p = new Point(this.start_x+x*this.spacing, this.start_y+y*this.spacing);
        x!=0&&p.attach(this.grid_points[this.grid_points.length-1], 2);
        y!=0&&p.attach(this.grid_points[(this.grid_points.length)-this.grid_width], 3);
        y==0&&p.pin();
        x==0&&p.pin();
        x==(this.grid_width-1)&&p.pin();
        this.grid_points.push(p);
      }
    }
    if(this.grid_points.length > 2) {
      this.built = true;
      if(this.debug_mode) {
        console.log("[DROPLET] DEBUG : Grid built successfully.");
      }
      return this.grid_points;
    }
    return [];
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var DropMap = function(map_url, sprite_sheet, props, debug_mode) {
  try {
    this.map_url = map_url;
    this.debug_mode = debug_mode || false;
    this.sprite = new Sprite(sprite_sheet, {frame_width : props.tile_width, frame_height : props.tile_height}, this.debug_mode);
    this.sprite.load();
    this.props = {};
    this.props.tile_width = props.tile_width;
    this.props.tile_height = props.tile_height;
    this.props.sx = props.start_x;
    this.props.sy = props.start_y;
    this.map = null;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Map initialized <"+this.map_url+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropMap.prototype.load = function(callback) {
  try {
    map_loader = new XMLHttpRequest();
    map_loader.open("GET", this.map_url, true);
    map_loader.send();
    map_loader.onreadystatechange = function() {
      if(map_loader.readyState == 4 && map_loader.status == 200) {
        map = JSON.parse(map_loader.responseText);
        callback(map)
      }
    };
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropMap.prototype.setup = function(map) {
  try {
    if(map.columns != null && map.columns != undefined && map.rows != null && map.rows != undefined && map.map != null && map.map != undefined && map.map[0][0] != null) {
      this.map = map;
      if(this.debug_mode) {
        console.log("[DROPLET] DEBUG : Map loaded.");
      }
    } else {
      console.log("[DROPLET] WARNING : Not a DROPLET map.");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e)
  }
}
DropMap.prototype.draw = function(drop) {
  try {
    if(drop.drop_element) {
      for(var y=0; y<this.map.rows; y++) {
        for(var x=0; x<this.map.columns; x++) {
          drop.sprite2D(this.sprite, (this.props.sx+(this.props.tile_width*x)), (this.props.sy+(this.props.tile_height*y)), this.map.map[y][x][0], this.map.map[y][x][1]);
        }
      }
      if(this.debug_mode) {
        console.log("[DROPLET] DEBUG : Map draw successfully.");
      }
    } else {
      console.log("[DROPLET] WARNING : Droplet object needed.");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropMap.prototype.place = function(drop, x, y, row, col) {
  try {
    if(drop.drop_element) {
      x = this.props.sx+(this.props.tile_width*x);
      y = this.props.sy+(this.props.tile_height*y);
      drop.sprite2D(this.sprite, x, y, row, col);
      if(this.debug_mode) {
        console.log("[DROPLET] DEBUG : Object placed successfully.");
      }
    } else {
      console.log("[DROPLET] WARNING : Droplet object needed.");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var DropSound = function(sound_path, props, debug) {
  try {
    this.sound_path = sound_path;
    this.sound = new Audio(sound_path);
    this.sound.volume = props.volume || 1;
    this.sound.muted = props.muted || false;
    this.debug_mode = debug || false;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Initializing new sound <"+this.sound_path+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropSound.prototype.play = function() {
  try {
    this.sound.play();
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Playing sound <"+this.sound_path+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropSound.prototype.pause = function() {
  try {
    this.sound.pause();
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Pausing sound <"+this.sound_path+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropSound.prototype.volume = function(volume) {
  try {
    this.sound.volume = volume;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Volume changed to <"+volume+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var DropParticle = function(x, y, direction, speed, mass, debug_mode, color) {
  try {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(direction)*speed;
    this.vy = Math.sin(direction)*speed;
    this.debug_mode = debug_mode || false;
    this.gravity = 0;
    this.friction = 1;
    this.mass = mass || 0;
    this.gravitations = [];
    this.springs = [];
    this.color = color || "#000";
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Particle initialized.");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.setDirection = function(direction) {
  try {
    var speed = this.getSpeed();
    this.vx = Math.cos(direction)*speed;
    this.vy = Math.sin(direction)*speed;
    if(this.debug_mode) {
      console.log("[DROPLET] New direction <"+this.vx+">:<"+this.vy+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.getDirection = function() {
  try {
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Direction <"+Math.atan2(this.vy, this.vx)+">");
    }
    return Math.atan2(this.vy, this.vx);
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.setSpeed = function(speed) {
  try {
    var direction = this.getDirection();
    this.vx = Math.cos(direction)*speed;
    this.vy = Math.sin(direction)*speed;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : New speed <"+this.vx+">:<"+this.vy+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.getSpeed = function() {
  try {
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Speed <"+Math.sqrt(this.vx*this.vx, this.vy*this.vy)+">");
    }
    return Math.sqrt(this.vx*this.vx, this.vy*this.vy);
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.directionTo = function(p) {
  try {
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Direction <"+Math.atan2(p.y-this.y, p.x-this.x)+">");
    }
    return Math.atan2(p.y-this.y, p.x-this.x);
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.distanceTo = function (p) {
  try {
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Distance <"+Math.sqrt(Math.pow(p.x-this.x, 2)+Math.pow(p.y-this.y, 2))+">");
    }
    return Math.sqrt(Math.pow(p.x-this.x, 2)+Math.pow(p.y-this.y, 2));
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.setGravity = function(gravity) {
  try {
    this.gravity = gravity;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Gravity <"+this.gravity+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.setFriction = function(friction) {
  try {
    this.friction = friction;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Friction <"+this.friction+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.accelerate = function(ax, ay) {
  try {
    this.vx += ax;
    this.vy += ay;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Acceleration <"+ax+":"+ay+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.springTo = function(p, k, length) {
  try {
    var dx = p.x - this.x,
        dy = p.y - this.y,
        ds = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2)),
        fo = (ds-length || 0)*k;
    this.vx += dx / ds * fo;
    this.vy += dy / ds * fo;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Spring <"+this.vx+":"+this.vy+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.gravitateTo = function(p) {
  try {
    var dx = p.x-this.x,
        dy = p.y-this.y,
        ds = Math.pow(dx, 2)+Math.pow(dy, 2),
        dq = Math.sqrt(ds),
        fo = p.mass/ds;
    this.vx += dx / dq * fo;
    this.vy += dy / dq * fo;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Gravitation <"+this.vx+":"+this.vy+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.addSpring = function(point, k, length) {
  try {
    this.removeSpring(point);
    this.springs.push({
      point : point,
      k : k,
      length : length || 0
    });
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.removeSpring = function(point) {
  try {
    for(var i=0; i<this.springs.length; i++) {
      if(this.springs[i].point == point) {
        this.springs.splice(i, 1);
        return ;
      }
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.handleSprings = function() {
  try {
    for(var i=0; i<this.springs.length; i++) {
      var spring = this.springs[i];
      this.springTo(spring.point, spring.k, spring.length);
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.addGravitation = function(point) {
  try {
    this.removeGravitation(point);
    this.gravitations.push(point);
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.removeGravitation = function(point) {
  try {
    for(var i=0; i<this.gravitations.length; i++) {
      if(this.gravitations[i] == point) {
        this.gravitations.splice(i, 1);
      }
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.handleGravitations = function() {
  for(var i=0; i<this.gravitations.length; i++) {
    this.gravitateTo(this.gravitations[i]);
  }
}
DropParticle.prototype.handleEdge = function(sx, sy, width, height, bounce, radius) {
  try {
    var radius = radius || 0;
    var sx = sx || 0;
    var sy = sy || 0;
    if(this.x-radius < sx) {
      this.x = radius;
      this.vx *= bounce;
    } else if(this.x+radius > width) {
      this.x = width-radius;
      this.vx *= bounce;
    } else if(this.y-radius < sy) {
      this.y = radius;
      this.vy *= bounce;
    } else if(this.y+radius > height) {
      this.y = height-radius;
      this.vy *= bounce;
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropParticle.prototype.render = function() {
  try {
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.handleSprings();
    this.handleGravitations();
    this.x += this.vx;
    this.y += this.vy;
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var DropVerlet = function(x, y, ox, oy, physics, env, pinned, debug_mode) {
  try {
    this.x = x;
    this.y = y;
    this.ox = ox;
    this.oy = oy;
    this.gravity = physics.gravity || 0;
    this.friction = physics.friction || 1;
    this.pinned = pinned || false;
    this.sx = env.sx || 0;
    this.sy = env.sy || 0;
    this.width = env.width;
    this.height = env.height;
    this.surface = env.surface || undefined;
    this.debug_mode = debug_mode;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : DropVerlet <"+this.x+":"+this.y+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropVerlet.prototype.constrainPoint = function(bounceRatio, radius) {
  try {
    bounceRatio = bounceRatio || .9;
    radius = radius || 0;
    var vx = (this.x-this.ox)*this.friction,
        vy = (this.y-this.oy)*this.friction;
    if(this.x-radius < this.sx) {
      this.x = this.sx+radius;
      this.ox = this.x+vx*bounceRatio;
    } else if(this.x+radius > this.width) {
      this.x = this.width-radius;
      this.ox = this.x+vx*bounceRatio;
    } else if(this.y-radius < this.sy) {
      this.y = this.sy+radius;
      this.oy = this.y+vy*bounceRatio;
    } else if(this.y+radius > this.height) {
      this.y = this.height-radius;
      this.oy = this.y+vy*bounceRatio;
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropVerlet.prototype.render = function() {
  try {
    var vx = (this.x-this.ox)*this.friction,
        vy = (this.y-this.oy)*this.friction;
    this.ox = this.x;
    this.oy = this.y;
    this.x += vx;
    this.y += vy;
    if(!this.pinned ) {
      if(this.surface != undefined) {
        if(this.y < this.surface) {
          this.y += this.gravity;
        } else {
          this.oy = this.y = this.surface;
        }
      } else {
        this.y += this.gravity;
      }

    }
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Verlet <"+this.x+":"+this.y+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var DropAnimation = function(x, y, debug_mode) {
  try {
    this.x = x;
    this.y = y;
    this.tx = 0;
    this.tx = 0;
    this.animationType = null;
    this.debug_mode = debug_mode;
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Animating particle <"+this.x+":"+this.y+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropAnimation.prototype.easeTo = function(x, y, ease) {
  try {
    this.tx = x;
    this.ty = y;
    this.ease = ease || .1;
    this.animationType = "ease";
    if(this.debug_mode) {
      console.log("[DROPLET] DEBUG : Setting animation to 'ease' <"+this.tx+":"+this.ty+">");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropAnimation.prototype.render = function() {
  try {
    if(this.animationType != "null") {
      switch(this.animationType) {
        case "ease":
          var dx = this.tx-this.x,
              dy = this.ty-this.y;
          var vx = dx*this.ease,
              vy = dy*this.ease;
          this.x += vx;
          this.y += vy;
          break;
        case "tween":

          break;
      }
    } else {
      console.log("[DROPLET] WARNING : No animation type specified.");
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var DropLoop = function(loop_subject, timeout) {
  try {
    var timeout = timeout || 1000/60;
    drop_loops.push(setInterval(loop_subject, timeout));
    return drop_loops.length-1;
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var closeLoop = function(index) {
  try {
    if(index < drop_loops.length) {
      clearInterval(drop_loops[index]);
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var DropConfig = function(cfg_url, callback, debug_mode) {
  try {
    cfg_loader = new XMLHttpRequest();
    cfg_loader.open("GET", cfg_url, true);
    cfg_loader.send();
    var debug = debug_mode || false;
    cfg_loader.onreadystatechange = function() {
      if(cfg_loader.readyState == 4 && cfg_loader.status == 200) {
        if(debug) {
          console.log("[DROPLET] DEBUG : Config loaded.");
        }
        cfg = JSON.parse(cfg_loader.responseText);
        callback(cfg);
      }
    };
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
var DropCollide = function() {
  try {
    this.created = true;
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropCollide.prototype.collide = function(type, props) {
  try {
    switch(type) {
      case 1: // Point-Rectangle collision
        return this.inRange(props.x, props.rx, props.rx+props.rwidth) && this.inRange(props.y, props.ry, props.ry+props.rheight);
        break;
      case 2: // Rectangle-Rectangle collision
        return this.rangeIntersect(props.r0.x, props.r0.x+props.r0.width, props.r1.x, props.r1.x+props.r1.width) && this.rangeIntersect(props.r0.y, props.r0.y+props.r0.height, props.r1.y, props.r1.y+props.r1.height);
        break;
      case 3: // Circle-Point collision
        return this.distanceXY(props.x, props.y, props.cx, props.cy) < props.radius;
        break;
      case 4: // Circle-Circle collision
        return this.distance(props.c0, props.c1) <= props.c0.radius + props.c1.radius;
        break;
    }
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
DropCollide.prototype.inRange = function(value, min, max) {
		return value >= Math.min(min, max) && value <= Math.max(min, max);
}
DropCollide.prototype.rangeIntersect = function(min0, max0, min1, max1) {
  return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
}
DropCollide.prototype.distanceXY = function(x0, y0, x1, y1) {
  var dx = x1 - x0,
			dy = y1 - y0;
  return Math.sqrt(dx * dx + dy * dy);
}
DropCollide.prototype.distance = function(p0, p1) {
  var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}
var DropFonts = function(style_url) {
  try {
    var style = document.createElement("style");
    style.innerHTML = "@import url('"+style_url+"');";
    var head = document.getElementsByTagName("head")[0].appendChild(style);
  } catch(e) {
    console.log("[DROPLET] ERROR : "+e);
  }
}
