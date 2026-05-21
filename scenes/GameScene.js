class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.levelIndex          = data.levelIndex          || 0;
    this.totalScore          = data.totalScore          || 0;
    this.nightMode           = data.nightMode           || false;
    this.mowerTier           = data.mowerTier           || 0;
    this.nightModesCompleted = data.nightModesCompleted || 0;
    this.eagleAvailable      = data.eagleAvailable      || false;
    this.eagleUsed           = data.eagleUsed           || false;
  }

  create() {
    this.cfg          = LEVELS[this.levelIndex];
    this.score        = 0;
    this.kills        = 0;
    this.over         = false;
    this.timeLeft     = this.cfg.timeLimit;
    this.totalBunnies = this.cfg.bunnies;
    this.patchCollected = false;

    // Background grass
    this.add.image(270, 480, 'grass');

    // Night mode — dark sky + stars + moon
    if (this.nightMode) {
      this.add.rectangle(270, 480, 540, 960, 0x000033, 0.62).setDepth(0);
      for (let i = 0; i < 38; i++) {
        const sx   = Phaser.Math.Between(20, 520);
        const sy   = Phaser.Math.Between(50, 920);
        const star = this.add.circle(sx, sy,
          Phaser.Math.Between(1, 2), 0xffffff,
          Phaser.Math.FloatBetween(0.3, 0.9)).setDepth(0);
        this.tweens.add({ targets: star, alpha: 0.1,
          duration: Phaser.Math.Between(500, 2000), yoyo: true, repeat: -1 });
      }
      // Crescent moon
      this.add.circle(450, 90, 30, 0xffffd0, 0.9).setDepth(0);
      this.add.circle(440, 84, 22, 0x000044, 1).setDepth(0);
    }

    this._drawFences();
    this.physics.world.setBounds(26, 26, 488, 908);

    this.obstacles = this.physics.add.staticGroup();
    this._spawnObstacles();

    this.player = new Player(this, 270, 480, this.mowerTier);
    this.physics.add.collider(this.player, this.obstacles);

    this.bunnies = this.physics.add.group();
    this._spawnBunnies();

    this.physics.add.collider(this.bunnies, this.obstacles);
    this.physics.add.overlap(this.player, this.bunnies, this._killBunny, null, this);

    // Grass patch on levels 3, 6, 9 (0-indexed: 2, 5, 8)
    // Level 1 (index 0) gets a test patch that grants the eagle button
    if ([2, 5, 8].includes(this.levelIndex)) {
      this._spawnGrassPatch(false);
    } else if (this.levelIndex === 0) {
      this._spawnGrassPatch(true);  // true = eagle test patch
    }

    // Eagle button (one-time use, earned after 3rd night mode)
    if (this.eagleAvailable && !this.eagleUsed) {
      this._createEagleButton();
    }

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this._tick,
      callbackScope: this,
      repeat: this.cfg.timeLimit - 1,
    });

    this.scene.launch('HUD', {
      score:     this.totalScore,
      kills:     0,
      required:  this.totalBunnies,
      timeLimit: this.cfg.timeLimit,
      level:     this.cfg.level,
    });
  }

  // ── Grass patch ──────────────────────────────────────────────────
  _spawnGrassPatch(eagleTest = false) {
    this._patchIsEagleTest = eagleTest;
    let px, py, tries = 0;
    do {
      px = Phaser.Math.Between(80, 440);
      py = Phaser.Math.Between(80, 860);
      tries++;
    } while (Phaser.Math.Distance.Between(px, py, 270, 480) < 120 && tries < 30);

    this._patch = this.physics.add.staticImage(px, py, 'grass_patch').setDepth(3);
    this._patch.refreshBody();

    // Pulsing glow halo — gold tint for the eagle test patch
    const glowColor = eagleTest ? 0xffdd44 : 0x88ff88;
    this._patchGlow = this.add.rectangle(px, py, 90, 48, glowColor, 0.3).setDepth(2);
    this.tweens.add({ targets: this._patchGlow, alpha: 0.75, duration: 600, yoyo: true, repeat: -1 });

    // Label the eagle test patch so the player knows what it does
    if (eagleTest) {
      this._patchLabel = this.add.text(px, py - 30, '🦅', { fontSize: '18px' })
        .setOrigin(0.5).setDepth(4);
    }

    this.physics.add.overlap(this.player, this._patch, this._onPatchHit, null, this);

    // Auto-remove after 10 seconds if not collected
    this._patchTimer = this.time.delayedCall(10000, () => this._removePatch());
  }

  _removePatch() {
    if (this._patch && this._patch.active) { this._patch.destroy(); this._patch = null; }
    if (this._patchGlow)  { this._patchGlow.destroy();  this._patchGlow  = null; }
    if (this._patchLabel) { this._patchLabel.destroy(); this._patchLabel = null; }
    if (this._patchTimer) { this._patchTimer.remove();  this._patchTimer = null; }
  }

  _onPatchHit() {
    if (!this._patch || !this._patch.active) return;
    const px = this._patch.x, py = this._patch.y;
    const isEagleTest = this._patchIsEagleTest;
    this._removePatch();

    if (isEagleTest) {
      // Grant eagle button immediately for testing
      this.eagleAvailable = true;
      this.eagleUsed = false;
      this._createEagleButton();
    } else {
      this.patchCollected = true;
      this._spawnBabyBunnies(px, py);
      this._showNightMowGraphic();
    }
  }

  // ── Baby bunnies (bonus, 30% scale, auto-die after 2.5 s) ────────
  _spawnBabyBunnies(cx, cy) {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const baby  = new Bunny(this, cx, cy, { bunnySpeed: 130, aiMode: 'WANDER' });
      baby.setScale(0.3);
      baby.isBaby = true;
      this.bunnies.add(baby);
      baby.setVelocity(Math.cos(angle) * 170, Math.sin(angle) * 170);
      this.time.delayedCall(2500, () => { if (baby.alive) baby.die(this); });
    }
  }

  // ── Night Mow Bonus Round overlay ───────────────────────────────
  _showNightMowGraphic() {
    const D = 40;

    // Dark full-screen veil
    const bg = this.add.rectangle(270, 480, 540, 960, 0x000000, 0).setDepth(D);

    // Panel
    const panel = this.add.rectangle(270, 480, 510, 660, 0x000022, 0).setDepth(D+1);
    const rim   = this.add.rectangle(270, 480, 514, 664, 0x000000, 0)
                    .setStrokeStyle(2, 0x4444ff, 0).setDepth(D+1);

    // Crescent moon decoration
    const moon  = this.add.circle(270, 185, 28, 0xffffd0, 0).setDepth(D+2);
    const moonC = this.add.circle(260, 179, 20, 0x000033, 0).setDepth(D+3);

    // "GENERATIONAL BUNNY WIPEOUT"
    const wipeout = this.add.text(270, 260, 'GENERATIONAL\nBUNNY WIPEOUT', {
      fontSize: '20px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ff4444', stroke: '#000000', strokeThickness: 4,
      align: 'center', lineSpacing: 8,
    }).setOrigin(0.5).setDepth(D+2).setAlpha(0);

    // "Night Mow Unlocked"
    const unlocked = this.add.text(270, 350, 'Night Mow Unlocked', {
      fontSize: '14px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#aaaaff', stroke: '#000033', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(D+2).setAlpha(0);

    // Image below text — scale to fit width (max 480px) preserving aspect ratio
    let artEl;
    if (this.textures.exists('bonus_art')) {
      artEl = this.add.image(270, 580, 'bonus_art').setDepth(D+2).setAlpha(0);
      const src = this.textures.get('bonus_art').getSourceImage();
      const maxW = 480;
      if (src.width > maxW) artEl.setScale(maxW / src.width);
    } else {
      artEl = this.add.rectangle(270, 580, 480, 200, 0x112244, 0.9)
                .setDepth(D+2).setAlpha(0);
    }

    const all = [bg, panel, rim, moon, moonC, wipeout, unlocked, artEl];
    this.tweens.add({
      targets: all, alpha: 1, duration: 500,
      onComplete: () => {
        this.time.delayedCall(3500, () => {
          this.tweens.add({
            targets: all, alpha: 0, duration: 700,
            onComplete: () => all.forEach(o => o && o.destroy()),
          });
        });
      },
    });
  }

  // ── Eagle button ─────────────────────────────────────────────────
  _createEagleButton() {
    const ex = 270, ey = 895;
    this._eagleBtn  = this.add.circle(ex, ey, 38, 0x002266, 0.9).setDepth(52)
                        .setInteractive({ useHandCursor: true });
    this.add.circle(ex, ey, 38, 0x000000, 0)
      .setStrokeStyle(2, 0xffffff, 0.5).setDepth(52);
    this._eagleLbl  = this.add.text(ex, ey - 6, '🦅', { fontSize: '22px' })
                        .setOrigin(0.5).setDepth(53);
    this._eagleSub  = this.add.text(ex, ey + 14, 'EAGLE', {
      fontSize: '7px', fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(53);

    const fire = () => {
      if (this.eagleUsed) return;
      this.eagleUsed = true;
      this._eagleBtn.destroy(); this._eagleLbl.destroy(); this._eagleSub.destroy();
      GameAudio.playEagleCall(true);   // loud activation screech
      this._releaseEagles();
    };
    this._eagleBtn.on('pointerdown', fire);
    this.input.keyboard.on('keydown-E', fire);
  }

  _releaseEagles() {
    const targets = this.bunnies.getChildren().filter(b => b.alive).slice(0, 5);
    targets.forEach((target, i) => {
      this.time.delayedCall(i * 750, () => {
        if (!target.alive) return;
        const fromLeft = (i % 2 === 0);
        const startX = fromLeft ? -40 : 580;
        const startY = Phaser.Math.Between(150, 700);
        GameAudio.playEagleCall(false);  // attack screech per eagle
        const eagle  = this.add.image(startX, startY, 'eagle').setDepth(15).setScale(1.6);
        this.tweens.add({
          targets: eagle, x: target.x, y: target.y, duration: 750, ease: 'Power2.In',
          onComplete: () => {
            if (target.alive) this._killBunny(this.player, target);
            this.tweens.add({
              targets: eagle, x: fromLeft ? 580 : -40, y: -60, duration: 600,
              ease: 'Power2.Out', onComplete: () => eagle.destroy(),
            });
          },
        });
      });
    });
  }

  // ── Standard scene methods ────────────────────────────────────────
  _drawFences() {
    for (let x = 0; x < 540; x += 32) {
      this.add.image(x + 16, 13,  'fence_h').setDepth(1);
      this.add.image(x + 16, 947, 'fence_h').setDepth(1);
    }
    for (let y = 24; y < 936; y += 32) {
      this.add.image(13,  y + 16, 'fence_v').setDepth(1);
      this.add.image(527, y + 16, 'fence_v').setDepth(1);
    }
  }

  _spawnObstacles() {
    const count = this.cfg.obstacles;
    const types = ['tree', 'rock', 'rock', 'tree'];
    for (let i = 0; i < count; i++) {
      let x, y, tries = 0;
      do {
        x = Phaser.Math.Between(70, 470);
        y = Phaser.Math.Between(70, 890);
        tries++;
      } while (Phaser.Math.Distance.Between(x, y, 270, 480) < 110 && tries < 30);
      const obs = this.obstacles.create(x, y, Phaser.Utils.Array.GetRandom(types));
      obs.setDepth(3).setImmovable(true).refreshBody();
    }
  }

  _spawnBunnies() {
    const { bunnies: count, aiMode } = this.cfg;
    const bunnySpeed = this.nightMode
      ? Math.round(this.cfg.bunnySpeed * 0.75)
      : this.cfg.bunnySpeed;
    const placed = [];
    for (let i = 0; i < count; i++) {
      let x, y, tries = 0;
      do {
        x = Phaser.Math.Between(60, 480);
        y = Phaser.Math.Between(60, 900);
        tries++;
      } while (tries < 40 && (
        Phaser.Math.Distance.Between(x, y, 270, 480) < 90 ||
        placed.some(p => Phaser.Math.Distance.Between(x, y, p.x, p.y) < 44)
      ));
      placed.push({ x, y });
      this.bunnies.add(new Bunny(this, x, y, { bunnySpeed, aiMode }));
    }
  }

  _killBunny(player, bunny) {
    if (!bunny.alive) return;
    bunny.die(this);

    // Baby bunnies give bonus score but don't count toward the level quota
    if (!bunny.isBaby) {
      this.kills++;
      this.events.emit('kills-update', this.kills);
    }
    this.score += bunny.isBaby ? 50 : 100;
    this.events.emit('score-update', this.totalScore + this.score);
    this.cameras.main.shake(90, 0.006);

    if (!bunny.isBaby && this.kills >= this.totalBunnies) {
      this._endLevel(true);
    }
  }

  _tick() {
    this.timeLeft--;
    this.events.emit('time-update', this.timeLeft);
    if (this.timeLeft <= 0) {
      this._endLevel(this.kills >= this.cfg.required);
    }
  }

  _endLevel(won) {
    if (this.over) return;
    this.over = true;
    GameAudio.stopMower();
    this.timerEvent.remove(false);
    this.physics.pause();

    const sharedState = {
      mowerTier:           this.mowerTier,
      nightModesCompleted: this.nightModesCompleted,
      eagleAvailable:      this.eagleAvailable,
      eagleUsed:           this.eagleUsed,
      nightModeCompleted:  this.nightMode && won,
    };

    this.time.delayedCall(500, () => {
      this.scene.stop('HUD');
      if (won) {
        this.scene.start('LevelComplete', {
          levelIndex:     this.levelIndex,
          score:          this.score,
          totalScore:     this.totalScore + this.score,
          timeBonus:      this.timeLeft * 10,
          perfect:        this.kills >= this.totalBunnies,
          patchCollected: this.patchCollected,
          ...sharedState,
        });
      } else {
        this.scene.start('GameOver', {
          levelIndex:     this.levelIndex,
          totalScore:     this.totalScore + this.score,
          patchCollected: false,
          ...sharedState,
        });
      }
    });
  }

  update(time, delta) {
    if (this.over) return;
    this.player.update();
    this.bunnies.getChildren().forEach(b => {
      if (b.active) b.update(time, delta, this.player);
    });
  }
}
