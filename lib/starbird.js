var Starbird = function () {
  this.sprite = document.getElementById('player-sprite');
  this.pos = {
    x: 300,
    y: 570,
  };
  this.angle = 0;
  this.setUpKeyControls();
};

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
  this.pos.x += this.tilt / 1.5;
  if (this.pos.x < -500) {
    this.angle = 18;
  } else if (this.pos.x > game.canvasWidth + 500) {
    this.angle = -18;
  }
};

Starbird.prototype.fire = function () {
  game.debris.push(new Bullet (this.pos.x - 21, this.pos.y + 16, this.angle));
  game.debris.push(new Bullet (this.pos.x + 18, this.pos.y + 16, this.angle));
};

Starbird.prototype.setUpKeyControls = function () {
  this.leftPressed = false;
  this.rightPressed = false;
  this.upPressed = false;
  this.downPressed = false;
  onkeydown = function (event) {
    switch (event.keyCode) {
      case 40: //down
        this.downPressed = true;
        break;
      case 39: //right
        this.rightPressed = true;
        break;
      case 38: //up
        this.upPressed = true;
        this.fire();
        break;
      case 37: //left
        this.leftPressed = true;
        break;
      case 32: //spacebar
        this.fire();
        break;
    }
  }.bind(this);
  onkeyup = function (event) {
    switch (event.keyCode) {
      case 40: //down
        this.downPressed = false;
        break;
      case 39: //right
        this.rightPressed = false;
        break;
      case 38: //up
        this.upPressed = false;
        break;
      case 37: //left
        this.leftPressed = false;
        break;
    }
  }.bind(this);
};
