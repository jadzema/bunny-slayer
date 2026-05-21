class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    this.add.image(400, 300, 'grass');
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.65);

    // Blood drip decorations
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(40, 760);
      this.add.rectangle(x, Phaser.Math.Between(20, 80), 4, Phaser.Math.Between(30, 70), 0x990000, 0.7);
    }

    this.add.text(400, 130, 'BUNNY', {
      fontSize: '68px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ff2222',
      stroke: '#550000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 215, 'SLAYER', {
      fontSize: '68px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ff2222',
      stroke: '#550000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(400, 295, "Mow 'em down.", {
      fontSize: '14px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#dddddd',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Instruction box
    this.add.rectangle(400, 390, 540, 90, 0x000000, 0.5);
    this.add.text(400, 390, 'WASD / ARROWS  -  Move mower\nRun over bunnies to score points\nReach kill quota before time runs out', {
      fontSize: '10px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#bbbbbb',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5);

    const prompt = this.add.text(400, 510, 'PRESS ENTER TO START', {
      fontSize: '13px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0, duration: 550, yoyo: true, repeat: -1 });

    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Game', { levelIndex: 0, totalScore: 0 }));
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game', { levelIndex: 0, totalScore: 0 }));
  }
}
