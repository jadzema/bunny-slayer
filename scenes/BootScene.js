class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this._createGrass();
    this._createPlayer();
    this._createBunny();
    this._createSplat();
    this._createTree();
    this._createRock();
    this._createFences();
    this.scene.start('Menu');
  }

  _createGrass() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    const colors = [0x4a7c3f, 0x3d6b34, 0x518840, 0x467538];
    for (let ty = 0; ty < 960; ty += 16) {
      for (let tx = 0; tx < 540; tx += 16) {
        g.fillStyle(colors[((tx / 16 + ty / 16) % 4)]);
        g.fillRect(tx, ty, 16, 16);
      }
    }
    g.generateTexture('grass', 540, 960);
    g.destroy();
  }

  _createPlayer() {
    // 84×42 sprite (1.5× scale), default orientation = facing RIGHT
    // Layout: [PERSON x=0-33] [HANDLES x=25-47] [MOWER x=45-84]
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // ── MOWER (x=45–84) ──────────────────────────────────────────
    g.fillStyle(0x111111);
    g.fillRect(45, 1,  12, 10);
    g.fillRect(45, 30, 12, 10);
    g.fillRect(72, 1,  12, 10);
    g.fillRect(72, 30, 12, 10);
    g.fillStyle(0xd4620a);
    g.fillRect(48, 3, 36, 36);
    g.fillStyle(0xa84e08);
    g.fillRect(51, 7, 27, 27);
    g.fillStyle(0xeeeeee, 0.45);
    g.fillRect(57, 18, 13, 3);
    g.fillStyle(0x444444);
    g.fillRect(75, 13, 7, 15);

    // ── HANDLES ──────────────────────────────────────────────────
    g.fillStyle(0x555555);
    g.fillRect(25, 13, 22, 4);
    g.fillRect(25, 24, 22, 4);

    // ── PERSON ───────────────────────────────────────────────────
    g.fillStyle(0x1a3a99);
    g.fillEllipse(13, 32, 24, 15);

    g.fillStyle(0xcc8855);
    g.fillRect(13, 12, 18, 6);
    g.fillRect(13, 24, 18, 6);

    g.fillStyle(0x150800);
    g.fillCircle(13, 19, 13);

    g.fillStyle(0xd4956a);
    g.fillEllipse(19, 19, 13, 16);

    g.fillStyle(0x150800);
    g.fillCircle(6,  16, 7);
    g.fillRect(4,  6,  13, 6);
    g.fillRect(4,  27, 7,  4);

    g.fillStyle(0x0d0400);
    g.fillRect(16, 24, 10, 6);
    g.fillRect(18, 21, 7,  4);

    g.fillStyle(0x111122);
    g.fillRect(18, 15, 3, 3);
    g.fillRect(22, 15, 3, 3);

    g.fillStyle(0xaa6030);
    g.fillRect(22, 19, 3, 3);

    g.generateTexture('player', 84, 42);
    g.destroy();
  }

  _createBunny() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Fluffy tail
    g.fillStyle(0xffffff);
    g.fillCircle(3, 24, 4);

    // Chubby body (warm cream)
    g.fillStyle(0xf5f0e8);
    g.fillEllipse(13, 23, 20, 14);

    // Ears — outer (soft cream)
    g.fillStyle(0xede4d8);
    g.fillEllipse(7,  5, 6, 11);
    g.fillEllipse(17, 5, 6, 11);
    // Ears — inner (bubblegum pink)
    g.fillStyle(0xffaac8);
    g.fillEllipse(7,  5, 3, 7);
    g.fillEllipse(17, 5, 3, 7);

    // Big round head
    g.fillStyle(0xf8f3ec);
    g.fillCircle(12, 13, 10);

    // Rosy cheeks
    g.fillStyle(0xffb8cc, 0.55);
    g.fillCircle(5,  15, 4);
    g.fillCircle(19, 15, 4);

    // Big shiny eyes
    g.fillStyle(0x1a1530);
    g.fillCircle(8,  11, 3);
    g.fillCircle(16, 11, 3);
    // Eye shine
    g.fillStyle(0xffffff);
    g.fillCircle(9,  10, 1);
    g.fillCircle(17, 10, 1);

    // Tiny pink nose
    g.fillStyle(0xff8fa3);
    g.fillCircle(12, 15, 2);

    // Little smile
    g.fillStyle(0xcc5566);
    g.fillRect(10, 17, 2, 1);
    g.fillRect(12, 17, 2, 1);

    g.generateTexture('bunny', 24, 30);
    g.destroy();
  }

  _createSplat() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xaa0000, 0.95);
    g.fillCircle(12, 12, 10);
    g.fillStyle(0xdd1111, 0.8);
    g.fillCircle(8,  8,  5);
    g.fillCircle(16, 14, 4);
    g.fillStyle(0xcc0000, 0.9);
    g.fillCircle(3,  15, 3);
    g.fillCircle(20, 5,  3);
    g.fillCircle(19, 20, 3);
    g.fillCircle(5,  4,  2);
    g.generateTexture('splat', 24, 24);
    g.destroy();
  }

  _createTree() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Trunk
    g.fillStyle(0x5c3317);
    g.fillRect(12, 24, 8, 8);
    // Canopy layers
    g.fillStyle(0x1a4d1a);
    g.fillCircle(16, 18, 14);
    g.fillStyle(0x276227);
    g.fillCircle(16, 14, 11);
    g.fillStyle(0x348734);
    g.fillCircle(16, 10, 8);
    // Highlight
    g.fillStyle(0x50aa50, 0.4);
    g.fillCircle(13, 8, 4);
    g.generateTexture('tree', 32, 32);
    g.destroy();
  }

  _createRock() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x777777);
    g.fillEllipse(14, 14, 24, 18);
    g.fillStyle(0x999999);
    g.fillEllipse(11, 10, 14, 8);
    g.fillStyle(0x555555);
    g.fillEllipse(17, 19, 10, 5);
    g.generateTexture('rock', 28, 28);
    g.destroy();
  }

  _createFences() {
    // Horizontal fence plank
    const gh = this.make.graphics({ x: 0, y: 0, add: false });
    gh.fillStyle(0x8b6914);
    gh.fillRect(0, 3,  32, 7);
    gh.fillRect(0, 14, 32, 7);
    gh.fillStyle(0xa07820);
    gh.fillRect(0, 0, 7, 24);
    gh.fillStyle(0x6a5010);
    gh.fillRect(7, 5,  18, 3);
    gh.fillRect(7, 16, 18, 3);
    gh.generateTexture('fence_h', 32, 24);
    gh.destroy();

    // Vertical fence plank
    const gv = this.make.graphics({ x: 0, y: 0, add: false });
    gv.fillStyle(0x8b6914);
    gv.fillRect(3,  0, 7, 32);
    gv.fillRect(14, 0, 7, 32);
    gv.fillStyle(0xa07820);
    gv.fillRect(0, 0, 24, 7);
    gv.generateTexture('fence_v', 24, 32);
    gv.destroy();
  }
}
