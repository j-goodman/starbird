onload = function () {
  var canvas = document.getElementById('canvas');
  game = {};
  game.ctx = canvas.getContext('2d');
  game.canvasHeight = canvas.height;
  game.canvasWidth = canvas.width;
  game.ctx.webkitImageSmoothingEnabled = false;
  game.ctx.mozImageSmoothingEnabled = false;
  game.ctx.imageSmoothingEnabled = false; /// future

  game.player = new Starbird ();
  game.quarry = new Starsnake ();
  game.stars = [];
  game.debris = [];
  fillStars();

  setInterval(gameInterval, 32);
};

var fillStars = function () {
  var i = 0;
  while (i < 6) {
    game.stars.push(new Star ());
    i++;
  }
};

var Star = function () {
  this.distance = Math.floor(Math.random() * 100);
  this.pos = {
    x: Math.random() * game.canvasWidth,
    y: Math.random() * game.canvasHeight - game.canvasHeight,
  };
  if (game.stars.length < 100) {
    this.pos.y = Math.random() * (game.canvasHeight + 200) - 200;
  }
  this.radius = 2 - (this.distance * 0.019);
};

Star.prototype.draw = function () {
  var brightness = 255 - this.distance * 2.4;
  game.ctx.fillStyle = 'rgb(' + brightness + ', ' + brightness + ', ' + brightness + ')';
  game.ctx.beginPath();
  game.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 360 * Math.PI/180, false);
  game.ctx.fill();
};

Star.prototype.move = function () {
  this.pos.y += (300 - this.distance) / 16;
};

var gameInterval = function () {
  game.player.act();
  game.quarry.act();

  fillStars();
  // game.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  // game.ctx.fillRect(0, 0, game.canvasWidth, game.canvasHeight);
  game.ctx.clearRect(0, 0, game.canvasWidth, game.canvasHeight);

  game.ctx.save();
  game.ctx.translate(game.player.pos.x, game.player.pos.y);
  game.ctx.rotate(game.player.angle * Math.PI/180);
  game.ctx.translate(-24, -24);
  game.ctx.drawImage(game.player.sprite, 0, 0, 48, 48);
  game.ctx.restore();

  game.ctx.save();
  game.ctx.translate(game.quarry.pos.x, game.quarry.pos.y);
  game.ctx.rotate(game.quarry.angle * Math.PI/180);
  game.ctx.translate(-24, -24);
  game.ctx.drawImage(game.quarry.sprite, 0, 0, 48, 48);
  game.ctx.restore();

  var i;
  var start = game.stars.length - 600;
  if (start < 0) {
    start = 0;
  }
  for (i=start ; i<game.stars.length ; i++) {
    game.stars[i].move();
    game.stars[i].draw();
  }
  for (i=0 ; i<game.debris.length ; i++) {
    if (game.debris[i]) {
      game.debris[i].move();
      if (game.debris[i]) {
        game.debris[i].draw();
      }
    }
  }
};
