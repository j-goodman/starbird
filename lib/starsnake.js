var Starsnake = function () {
  this.sprite = document.getElementById('snake-sprite');
  this.pos = {
    x: -200,
    y: 64,
  };
  this.angle = 0;
  this.time = 0;
  this.timeFunctions = {};
  this.maneuvering = false;
  this.cooldown = 0;
  this.feint('right', 12);
  this.mineInfrequency = 18;
};

Starsnake.prototype.act = function () {
  this.decide();
  if (this.rightPressed) {
    this.angle += 6;
  }
  if (this.leftPressed) {
    this.angle -= 6;
  }
  this.tilt = this.angle % 360;
  if (this.tilt > 180) {
    this.tilt -= 360;
  } else if (this.tilt < -180) {
    this.tilt += 360;
  }
  this.pos.x += this.tilt / 1.5;
  if (this.pos.x < -500) {
    this.angle = 18;
  } else if (this.pos.x > game.canvasWidth + 500) {
    this.angle = -18;
  }
  this.time += 1;
  if (this.timeFunctions[this.time]) {
    this.timeFunctions[this.time]();
  }
  if (game.score >= 12) {
    this.mineInfrequency = 16;
  }
  if (game.score >= 30) {
    this.mineInfrequency = 12;
  }
  if (game.score >= 45) {
    this.mineInfrequency = 9;
  }
  if (game.score >= 100) {
    this.mineInfrequency = 2;
  }
  if (!Math.floor(Math.random() * this.mineInfrequency) && this.cooldown < 0 && !game.player.exploded) {
    this.dropMine();
  }
  this.cooldown -= 1;
};

Starsnake.prototype.decide = function () {
  if (!Math.floor(Math.random() * 6) && !this.maneuvering) {
    if (this.pos.x > 800 && !Math.floor(Math.random() * 4)) {
      this.feint('left', 10);
    } else if (this.pos.x < game.canvasWidth - 800 && !Math.floor(Math.random() * 4)) {
      this.feint('right', 10);
    } else {
      if (this.pos.x > game.canvasWidth / 2) {
        this.feint('left', Math.ceil(Math.random() * 9));
      } else {
        this.feint('right', Math.ceil(Math.random() * 9));
      }
    }
  }
};

Starsnake.prototype.feint = function (direction, magnitude) {
  var nonDirection = (direction == 'right') ? 'left' : 'right';
  this.maneuvering = true;
  this[nonDirection + 'Pressed'] = false;
  this[direction + 'Pressed'] = true;
  this.timeFunctions[this.time + magnitude] = function () {
    this[direction + 'Pressed'] = false;
  }.bind(this);
  this.timeFunctions[this.time + magnitude + 10] = function () {
    this[nonDirection + 'Pressed'] = true;
  }.bind(this);
  this.timeFunctions[this.time + magnitude * 2 + 10] = function () {
    this[nonDirection + 'Pressed'] = false;
    this.maneuvering = false;
  }.bind(this);
};

Starsnake.prototype.dropMine = function () {
  game.debris.push(new Mine (this.pos.x, this.pos.y, 0, 9));
  this.cooldown = 32;
};
