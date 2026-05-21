class Bunny extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, 'bunny');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.aiMode    = config.aiMode;
    this.speed     = config.bunnySpeed;
    this.fleeDist  = 130;
    this.alive     = true;

    this.setCollideWorldBounds(true);
    this.setBounce(0.4);
    this.setDepth(5);

    this.wanderAngle = Math.random() * Math.PI * 2;
    this.wanderTimer = Phaser.Math.Between(600, 2200);

    this.currentSwerve = 0;
    this.evadeTimer    = 0;

    this.hopTween = scene.tweens.add({
      targets: this,
      scaleY: { from: 1, to: 1.18 },
      duration: 180,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  update(time, delta, player) {
    if (!this.active || !this.alive) return;

    const dx   = this.x - player.x;
    const dy   = this.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    switch (this.aiMode) {
      case 'WANDER':
        this._wander(delta);
        break;
      case 'FLEE':
        if (dist < this.fleeDist) {
          const angle = Math.atan2(dy, dx);
          this.setVelocity(Math.cos(angle) * this.speed * 1.6, Math.sin(angle) * this.speed * 1.6);
        } else {
          this._wander(delta);
        }
        break;
      case 'EVADE':
        if (dist < this.fleeDist * 1.4) {
          this.evadeTimer -= delta;
          if (this.evadeTimer <= 0) {
            this.currentSwerve = (Math.random() - 0.5) * Math.PI * 0.9;
            this.evadeTimer = Phaser.Math.Between(180, 460);
          }
          const base  = Math.atan2(dy, dx);
          const angle = base + this.currentSwerve;
          this.setVelocity(Math.cos(angle) * this.speed * 1.9, Math.sin(angle) * this.speed * 1.9);
        } else {
          this._wander(delta);
        }
        break;
    }

    // Steer away from world bounds — reverses any velocity component pointing into a wall
    const wb  = this.scene.physics.world.bounds;
    const pad = 52;
    let bvx = this.body.velocity.x;
    let bvy = this.body.velocity.y;
    let steered = false;
    if (this.x < wb.x + pad      && bvx < 0) { bvx =  Math.abs(bvx); steered = true; }
    if (this.x > wb.right - pad   && bvx > 0) { bvx = -Math.abs(bvx); steered = true; }
    if (this.y < wb.y + pad       && bvy < 0) { bvy =  Math.abs(bvy); steered = true; }
    if (this.y > wb.bottom - pad  && bvy > 0) { bvy = -Math.abs(bvy); steered = true; }
    if (steered) {
      this.setVelocity(bvx, bvy);
      this.wanderAngle = Math.atan2(bvy, bvx);
    }
  }

  _wander(delta) {
    this.wanderTimer -= delta;
    if (this.wanderTimer <= 0) {
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.wanderTimer = Phaser.Math.Between(600, 2200);
    }
    this.setVelocity(
      Math.cos(this.wanderAngle) * this.speed,
      Math.sin(this.wanderAngle) * this.speed
    );
  }

  die(scene) {
    if (!this.alive) return;
    this.alive = false;

    if (this.hopTween) { this.hopTween.stop(); this.hopTween = null; }

    // Freeze movement and tint red for pain
    this.setVelocity(0, 0);
    this.setTint(0xff5555);

    GameAudio.playKill();

    // +100 popup appears immediately
    const popup = scene.add.text(this.x, this.y - 8, '+100', {
      fontSize: '13px',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3,
    }).setDepth(20).setOrigin(0.5);

    scene.tweens.add({
      targets: popup,
      y: this.y - 52,
      alpha: 0,
      duration: 750,
      ease: 'Power2',
      onComplete: () => popup.destroy(),
    });

    // Wiggle in pain for ~2 seconds, then drop splat and disappear
    const bx = this.x;
    const by = this.y;
    scene.tweens.add({
      targets: this,
      angle: { from: -10, to: 10 },
      duration: 80,
      yoyo: true,
      repeat: 12,
      ease: 'Sine.InOut',
      onComplete: () => {
        // Splat at the bunny's final position
        const splat = scene.add.image(bx, by, 'splat').setDepth(4);
        scene.tweens.add({
          targets: splat,
          alpha: 0,
          delay: 9000,
          duration: 1000,
          onComplete: () => splat.destroy(),
        });

        if (this.active) this.disableBody(true, true);
      },
    });
  }
}
