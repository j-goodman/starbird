var Hornet = function () {
  this.angle = 0;
  this.diving = false;
  this.cooldown = 0;
  this.hits = 0;
  this.lives = 3;
  this.maneuvering = false;
  this.mineInfrequency = 18;
  this.mineSpeed = 14;
  this.pos = {
    x: game.canvasWidth + 200,
    y: 64,
  };
  this.speed = {
    x: 0,
    y: 0,
  };
  this.accel = {
    x: 0,
    y: 0,
  };
  this.recoverTarget = this.pos.y;
  this.spinning = false;
  this.spinAngle = 0;
  this.sprite = document.getElementById('hornet-sprite');
  this.spriteSize = 48;
  this.time = 0;
  this.timeFunctions = {};
  this.feint('left', 12);
};

Hornet.prototype.act = function () {
  var mineDelay;
  this.decide();
  this.checkCollisions();
  this.speed.y += this.accel.y;
  this.pos.y += this.speed.y;
  if (this.rightPressed) {
    this.angle += 12;
  }
  if (this.leftPressed) {
    this.angle -= 12;
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

  mineDelay = (game.player.pos.y - this.pos.y) / this.mineSpeed;
  if (
    this.cooldown < 0 &&
    !game.player.exploded &&
    !this.spinning &&
    Math.abs(this.pos.x - (game.player.pos.x + (game.player.speed.x * mineDelay))) < 32
  ) {
    this.dropMine();
  }

  if (this.diving) {
    this.pos.y += (this.diveTarget - this.pos.y) / 7;
  } else if (this.recovering) {
    this.pos.y -= (this.pos.y - this.recoverTarget) / 7;
  }

  if (this.spinning && !Math.floor(Math.random() * 300)) {
    this.spinning = false;
    this.spinAngle = 0;
  }

  this.cooldown -= 1;
};

Hornet.prototype.decide = function () {
  if (!Math.floor(Math.random() * 48) && !this.maneuvering) {
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

Hornet.prototype.draw = Starsnake.prototype.draw;

Hornet.prototype.feint = function (direction, magnitude) {
  var nonDirection = (direction == 'right') ? 'left' : 'right';
  magnitude = Math.round(magnitude / 2);
  if (!Math.floor(Math.random() * 2) && !this.diving && !this.recovering) {
    this.dive(magnitude);
  }
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

Hornet.prototype.dive = function (magnitude) {
  if (
    this.timeFunctions[this.time + magnitude * 4] ||
    this.timeFunctions[this.time + magnitude * 9] ||
    this.diving ||
    this.recovering
  ) {
    return false;
  }
  this.diveTarget = (game.player.pos.y * 2 + this.pos.y) / 3;
  this.diving = true;
  this.recovering = false;
  this.timeFunctions[this.time + magnitude * 4] = function () {
    this.diving = false;
    this.recovering = true;
  }.bind(this);
  this.timeFunctions[this.time + magnitude * 9] = function () {
    this.diving = false;
    this.recovering = false;
  }.bind(this);
};

Hornet.prototype.dropMine = function () {
  game.debris.push(new Mine (this.pos.x, this.pos.y, 0, this.mineSpeed));
  this.cooldown = 12;
};

Hornet.prototype.checkCollisions = function () {
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
          this.recoverTarget += 72;
          this.diving = false;
          this.recovering = true;
        }
        this.spinning = true;
        this.timeFunctions[this.time + 36] = function () {
          this.spinning = false;
          this.diving = false;
          this.recovering = false;
          this.spinAngle = 0;
          if (this.hits >= this.lives) {
            this.explode();
          }
        }.bind(this);
      } else if (
        Math.abs(debris.pos.x - this.pos.x) < 96 &&
        Math.abs(debris.pos.y - this.pos.y) < 124 &&
        !this.maneuvering &&
        !this.spinning
        )
      {
        this.feint((debris.pos.x > this.pos.x ? 'left' : 'right'), 8);
      }
    }
  }
  if (this.pos.y > game.player.pos.y - 120) {
    this.diving = false;
    this.recovering = true;
  }
  if (this.pos.x < 20 && !this.maneuvering) {
    this.feint('right', 1 + Math.round(Math.random() * 15));
  }
  if (this.pos.x > game.canvasWidth + 20 && !this.maneuvering) {
    this.feint('left', 1 + Math.round(Math.random() * 15));
  }
};

Hornet.prototype.explode = function () {
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
