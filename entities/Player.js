class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(10);
    this.speed = 150;

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

    // Keyboard input
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
      this.setRotation(Math.atan2(vy, vx));
    }

    const moving = vx !== 0 || vy !== 0;
    if (moving && !this._wasMoving) GameAudio.startMower();
    if (!moving && this._wasMoving)  GameAudio.stopMower();
    this._wasMoving = moving;
  }
}
