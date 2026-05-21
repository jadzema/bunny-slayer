class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) {
    this.levelIndex = data.levelIndex || 0;
    this.totalScore = data.totalScore || 0;
  }

  create() {
    this.add.image(270, 480, 'grass');
    this.add.rectangle(270, 480, 540, 960, 0x000000, 0.78);

    // Blood splatters for decoration
    for (let i = 0; i < 5; i++) {
      this.add.image(
        Phaser.Math.Between(50, 490),
        Phaser.Math.Between(100, 860),
        'splat'
      ).setScale(Phaser.Math.FloatBetween(1.5, 3)).setAlpha(0.3);
    }

    this.add.text(270, 200, 'GAME OVER', {
      fontSize: '50px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ff2222',
      stroke: '#660000',
      strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(270, 340, `LEVEL ${LEVELS[this.levelIndex].level}`, {
      fontSize: '18px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#888888',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.text(270, 430, `SCORE: ${this.totalScore}`, {
      fontSize: '22px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffff44',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(270, 580, 'ENTER / R  -  TRY AGAIN', {
      fontSize: '12px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.text(270, 650, 'M  -  MAIN MENU', {
      fontSize: '12px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#aaaaaa',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    const retry = () => this.scene.start('Game', { levelIndex: this.levelIndex, totalScore: 0 });
    const menu  = () => this.scene.start('Menu');

    this.input.keyboard.once('keydown-ENTER', retry);
    this.input.keyboard.once('keydown-R',     retry);
    this.input.keyboard.once('keydown-M',     menu);
  }
}
