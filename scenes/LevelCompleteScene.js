class LevelCompleteScene extends Phaser.Scene {
  constructor() { super('LevelComplete'); }

  init(data) {
    this.levelIndex          = data.levelIndex;
    this.levelScore          = data.score             || 0;
    this.totalScore          = data.totalScore        || 0;
    this.timeBonus           = data.timeBonus         || 0;
    this.perfect             = data.perfect           || false;
    this.patchCollected      = data.patchCollected    || false;
    this.nightModeCompleted  = data.nightModeCompleted  || false;
    this.mowerTier           = data.mowerTier           || 0;
    this.nightModesCompleted = data.nightModesCompleted || 0;
    this.eagleAvailable      = data.eagleAvailable      || false;
    this.eagleUsed           = data.eagleUsed           || false;

    // Compute upgrades earned by completing a night-mode level perfectly
    this.newNightModesCompleted = this.nightModesCompleted;
    this.newMowerTier           = this.mowerTier;
    this.newEagleAvailable      = this.eagleAvailable;

    if (this.nightModeCompleted && this.perfect) {
      this.newNightModesCompleted = Math.min(3, this.nightModesCompleted + 1);
      if (this.newNightModesCompleted >= 1) this.newMowerTier = Math.max(this.newMowerTier, 1);
      if (this.newNightModesCompleted >= 2) this.newMowerTier = 2;
      if (this.newNightModesCompleted >= 3) this.newEagleAvailable = true;
    }
  }

  create() {
    this.add.image(270, 480, 'grass');
    this.add.rectangle(270, 480, 540, 960, 0x000000, 0.72);

    const isLast     = this.levelIndex >= 9;
    const grandTotal = this.totalScore + this.timeBonus;
    const gotUpgrade = this.nightModeCompleted && this.perfect && this.newMowerTier > this.mowerTier;
    const gotEagle   = this.nightModeCompleted && this.perfect &&
                       !this.eagleAvailable && this.newEagleAvailable;

    // ── Title ────────────────────────────────────────────────────
    this.add.text(270, 100, isLast ? 'YOU WIN!' : 'LEVEL CLEAR!', {
      fontSize: isLast ? '44px' : '36px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffff00', stroke: '#000000', strokeThickness: 6,
    }).setOrigin(0.5);

    if (isLast) {
      this.add.text(270, 190, 'ALL BUNNIES SLAIN!', {
        fontSize: '14px', fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: '#ff4444', stroke: '#000000', strokeThickness: 3,
      }).setOrigin(0.5);
    }

    // ── Score rows ───────────────────────────────────────────────
    const rows = [
      { label: 'BUNNY KILLS:', value: `+${this.levelScore}`, color: '#ffffff'  },
      { label: 'TIME BONUS:',  value: `+${this.timeBonus}`,  color: '#aaffaa' },
      { label: 'TOTAL SCORE:', value: `${grandTotal}`,       color: '#ffff44' },
    ];
    rows.forEach((row, i) => {
      const y = 270 + i * 65;
      this.add.text(55, y, row.label, {
        fontSize: '13px', fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: '#cccccc', stroke: '#000000', strokeThickness: 2,
      });
      this.add.text(485, y, row.value, {
        fontSize: '13px', fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: row.color, stroke: '#000000', strokeThickness: 2,
      }).setOrigin(1, 0);
    });

    // ── Mower upgrade / eagle unlock banner ─────────────────────
    if (gotUpgrade || gotEagle) {
      const uy = 545;
      this.add.rectangle(270, uy, 490, 110, 0x1a0000, 0.9).setDepth(30);
      this.add.rectangle(270, uy, 494, 114, 0x000000, 0)
        .setStrokeStyle(2, 0xffaa00, 0.9).setDepth(30);

      const msg = gotEagle
        ? '🦅 EAGLE STRIKE\n   UNLOCKED!'
        : this.newMowerTier === 1
          ? 'RIDE-ON MOWER\n  UNLOCKED!'
          : 'ZERO-TURN MOWER\n  UNLOCKED!';

      const uText = this.add.text(270, uy, msg, {
        fontSize: '14px', fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: '#ffaa00', stroke: '#330000', strokeThickness: 3,
        align: 'center', lineSpacing: 8,
      }).setOrigin(0.5).setDepth(31).setAlpha(0).setScale(0.5);

      this.tweens.add({
        targets: uText, alpha: 1, scaleX: 1, scaleY: 1, duration: 400, ease: 'Back.Out',
        onComplete: () => {
          this.tweens.add({ targets: uText, scaleX: 1.04, scaleY: 1.04,
            duration: 600, yoyo: true, repeat: -1 });
        },
      });
    }

    // ── Master banner on final level ─────────────────────────────
    if (isLast && this.perfect) {
      const ribbon = this.add.rectangle(270, 880, 540, 48, 0x1a0000, 0.88).setDepth(30);
      const banner = this.add.text(270, 880, "You're a master bunny slayer!", {
        fontSize: '16px', fontFamily: '"Press Start 2P", "Courier New", monospace',
        color: '#ffd700', stroke: '#660000', strokeThickness: 5,
      }).setOrigin(0.5).setDepth(31).setAlpha(0).setScale(0.4);
      this.tweens.add({
        targets: [ribbon, banner], alpha: 1, scaleX: 1, scaleY: 1,
        duration: 350, ease: 'Back.Out',
        onComplete: () => {
          this.tweens.add({ targets: banner, scaleX: 1.06, scaleY: 1.06,
            duration: 700, yoyo: true, repeat: -1 });
        },
      });
    }

    // ── Tap / Enter to continue button ───────────────────────────
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      if (isLast) {
        this.scene.start('Menu');
      } else {
        this.scene.start('Game', {
          levelIndex:          this.levelIndex + 1,
          totalScore:          grandTotal,
          nightMode:           this.patchCollected,
          mowerTier:           this.newMowerTier,
          nightModesCompleted: this.newNightModesCompleted,
          eagleAvailable:      this.newEagleAvailable,
          eagleUsed:           this.eagleUsed,
        });
      }
    };

    const promptY = (gotUpgrade || gotEagle) ? 690 : (isLast && this.perfect) ? 820 : 730;
    const label   = isLast ? 'TAP / ENTER  -  MENU' : 'TAP / ENTER  -  NEXT LEVEL';

    const btnBg = this.add.rectangle(270, promptY, 460, 52, 0x226622, 0.9)
      .setInteractive({ useHandCursor: true }).setDepth(20);
    this.add.rectangle(270, promptY, 456, 48, 0x000000, 0)
      .setStrokeStyle(2, 0x44ff44, 0.6).setDepth(21);
    const btnTxt = this.add.text(270, promptY, label, {
      fontSize: '10px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff', stroke: '#003300', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(22);

    this.tweens.add({ targets: [btnBg, btnTxt], alpha: 0.5, duration: 550, yoyo: true, repeat: -1 });
    btnBg.on('pointerdown', advance);
    this.input.keyboard.once('keydown-ENTER', advance);
  }
}
