<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Droplet Demonstration</title>
    <script src="dist/droplet.js" charset="utf-8"></script>
    <style media="screen">
      body {
        display : block;
        margin : 0;
        padding : 0;
      }
      canvas {
        display : block;
      }
    </style>
  </head>
  <body>
    <div id="drop_canvas"></div>
    <script>
      var drop = new Droplet({
        canvas : "drop_canvas",
        debug : false
      });
    </script>
  </body>
</html>
