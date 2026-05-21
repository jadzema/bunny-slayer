class VirtualJoystick {
  constructor(scene) {
    this.scene   = scene;
    this.cx      = 120;   // base center in game coords
    this.cy      = 490;
    this.maxDist = 55;
    this.dx      = 0;
    this.dy      = 0;
    this._pid    = null;  // pointer id for multi-touch isolation

    // Base fill + ring
    this._base = scene.add.circle(this.cx, this.cy, 62, 0xffffff, 0.10).setDepth(50);
    scene.add.circle(this.cx, this.cy, 62, 0x000000, 0)
      .setStrokeStyle(2, 0xffffff, 0.35).setDepth(50);

    // Knob
    this._knob = scene.add.circle(this.cx, this.cy, 28, 0xffffff, 0.50).setDepth(51);

    scene.input.on('pointerdown', this._down, this);
    scene.input.on('pointermove', this._move, this);
    scene.input.on('pointerup',   this._up,   this);
    scene.input.on('pointerupoutside', this._up, this);
  }

  _down(ptr) {
    if (this._pid !== null) return;
    const dx = ptr.x - this.cx;
    const dy = ptr.y - this.cy;
    // Accept touch anywhere in 2× radius zone
    if (dx * dx + dy * dy < (this.maxDist * 2.4) ** 2) {
      this._pid = ptr.id;
      this._update(ptr.x, ptr.y);
    }
  }

  _move(ptr) {
    if (ptr.id !== this._pid) return;
    this._update(ptr.x, ptr.y);
  }

  _up(ptr) {
    if (ptr.id !== this._pid) return;
    this._pid = null;
    this.dx   = 0;
    this.dy   = 0;
    this._knob.setPosition(this.cx, this.cy);
  }

  _update(px, py) {
    let dx = px - this.cx;
    let dy = py - this.cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > this.maxDist) { dx = (dx / d) * this.maxDist; dy = (dy / d) * this.maxDist; }
    this._knob.setPosition(this.cx + dx, this.cy + dy);
    this.dx = dx / this.maxDist;
    this.dy = dy / this.maxDist;
  }

  getVector() { return { x: this.dx, y: this.dy }; }

  destroy() {
    if (this.scene) {
      this.scene.input.off('pointerdown',      this._down, this);
      this.scene.input.off('pointermove',      this._move, this);
      this.scene.input.off('pointerup',        this._up,   this);
      this.scene.input.off('pointerupoutside', this._up,   this);
    }
    this._base.destroy();
    this._knob.destroy();
  }
}
