class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.levelIndex = data.levelIndex  || 0;
    this.totalScore = data.totalScore  || 0;
  }

  create() {
    this.cfg         = LEVELS[this.levelIndex];
    this.score       = 0;
    this.kills       = 0;
    this.over        = false;
    this.timeLeft    = this.cfg.timeLimit;
    this.totalBunnies = this.cfg.bunnies;

    // Background
    this.add.image(270, 480, 'grass');

    // Fence border (visual only)
    this._drawFences();

    // Physics bounds inset from fence
    this.physics.world.setBounds(26, 26, 488, 908);

    // Static obstacles
    this.obstacles = this.physics.add.staticGroup();
    this._spawnObstacles();

    // Player
    this.player = new Player(this, 270, 480);
    this.physics.add.collider(this.player, this.obstacles);

    // Bunnies
    this.bunnies = this.physics.add.group();
    this._spawnBunnies();

    this.physics.add.collider(this.bunnies, this.obstacles);
    this.physics.add.overlap(this.player, this.bunnies, this._killBunny, null, this);

    // Countdown timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this._tick,
      callbackScope: this,
      repeat: this.cfg.timeLimit - 1,
    });

    // Launch HUD overlay — show kills vs total bunnies
    this.scene.launch('HUD', {
      score:     this.totalScore,
      kills:     0,
      required:  this.totalBunnies,
      timeLimit: this.cfg.timeLimit,
      level:     this.cfg.level,
    });
  }

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

      const type = Phaser.Utils.Array.GetRandom(types);
      const obs  = this.obstacles.create(x, y, type);
      obs.setDepth(3);
      obs.setImmovable(true);
      obs.refreshBody();
    }
  }

  _spawnBunnies() {
    const { bunnies: count, bunnySpeed, aiMode } = this.cfg;
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
      const bunny = new Bunny(this, x, y, { bunnySpeed, aiMode });
      this.bunnies.add(bunny);
    }
  }

  _killBunny(player, bunny) {
    if (!bunny.alive) return;
    bunny.die(this);

    this.kills++;
    this.score += 100;

    this.events.emit('kills-update', this.kills);
    this.events.emit('score-update', this.totalScore + this.score);

    this.cameras.main.shake(90, 0.006);

    // Win only when every last bunny is dead
    if (this.kills >= this.totalBunnies) {
      this._endLevel(true);
    }
  }

  _tick() {
    this.timeLeft--;
    this.events.emit('time-update', this.timeLeft);

    if (this.timeLeft <= 0) {
      // Win if quota met, lose if not
      this._endLevel(this.kills >= this.cfg.required);
    }
  }

  _endLevel(won) {
    if (this.over) return;
    this.over = true;

    GameAudio.stopMower();
    this.timerEvent.remove(false);
    this.physics.pause();

    this.time.delayedCall(500, () => {
      this.scene.stop('HUD');
      if (won) {
        const timeBonus = this.timeLeft * 10;
        this.scene.start('LevelComplete', {
          levelIndex: this.levelIndex,
          score:      this.score,
          totalScore: this.totalScore + this.score,
          timeBonus,
          perfect:    this.kills >= this.totalBunnies,
        });
      } else {
        this.scene.start('GameOver', {
          levelIndex: this.levelIndex,
          totalScore: this.totalScore + this.score,
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
