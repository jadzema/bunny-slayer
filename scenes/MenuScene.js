class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    this.add.image(270, 480, 'grass');
    this.add.rectangle(270, 480, 540, 960, 0x000000, 0.65);

    // Blood drip decorations
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(40, 500);
      this.add.rectangle(x, Phaser.Math.Between(20, 70), 4, Phaser.Math.Between(25, 60), 0x990000, 0.7);
    }

    this.add.text(270, 160, 'BUNNY', {
      fontSize: '68px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ff2222',
      stroke: '#550000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(270, 250, 'SLAYER', {
      fontSize: '68px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ff2222',
      stroke: '#550000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(270, 335, "Mow 'em down.", {
      fontSize: '13px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#dddddd',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Instruction box
    this.add.rectangle(270, 430, 500, 76, 0x000000, 0.5);
    this.add.text(270, 430, 'DRAG JOYSTICK  -  Move mower\nKill all bunnies before time runs out', {
      fontSize: '10px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#bbbbbb',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5);

    // ── TAP TO START button ────────────────────────────────────────
    let started = false;
    const startGame = () => {
      if (started) return;
      started = true;
      this.scene.start('Game', { levelIndex: 0, totalScore: 0 });
    };

    const btnBg = this.add.rectangle(270, 560, 380, 54, 0x228822, 0.92)
      .setInteractive({ useHandCursor: true }).setDepth(20);
    this.add.rectangle(270, 560, 376, 50, 0x000000, 0)
      .setStrokeStyle(2, 0x44ff44, 0.7).setDepth(21);

    const btnText = this.add.text(270, 560, '▶  TAP TO START', {
      fontSize: '16px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff',
      stroke: '#003300',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(22);

    this.tweens.add({ targets: [btnBg, btnText], alpha: 0.6, duration: 550, yoyo: true, repeat: -1 });

    btnBg.on('pointerdown', startGame);

    this.add.text(270, 630, 'or press ENTER on keyboard', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#666666',
    }).setOrigin(0.5).setDepth(20);

    this.input.keyboard.once('keydown-ENTER', startGame);
    this.input.keyboard.once('keydown-SPACE', startGame);
  }
}
