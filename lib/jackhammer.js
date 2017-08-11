var Jackhammer = function () {
  this.normalSprite = document.getElementById('jackhammer-sprite');
  this.vulnerableSprite = document.getElementById('jackhammer-vulnerable-sprite');
  this.sprite = this.normalSprite;
  this.pos = {
    x: -200,
    y: 64,
  };
  this.angle = 0;
  this.cooldown = 0;
  this.time = 0;
  this.timeFunctions = {};
  this.hits = 0;
  this.mineCount = 16;
  this.spriteSize = 88;
  this.spinAngle = 0;
  this.speed = {
    x: 3,
    y: 0,
  };
  this.vulnerable = false;
  this.wobbling = 0;
};

Jackhammer.prototype.act = function () {
  this.time += 1;
  if (this.timeFunctions[this.time]) {
    this.timeFunctions[this.time]();
  }
  this.cooldown -= 1;
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.checkCollisions();
  if (this.cooldown < 0 && !Math.floor(Math.random() * 30)) {
    this.prepareStrike();
  }
  if (this.pos.x > game.canvasWidth - 400) {
    if (this.speed.x > -7 && !Math.floor(Math.random() * 12)) {
      this.speed.x -= 1;
    }
  }
  if (this.pos.x < 400) {
    if (this.speed.x < 7 && !Math.floor(Math.random() * 12)) {
      this.speed.x += 1;
    }
  }
  if (this.cooldown < 80 && this.cooldown > 0) {
    this.sprite = this.normalSprite;
    this.vulnerable = false;
  }
  if (this.wobbling >= 0) {
    this.wobbling -= 1;
    if (this.wobbling > 50) {
      this.angle += 2;
      this.pos.y += 12;
      this.speed.x += (Math.random() * 24) - 12;
    } else if (this.wobbling > 30) {
      this.angle -= 2;
      this.pos.y -= 4;
      this.speed.x += (Math.random() * 24) - 12;
    } else if (this.wobbling > 20) {
      this.angle += 4.5;
      this.pos.y += 8;
      this.pos.x += Math.random() * 8;
    } else {
      this.angle -= 1;
      this.pos.y -= 1;
      this.pos.x = Math.round(this.pos.x + Math.random() * 4);
      this.speed.x = (Math.random() * 24) - 12;
    }
  }
  if ((this.pos.x < 0 || this.pos.x > game.canvasWidth) && this.cooldown < 0) {
    this.prepareStrike();
  }
};

Jackhammer.prototype.prepareStrike = function () {
  if (this.wobbling <= 0) {
    this.strike();
    this.sprite = this.vulnerableSprite;
    this.vulnerable = true;
  }
};

Jackhammer.prototype.checkCollisions = function () {
  var j; var debris;
  for (j=0 ; j<game.debris.length ; j++) {
    debris = game.debris[j];
    if (!debris) {
      continue;
    } else if (debris.name == "bullet") {
      if (
          Math.abs(debris.pos.x - this.pos.x) < 42 &&
          Math.abs(debris.pos.y - this.pos.y) < 42
         )
      {
        if (this.vulnerable && this.wobbling <= 0) {
          this.hits += 1;
          this.mineCount += 12;
          this.wobbling = 60;
          if (this.hits === 3) {
            this.explode();
          }
        } else {
          debris.angle = Math.random() * 360;
          debris.setSpeedFromAngle();
        }
      }
    }
  }
};

Jackhammer.prototype.strike = function () {
  var i;
  for (i=0 ; i<this.mineCount ; i++) {
    game.debris.push(new Mine (this.pos.x + 32, this.pos.y + 48, ((Math.random() * 10) - 5), (Math.random() * 11 + 1)));
  }
  this.cooldown = 120;
};

Jackhammer.prototype.explode = function () {
  var debrisCount;
  var i;
  var mine;
  debrisCount = 20;
  game.score += 10;
  game.quarry = null;
  for (i=0 ; i<debrisCount ; i++) {
    mine = new Mine ((this.pos.x + Math.random() * 98) - 49, (this.pos.y + Math.random() * 98) - 49, 0, 9);
    game.debris.push(mine);
    mine.explode();
  }
  this.strike();
  game.enemyCommand.lostUnit();
};
