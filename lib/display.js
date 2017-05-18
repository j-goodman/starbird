game.display = {};
setTimeout(function () {
  game.display.playerSprite = document.getElementById('player-sprite');
}, 500);
game.display.draw = function () {
  if (game.display.playerSprite) {
    game.ctx.drawImage(this.playerSprite, 114, 114, 40, 40);
  }
  game.ctx.fillStyle = '#fff';
  game.ctx.font = '26px courier';
  game.ctx.fillText("x", 163, 142);
  game.ctx.font = '40px courier';
  game.ctx.fillText(game.lives, 185, 148);
  game.ctx.fillStyle = '#0f0';
  game.ctx.fillText(game.score, 126, 200);
  game.ctx.fillStyle = 'rgb(' + (game.chain * 80) + ', ' + (game.chain * 40) + ', ' + (255 - game.chain * 80) + ')';
  game.ctx.fillText(game.chain, 126, 242);
  game.ctx.fillStyle = '#fff';
};
