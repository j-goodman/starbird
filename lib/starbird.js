var Starbird = function () {
  this.sprite = document.getElementById('player-sprite');
  this.pos = {
    x: 300,
    y: 570,
  };
  this.angle = 0;
  this.exploded = false;
  this.cooldown = 0;
  this.setUpKeyControls();
};

window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;

  // square.innerText = Math.round(event.absolute) + "|" + Math.round(event.alpha) + "|" + Math.round(event.beta) + "|" + Math.round(event.gamma);
  if (event.beta) {
    game.player.angle = event.beta * 3;
  }
}

Starbird.prototype.act = function () {
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
  this.pos.x += this.tilt / 2;
  if (this.pos.x < -500) {
    this.angle = 18;
  } else if (this.pos.x > game.canvasWidth + 500) {
    this.angle = -18;
  }
  this.cooldown -= 1;
};

Starbird.prototype.fire = function () {
  if (this.cooldown <= 0) {
    game.debris.push(new Bullet (this.pos.x - 21, this.pos.y - 16, this.angle));
    game.debris.push(new Bullet (this.pos.x + 18, this.pos.y - 16, this.angle));
    this.cooldown = 12;
  }
};

Starbird.prototype.hitByMine = function () {
  this.explode();
};

Starbird.prototype.explode = function () {
  game.player = {
    sprite: document.getElementById('empty-sprite'),
    age: 0,
    act: function () {
      this.age += 1;
      game.quarry.pos.y += Math.pow((this.age / 60), 2);
      if (this.age < 18) {
        setTimeout(function () {
          game.ctx.fillStyle = '#fff';
          game.ctx.beginPath();
          game.ctx.arc(game.player.pos.x, game.player.pos.y, (this.age + 32)*(Math.random() * 2), 0, 2 * Math.PI);
          game.ctx.fill();
        }.bind(this), 2);
      }
    },
    exploded: true,
    pos: {
      x: this.pos.x,
      y: this.pos.y,
    },
    hitByMine: function () {
      return;
    },
  };
};
