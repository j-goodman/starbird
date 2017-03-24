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
  touchstart = function () {
    this.fire();
  }.bind(this);
};
