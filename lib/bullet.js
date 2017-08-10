var Bullet = function (x, y, angle) {
  this.pos = {
    x: x,
    y: y,
  };
  this.index = game.debris.length;
  this.angle = angle;
  this.hits = 0;
  this.color = '#0f0';
  this.setSpeedFromAngle();
  this.name = "bullet";
};

Bullet.prototype.setSpeedFromAngle = function () {
  this.speed = {
    x: 24 * Math.cos((this.angle - 90) * Math.PI/180),
    y: 24 * Math.sin((this.angle - 90) * Math.PI/180),
  };
};

Bullet.prototype.draw = function () {
  game.ctx.save();
  game.ctx.translate(this.pos.x, this.pos.y);
  game.ctx.rotate(this.angle * Math.PI/180);
  game.ctx.fillStyle = this.color;
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
