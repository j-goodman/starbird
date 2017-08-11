var Twincommander = function () {
  this.maneuvering = false;
  this.pos = {
    x: 0,
    y: 0,
  };
  this.time = 0;
  this.timeFunctions = {};
  this.twins = [];
  this.twins.push (new Twinfighter ('left', this, this.twins.length));
  this.twins.push (new Twinfighter ('right', this, this.twins.length));
  this.learnManeuvers();
};

Twincommander.prototype.act = function () {
  var count;
  var i;
  this.time += 1;
  if (this.timeFunctions[this.time]) {
    this.timeFunctions[this.time]();
  }
  count = 0;
  for (i=0 ; i<this.twins.length ; i++) {
    if (this.twins[i]) {
      this.twins[i].act();
      count += 1;
    }
  }
  if (count === 0) {
    game.quarry = null;
    game.enemyCommand.lostUnit();
  }
  this.decide();
};

Twincommander.prototype.decide = function () {
  if (!Math.floor(Math.random() * 160) && this.twins[0] && this.twins[1] && !this.maneuvering) {
    this.maneuvers[Math.floor(Math.random() * this.maneuvers.length)]();
  }
};

Twincommander.prototype.learnManeuvers = function () {
  this.maneuvers = [];
  this.maneuvers.push(this.doubleBomb.bind(this));
};

Twincommander.prototype.doubleBomb = function () {
  var actions;
  actions = {};

  if (!this.twins[0] || !this.twins[1]) {
    return false;
  }

  this.maneuvering = true;
  this.twins[0].coordinating = true;
  this.twins[1].coordinating = true;

  this.twins[0].angle = -24;
  this.twins[1].angle = 24;

  actions.checkIfOffscreen = function () {
    var averageY;
    if (!this.twins[0] || !this.twins[1]) {
      return false;
    }
    if (this.twins[0].pos.x < -20) {
      this.twins[0].angle = 0;
    }
    if (this.twins[1].pos.x > game.canvasWidth + 20) {
      this.twins[1].angle = 0;
    }
    if (this.twins[0].pos.x < -20 && this.twins[1].pos.x > game.canvasWidth + 20) {
      this.twins[0].feint('right', 15);
      averageY = (this.twins[0].pos.y + this.twins[1].pos.y) / 2;
      this.twins[0].pos.y = averageY + 45;
      this.twins[1].pos.y = averageY - 45;
      this.twins[1].feint('left', 15);
      this.timeFunctions[this.time + 60] = function () {
        this.maneuvering = false;
        if (this.twins[0]) {
          this.twins[0].coordinating = false;
        }
        if (this.twins[1]) {
          this.twins[1].coordinating = false;
        }
      }.bind(this);
    } else {
      this.timeFunctions[this.time + 20] = actions.checkIfOffscreen.bind(this);
    }
  };

  this.timeFunctions[this.time + 20] = actions.checkIfOffscreen.bind(this);
};

Twincommander.prototype.draw = function (ctx) {
  var i;
  for (i=0 ; i<this.twins.length ; i++) {
    if (this.twins[i]) {
      this.twins[i].draw(ctx);
    }
  }
};
