class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) {
    this.levelIndex          = data.levelIndex          || 0;
    this.totalScore          = data.totalScore          || 0;
    this.mowerTier           = data.mowerTier           || 0;
    this.nightModesCompleted = data.nightModesCompleted || 0;
    this.eagleAvailable      = data.eagleAvailable      || false;
    // Reset eagle used on retry so it's available again
  }

  create() {
    this.add.image(270, 480, 'grass');
    this.add.rectangle(270, 480, 540, 960, 0x000000, 0.78);

    for (let i = 0; i < 5; i++) {
      this.add.image(
        Phaser.Math.Between(50, 490),
        Phaser.Math.Between(100, 860),
        'splat'
      ).setScale(Phaser.Math.FloatBetween(1.5, 3)).setAlpha(0.3);
    }

    this.add.text(270, 200, 'GAME OVER', {
      fontSize: '50px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ff2222', stroke: '#660000', strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(270, 340, `LEVEL ${LEVELS[this.levelIndex].level}`, {
      fontSize: '18px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#888888', stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.text(270, 430, `SCORE: ${this.totalScore}`, {
      fontSize: '22px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffff44', stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);

    // Tap / keyboard buttons
    let started = false;
    const retry = () => {
      if (started) return; started = true;
      this.scene.start('Game', {
        levelIndex:          this.levelIndex,
        totalScore:          0,
        nightMode:           false,
        mowerTier:           this.mowerTier,
        nightModesCompleted: this.nightModesCompleted,
        eagleAvailable:      this.eagleAvailable,
        eagleUsed:           false,
      });
    };
    const menu = () => {
      if (started) return; started = true;
      this.scene.start('Menu');
    };

    const retryBg = this.add.rectangle(270, 570, 400, 52, 0x882222, 0.9)
      .setInteractive({ useHandCursor: true }).setDepth(20);
    this.add.rectangle(270, 570, 396, 48, 0x000000, 0)
      .setStrokeStyle(2, 0xff4444, 0.7).setDepth(21);
    const retryTxt = this.add.text(270, 570, 'TAP / ENTER  -  TRY AGAIN', {
      fontSize: '10px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff', stroke: '#330000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(22);
    this.tweens.add({ targets: [retryBg, retryTxt], alpha: 0.5, duration: 550, yoyo: true, repeat: -1 });
    retryBg.on('pointerdown', retry);

    const menuBg = this.add.rectangle(270, 650, 320, 48, 0x333333, 0.85)
      .setInteractive({ useHandCursor: true }).setDepth(20);
    this.add.rectangle(270, 650, 316, 44, 0x000000, 0)
      .setStrokeStyle(2, 0x888888, 0.6).setDepth(21);
    this.add.text(270, 650, 'TAP / M  -  MAIN MENU', {
      fontSize: '10px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#aaaaaa', stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(22);
    menuBg.on('pointerdown', menu);

    this.input.keyboard.once('keydown-ENTER', retry);
    this.input.keyboard.once('keydown-R',     retry);
    this.input.keyboard.once('keydown-M',     menu);
  }
}
