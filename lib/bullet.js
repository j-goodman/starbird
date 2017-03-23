var Bullet = function (x, y, angle) {
  this.pos = {
    x: x,
    y: y,
  };
  this.index = game.debris.length;
  this.angle = angle;
  this.speed = {
    x: 24 * Math.cos((angle - 90) * Math.PI/180),
    y: 24 * Math.sin((angle - 90) * Math.PI/180),
  };
  this.name = "bullet";
};

Bullet.prototype.draw = function () {
  game.ctx.save();
  game.ctx.translate(this.pos.x, this.pos.y);
  game.ctx.rotate(this.angle * Math.PI/180);
  game.ctx.fillStyle = '#0f0';
  game.ctx.fillRect(0, 0, 4, 12);
  game.ctx.restore();
};

Bullet.prototype.move = function () {
  this.pos.y += this.speed.y;
  this.pos.x += this.speed.x;
  if (this.pos.y < 0) {
    this.destroy();
  }
};

Bullet.prototype.destroy = function () {
  game.debris[this.index] = undefined;
};
