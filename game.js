const game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#2d5a1b',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 540,
    height: 960,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, HUDScene, LevelCompleteScene, GameOverScene],
});
