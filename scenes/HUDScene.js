class HUDScene extends Phaser.Scene {
  constructor() { super('HUD'); }

  init(data) {
    this.totalScore = data.score    || 0;
    this.kills      = data.kills    || 0;
    this.required   = data.required || 0;
    this.timeLeft   = data.timeLimit || 60;
    this.levelNum   = data.level    || 1;
  }

  create() {
    // Background bar
    this.add.rectangle(400, 22, 800, 44, 0x000000, 0.72);

    this.levelText = this.add.text(16, 10, `LEVEL ${this.levelNum}`, {
      fontSize: '11px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    });

    this.scoreText = this.add.text(200, 10, `SCORE: ${this.totalScore}`, {
      fontSize: '11px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffff44',
      stroke: '#000000',
      strokeThickness: 2,
    });

    this.killsText = this.add.text(430, 10, `BUNNIES: ${this.kills}/${this.required}`, {
      fontSize: '11px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#aaffaa',
      stroke: '#000000',
      strokeThickness: 2,
    });

    this.timerText = this.add.text(720, 8, `${this.timeLeft}`, {
      fontSize: '15px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 0);

    const gameScene = this.scene.get('Game');
    gameScene.events.on('score-update', (score) => {
      this.totalScore = score;
      this.scoreText.setText(`SCORE: ${score}`);
    });
    gameScene.events.on('kills-update', (kills) => {
      this.kills = kills;
      this.killsText.setText(`BUNNIES: ${kills}/${this.required}`);
    });
    gameScene.events.on('time-update', (time) => {
      this.timeLeft = time;
      this.timerText.setText(`${time}`);
      this.timerText.setColor(time <= 10 ? '#ff4444' : '#ffffff');
      if (time <= 10) {
        this.tweens.add({ targets: this.timerText, scaleX: 1.3, scaleY: 1.3, duration: 80, yoyo: true });
      }
    });
  }
}
