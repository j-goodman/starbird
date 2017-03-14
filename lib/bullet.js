var Bullet = function (x, y, angle) {
  this.pos = {
    x: x,
    y: y,
  };
};

Bullet.prototype.draw = function () {
  game.ctx.fillStyle = '#0f0';
  game.ctx.fillRect(this.pos.x, this.pos.y, 3, 12);
};

Bullet.prototype.move = function () {
  this.pos.y -= 24;
};
