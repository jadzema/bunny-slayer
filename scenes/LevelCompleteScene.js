class LevelCompleteScene extends Phaser.Scene {
  constructor() { super('LevelComplete'); }

  init(data) {
    this.levelIndex = data.levelIndex;
    this.levelScore = data.score       || 0;
    this.totalScore = data.totalScore  || 0;
    this.timeBonus  = data.timeBonus   || 0;
    this.perfect    = data.perfect     || false;
  }

  create() {
    this.add.image(400, 300, 'grass');
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.72);

    const isLast = this.levelIndex >= 9;
    const grandTotal = this.totalScore + this.timeBonus;

    this.add.text(400, 110, isLast ? 'YOU WIN!' : 'LEVEL CLEAR!', {
      fontSize: isLast ? '44px' : '36px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    if (isLast) {
      this.add.text(400, 190, 'ALL BUNNIES SLAIN!', {
        fontSize: '14px',
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: '#ff4444',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5);
    }

    const rows = [
      { label: 'BUNNY KILLS:',  value: `+${this.levelScore}`,  color: '#ffffff' },
      { label: 'TIME BONUS:',   value: `+${this.timeBonus}`,   color: '#aaffaa' },
      { label: 'TOTAL SCORE:',  value: `${grandTotal}`,        color: '#ffff44' },
    ];

    rows.forEach((row, i) => {
      const y = 250 + i * 60;
      this.add.text(200, y, row.label, {
        fontSize: '14px',
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: '#cccccc',
        stroke: '#000000',
        strokeThickness: 2,
      });
      this.add.text(600, y, row.value, {
        fontSize: '14px',
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: row.color,
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(1, 0);
    });

    // Master banner — shown on final level with a full bunny-kill clear
    if (isLast && this.perfect) {
      // Dark ribbon behind the text
      const ribbon = this.add.rectangle(400, 540, 800, 52, 0x1a0000, 0.88).setDepth(30);

      const banner = this.add.text(400, 540, "You're a master bunny slayer!", {
        fontSize: '20px',
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: '#ffd700',
        stroke: '#660000',
        strokeThickness: 5,
      }).setOrigin(0.5).setDepth(31).setAlpha(0).setScale(0.4);

      // Slam in then pulse
      this.tweens.add({
        targets: [ribbon, banner],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 350,
        ease: 'Back.Out',
        onComplete: () => {
          this.tweens.add({
            targets: banner,
            scaleX: 1.06,
            scaleY: 1.06,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut',
          });
        },
      });
    }

    const nextLabel = isLast ? 'PRESS ENTER FOR MENU' : 'PRESS ENTER FOR NEXT LEVEL';
    const prompt = this.add.text(400, isLast && this.perfect ? 510 : 480, nextLabel, {
      fontSize: '12px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0, duration: 550, yoyo: true, repeat: -1 });

    const advance = () => {
      if (isLast) {
        this.scene.start('Menu');
      } else {
        this.scene.start('Game', { levelIndex: this.levelIndex + 1, totalScore: grandTotal });
      }
    };

    this.input.keyboard.once('keydown-ENTER', advance);
    this.time.delayedCall(5000, advance);
  }
}
