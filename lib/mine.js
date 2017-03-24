var Mine = function (x, y, xspeed, yspeed) {
  this.sprite = document.getElementById('mine-sprite');
  this.pos = {
    x: x,
    y: y,
  };
  this.index = game.debris.length;
  this.angle = Math.floor(Math.random() * 360);
  this.speed = {
    x: xspeed,
    y: yspeed,
  };
  this.exploded = false;
  this.shrapnel = [];
  this.name = "mine";
};

Mine.prototype.draw = function () {
  if (this.exploded) {
    this.drawExplosion();
  } else {
    this.drawIntact();
  }
};

Mine.prototype.drawIntact = function () {
  game.ctx.save();
  game.ctx.translate(this.pos.x, this.pos.y);
  game.ctx.rotate(this.angle * Math.PI/180);
  game.ctx.translate(-12, -12);
  game.ctx.drawImage(this.sprite, 0, 0, 24, 24);
  game.ctx.restore();
};

Mine.prototype.drawExplosion = function () {
  game.ctx.fillStyle = '#ddd';
  if (Math.floor(Math.random() * 2)) {
    game.ctx.fillStyle = '#bbb';
  }
  var i; var x; var y;
  for (i=0 ; i<this.shrapnel.length ; i++) {
    x = this.pos.x + this.shrapnel[i].x;
    y = this.pos.y + this.shrapnel[i].y;
    game.ctx.fillRect(x, y, 3, 3);
    this.shrapnel[i].x += (Math.round(Math.random() * 16 - 8));
    this.shrapnel[i].y += (Math.round(Math.random() * 4 - 2));
  }
};

Mine.prototype.move = function () {
  this.pos.y += this.speed.y;
  this.pos.x += this.speed.x;
  this.angle -= 2;
  if (!this.exploded) {
    this.checkCollisions();
  }
  if (this.pos.y > game.canvasHeight) {
    this.destroy();
  }
};

Mine.prototype.checkCollisions = function () {
  var j; var debris;
  for (j=0 ; j<game.debris.length ; j++) {
    debris = game.debris[j];
    if (!debris) {
      continue;
    } else if (debris.name == "bullet") {
      if (
        Math.abs(debris.pos.x - this.pos.x) < 20 &&
        Math.abs(debris.pos.y - this.pos.y) < 16
         )
      {
        this.explode();
      }
    }
  }
  if (
    Math.abs(game.player.pos.x - this.pos.x) < 24 &&
    Math.abs(game.player.pos.y - this.pos.y) < 24
  ) {
    this.explode();
    game.player.hitByMine();
  }
};

Mine.prototype.explode = function () {
  this.exploded = true;
  var i;
  for (i=0 ; i<24 ; i++) {
    this.shrapnel.push({x: 0, y: Math.round((Math.random() * 32) - 16)});
  }
};

Mine.prototype.destroy = function () {
  game.debris[this.index] = undefined;
};
