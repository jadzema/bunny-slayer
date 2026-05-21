class Player extends Phaser.Physics.Arcade.Sprite {
  // mowerTier: 0 = walk-behind (default), 1 = ride-on, 2 = zero-turn
  constructor(scene, x, y, mowerTier = 0) {
    const key = mowerTier === 2 ? 'player_tier2'
              : mowerTier === 1 ? 'player_tier1'
              : 'player';
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.mowerTier = mowerTier;
    this.setCollideWorldBounds(true);
    this.setDepth(10);

    // Tier 1 & 2: 25% faster than base
    this.speed = (mowerTier >= 1) ? 187 : 150;

    this.setBodySize(36, 33);
    this.setOffset(45, 4);

    // Smooth rotation tracking (used for tier-1 turn dampening)
    this._facingAngle = 0;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.joystick = new VirtualJoystick(scene);
  }

  update() {
    const { cursors, wasd } = this;
    let vx = 0, vy = 0;

    if (cursors.left.isDown  || wasd.left.isDown)  vx = -this.speed;
    if (cursors.right.isDown || wasd.right.isDown) vx =  this.speed;
    if (cursors.up.isDown    || wasd.up.isDown)    vy = -this.speed;
    if (cursors.down.isDown  || wasd.down.isDown)  vy =  this.speed;

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    // Joystick overrides keyboard when active
    const jv = this.joystick.getVector();
    if (Math.abs(jv.x) > 0.08 || Math.abs(jv.y) > 0.08) {
      vx = jv.x * this.speed;
      vy = jv.y * this.speed;
    }

    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      const targetAngle = Math.atan2(vy, vx);
      if (this.mowerTier === 1) {
        // Ride-on: 25% slower turning — lerp toward target angle
        let diff = targetAngle - this._facingAngle;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this._facingAngle += diff * 0.10;
      } else {
        // Walk-behind & zero-turn: instant rotation
        this._facingAngle = targetAngle;
      }
      this.setRotation(this._facingAngle);
    }

    const moving = vx !== 0 || vy !== 0;
    if (moving && !this._wasMoving) GameAudio.startMower();
    if (!moving && this._wasMoving)  GameAudio.stopMower();
    this._wasMoving = moving;
  }
}
