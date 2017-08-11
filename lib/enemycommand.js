var Commander = function () {
  this.arsenal = ['starsnake', 'jackhammer', 'hornet', 'twinfighters'];
  this.units = {
    starsnake: Starsnake,
    jackhammer: Jackhammer,
    hornet: Hornet,
    twinfighters: Twincommander,
  };
  this.previousUnit = 'starsnake';
  this.time = 0;
  this.timeFunctions = {};
};

Commander.prototype.act = function () {
  this.time += 1;
  if (this.timeFunctions[this.time]) {
    this.timeFunctions[this.time]();
  }
};

Commander.prototype.lostUnit = function () {
  var nextUnit;
  nextUnit = this.previousUnit;
  while (nextUnit === this.previousUnit) {
    nextUnit = this.arsenal[Math.floor(Math.random() * this.arsenal.length)];
  }
  // nextUnit = 'twinfighters';
  this.timeFunctions[this.time + 50] = function () {
    game.quarry = new this.units[nextUnit] ();
  }.bind(this);
  this.previousUnit = nextUnit;
};
