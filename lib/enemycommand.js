var Commander = function () {
  this.arsenal = ['starsnake', 'jackhammer'];
  this.units = {
    starsnake: Starsnake,
    jackhammer: Jackhammer,
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
  this.timeFunctions[this.time + 100] = function () {
    game.quarry = new this.units[nextUnit] ();
  }.bind(this);
  this.previousUnit = nextUnit;
};
