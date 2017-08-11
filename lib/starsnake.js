var Starsnake = function () {
  this.angle = 0;
  this.cooldown = 0;
  this.feint('right', 12);
  this.hits = 0;
  this.lives = 3;
  this.maneuvering = false;
  this.mineInfrequency = 18;
  this.pos = {
    x: -200,
    y: 64,
  };
  this.spinning = false;
  this.spinAngle = 0;
  this.sprite = document.getElementById('snake-sprite');
  this.spriteSize = 48;
  this.time = 0;
  this.timeFunctions = {};
};

Starsnake.prototype.act = function () {
  this.decide();
  this.checkCollisions();
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

  if (this.spinning) {
    this.spinAngle += 20;
    this.pos.y += 2;
  }

  if (game.score >= 300) {
    this.mineInfrequency = 2;
  } else if (game.score >= 270) {
    this.mineInfrequency = 5;
  } else if (game.score >= 200) {
    this.mineInfrequency = 4;
  } else if (game.score >= 160) {
    this.mineInfrequency = 5;
  } else if (game.score >= 100) {
    this.mineInfrequency = 9;
  } else if (game.score >= 80) {
    this.mineInfrequency = 12;
  } else if (game.score >= 60) {
    this.mineInfrequency = 16;
  }

  if (
    !Math.floor(Math.random() * this.mineInfrequency) &&
    this.cooldown < 0 &&
    !game.player.exploded &&
    !this.spinning
  ) {
    this.dropMine();
  }

  if (this.spinning && !Math.floor(Math.random() * 100)) {
    this.spinning = false;
    this.spinAngle = 0;
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
  this.cooldown = 16 - Math.round(game.score / 8);
  if (game.score >= 100) {
    this.cooldown = 3;
  }
};

Starsnake.prototype.checkCollisions = function () {
  var j; var debris;
  for (j=0 ; j<game.debris.length ; j++) {
    debris = game.debris[j];
    if (!debris) {
      continue;
    } else if (debris.name == "bullet") {
      if (
        Math.abs(debris.pos.x - this.pos.x) < 24 &&
        Math.abs(debris.pos.y - this.pos.y) < 24
         )
      {
        if (!this.spinning) {
          this.hits += 1;
        }
        this.spinning = true;
        this.timeFunctions[this.time + 36] = function () {
          this.spinning = false;
          this.spinAngle = 0;
          if (this.hits >= this.lives) {
            this.explode();
          }
        }.bind(this);
      }
    }
  }
  if (this.pos.y > game.player.pos.y - 160 && game.lives > 0) {
    this.explode();
  }
};

Starsnake.prototype.explode = function () {
  var mine;
  game.score += 10;
  game.quarry = null;
  mine = new Mine (this.pos.x + 16, this.pos.y + 16, 0, 9);
  game.debris.push(mine);
  mine.explode();
  mine = new Mine (this.pos.x - 16, this.pos.y + 16, 0, 9);
  game.debris.push(mine);
  mine.explode();
  mine = new Mine (this.pos.x + 16, this.pos.y - 16, 0, 9);
  game.debris.push(mine);
  mine.explode();
  mine = new Mine (this.pos.x - 16, this.pos.y - 16, 0, 9);
  game.debris.push(mine);
  mine.explode();
  game.enemyCommand.lostUnit();
};
