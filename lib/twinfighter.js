var Twinfighter = function (spawnside, commander, index) {
  this.angle = 0;
  this.commander = commander;
  this.cooldown = 0;
  this.coordinating = false;
  this.flightConsistency = 7 + (Math.random() * 6) - 3;
  this.hits = 0;
  this.index = index;
  this.lives = 3;
  this.maneuvering = false;
  this.mineInfrequency = 18;
  this.mineSpeed = 12;
  this.pos = {
    x: 0,
    y: 64 + 64 * this.index,
  };
  this.pos.x = spawnside === 'left' ? -200 : game.canvasWidth + 200;
  this.speed = {
    x: 0,
    y: 0,
  };
  this.spinning = false;
  this.spinAngle = 0;
  this.sprite = document.getElementById('twinfighter-sprite');
  this.spriteSize = 48;
  this.time = 0;
  this.timeFunctions = {};

  this.feint((spawnside === 'left' ? 'right' : 'left'), 7);
};

Twinfighter.prototype.act = function () {
  var brother;
  var mineDelay;
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
  this.pos.x += this.tilt / 1.8;
  this.speed.x = this.tilt/ 1.8;
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
    this.pos.y += 9;
  }

  mineDelay = (game.player.pos.y - this.pos.y) / this.mineSpeed;
  brother = this.commander.twins[this.index === 0 ? 1 : 0];
  if (
    this.cooldown < 0 &&
    !game.player.exploded &&
    !this.spinning &&
    Math.abs(this.pos.x - (game.player.pos.x + (game.player.speed.x * mineDelay))) < 32 &&
    (
      !brother ||
      !Math.abs(this.pos.x - (brother.pos.x + (brother.speed.x * mineDelay))) < 32
    )
  ) {
    this.dropMine();
    if (this.hits < 2) {
      this.timeFunctions[this.time + 8] = this.dropMine.bind(this);
      this.timeFunctions[this.time + 16] = this.dropMine.bind(this);
    }
  }

  if (this.spinning && !Math.floor(Math.random() * 300)) {
    this.spinning = false;
    this.spinAngle = 0;
  }

  if (this.pos.x < 20 && !this.maneuvering) {
    this.feint('right', 1 + Math.round(Math.random() * 15));
  }
  if (this.pos.x > game.canvasWidth + 20 && !this.maneuvering) {
    this.feint('left', 1 + Math.round(Math.random() * 15));
  }

  if (!Math.floor(Math.random() * 150)) {
    this.maneuvering = false;
  }

  if (this.pos.y > game.canvasHeight - (500 - this.index * 64) && this.hits < 2 && game.lives > 0) {
    if (!Math.floor(Math.random() * 80)) {
      this.spinning = false;
      this.spinAngle = 0;
      this.maneuvering = false;
      this.coordinating = false;
    }
    this.pos.y -= 1;
  }
  if (this.pos.y > game.canvasHeight - (400 - this.index * 64) && game.lives > 0) {
    if (!Math.floor(Math.random() * 80)) {
      this.spinning = false;
      this.spinAngle = 0;
      this.maneuvering = false;
      this.coordinating = false;
    }
    this.pos.y -= 1;
  }

  if (this.pos.y > game.canvasHeight) {
    this.explode();
  }

  if (this.pos.x > game.canvasWidth + 200) {
    this.pos.x = game.canvasWidth + 100;
    this.feint('left', 12);
  }

  if (this.pos.x < 0 - 200) {
    this.pos.x = -100;
    this.feint('right', 12);
  }

  this.cooldown -= 1;
};

Twinfighter.prototype.decide = function () {
  if (!this.coordinating) {
    if (!Math.floor(Math.random() * this.flightConsistency) && !this.maneuvering) {
      if (this.pos.x > game.canvasWidth / 2) {
        this.feint('left', Math.ceil(Math.random() * 7));
      } else {
        this.feint('right', Math.ceil(Math.random() * 7));
      }
    }
  }
};

Twinfighter.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.pos.x, this.pos.y + this.commander.pos.y);
  ctx.rotate((this.angle + this.spinAngle) * Math.PI/180);
  ctx.translate(-this.spriteSize / 2, -this.spriteSize / 2);
  ctx.drawImage(this.sprite, 0, 0, this.spriteSize, this.spriteSize);
  ctx.restore();
};

Twinfighter.prototype.feint = function (direction, magnitude) {
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

Twinfighter.prototype.dropMine = function () {
  if (this.pos.y < game.player.pos.y - 90) {
    game.debris.push(new Mine (this.pos.x, this.pos.y, 0, this.mineSpeed));
    this.cooldown = 12;
  }
};

Twinfighter.prototype.checkCollisions = function () {
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
          this.coordinating = false;
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
};

Twinfighter.prototype.explode = function () {
  var mine;
  game.score += 5;
  this.commander.twins[this.index] = null;
  mine = new Mine (this.pos.x + 16, this.pos.y, 0, 9);
  game.debris.push(mine);
  mine.explode();
  mine = new Mine (this.pos.x - 16, this.pos.y, 0, 9);
  game.debris.push(mine);
  mine.explode();
};
