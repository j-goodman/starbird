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
  var alpha = event.alpha;
  var beta = event.beta;
  var gamma = event.gamma;

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
  if (this.cooldown <= 0 && !this.exploded) {
    game.debris.push(new Bullet (this.pos.x - 21, this.pos.y - 16, this.angle));
    game.debris.push(new Bullet (this.pos.x + 18, this.pos.y - 16, this.angle));
    this.cooldown = 12;
  }
};

Starbird.prototype.hitByMine = function () {
  this.explode();
};

Starbird.prototype.explode = function () {
  var backup = this;
  this.exploded = true;
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
  setTimeout(function () {
    game.lives -= 1;
    if (game.lives < 0) {
      game.lives = '';
      game.display.draw = function () {
        game.ctx.fillStyle = '#fff';
        game.ctx.font = '100px courier';
        game.ctx.fillText("GAME OVER", 390, 480);
        game.ctx.font = '30px courier';
        game.ctx.fillText("FINAL SCORE:", 515, 540);
        game.ctx.fillText(game.score, 760, 540);
      };
      return;
    }
    game.player = backup;
    game.player.pos.x = 600;
    game.player.angle = 0;
    game.player.exploded = false;
  }, 2000);
};
