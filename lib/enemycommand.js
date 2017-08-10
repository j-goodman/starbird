var Commander = function () {
  this.arsenal = ['starsnake'];
  this.previousDeploy = 'starsnake';
  this.time = 0;
  this.timeFunctions = {};
};

Commander.prototype.act = function () {
  this.time += 1;
  if (this.timeFunctions[this.time]) {
    this.timeFunctions[this.time]();
  }
};

Commander.prototype.lostStarsnake = function () {
  this.timeFunctions[this.time + 100] = function () {
    game.quarry = new Starsnake ();
  };
};
