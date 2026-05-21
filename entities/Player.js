class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(10);
    this.speed = 150;

    this.setBodySize(36, 33);
    this.setOffset(45, 4);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.joystick = new VirtualJoystick(scene);

    // Boost state
    this._boostActive   = false;
    this._boostTimer    = 0;
    this._boostCooldown = 0;
    this._BOOST_DUR     = 1000;
    this._BOOST_CD      = 5000;

    // Boost button — bottom-left
    const bx = 120, by = 860;
    scene.add.circle(bx, by, 46, 0x000000, 0.25).setDepth(50);
    scene.add.circle(bx, by, 46, 0x000000, 0)
      .setStrokeStyle(2, 0xffffff, 0.35).setDepth(50);

    this._boostCircle = scene.add.circle(bx, by, 40, 0xffaa00, 0.85)
      .setDepth(51).setInteractive({ useHandCursor: true });

    this._boostLabel = scene.add.text(bx, by - 7, 'BOOST', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(52);

    this._boostSub = scene.add.text(bx, by + 9, '', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffff44',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(52);

    this._boostArc = scene.add.graphics().setDepth(53);

    this._boostCircle.on('pointerdown', () => this._triggerBoost());
    scene.input.keyboard.on('keydown-SHIFT', () => this._triggerBoost());
  }

  _triggerBoost() {
    if (this._boostActive || this._boostCooldown > 0) return;
    this._boostActive = true;
    this._boostTimer  = this._BOOST_DUR;
  }

  _updateBoostUI() {
    const bx = 120, by = 860;
    this._boostArc.clear();

    if (this._boostActive) {
      this._boostCircle.setFillStyle(0xffffff, 0.95);
      this._boostSub.setText('');
    } else if (this._boostCooldown > 0) {
      this._boostCircle.setFillStyle(0x444444, 0.70);
      this._boostSub.setText(`${Math.ceil(this._boostCooldown / 1000)}s`);

      // Clockwise arc from top showing recharge progress
      const progress   = 1 - this._boostCooldown / this._BOOST_CD;
      const startAngle = -Math.PI / 2;
      const endAngle   = startAngle + progress * Math.PI * 2;
      this._boostArc.lineStyle(4, 0xffaa00, 0.9);
      this._boostArc.beginPath();
      this._boostArc.arc(bx, by, 46, startAngle, endAngle, false);
      this._boostArc.strokePath();
    } else {
      this._boostCircle.setFillStyle(0xffaa00, 0.85);
      this._boostSub.setText('');
    }
  }

  update(delta) {
    // Advance boost/cooldown timers
    if (this._boostActive) {
      this._boostTimer -= delta;
      if (this._boostTimer <= 0) {
        this._boostActive   = false;
        this._boostCooldown = this._BOOST_CD;
      }
    } else if (this._boostCooldown > 0) {
      this._boostCooldown -= delta;
      if (this._boostCooldown < 0) this._boostCooldown = 0;
    }
    this._updateBoostUI();

    const speed = this._boostActive ? this.speed * 1.25 : this.speed;
    const { cursors, wasd } = this;
    let vx = 0, vy = 0;

    if (cursors.left.isDown  || wasd.left.isDown)  vx = -speed;
    if (cursors.right.isDown || wasd.right.isDown) vx =  speed;
    if (cursors.up.isDown    || wasd.up.isDown)    vy = -speed;
    if (cursors.down.isDown  || wasd.down.isDown)  vy =  speed;

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    // Joystick overrides keyboard when active
    const jv = this.joystick.getVector();
    if (Math.abs(jv.x) > 0.08 || Math.abs(jv.y) > 0.08) {
      vx = jv.x * speed;
      vy = jv.y * speed;
    }

    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      this.setRotation(Math.atan2(vy, vx));
    }

    const moving = vx !== 0 || vy !== 0;
    if (moving && !this._wasMoving) GameAudio.startMower();
    if (!moving && this._wasMoving)  GameAudio.stopMower();
    this._wasMoving = moving;
  }
}
