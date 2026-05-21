class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    // Loaded from embedded base64 (bonus_art_data.js) so it works on
    // both file:// and GitHub Pages without CORS issues.
    if (window.BONUS_ART_DATA) {
      this.load.image('bonus_art', window.BONUS_ART_DATA);
    }
  }

  create() {
    this._createGrass();
    this._createPlayer();
    this._createPlayerTier1();
    this._createPlayerTier2();
    this._createBunny();
    this._createSplat();
    this._createTree();
    this._createRock();
    this._createFences();
    this._createGrassPatch();
    this._createEagle();
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

  // ── Tall-grass bonus patch ─────────────────────────────────────
  _createGrassPatch() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x1a6b1a);
    g.fillRect(0, 0, 84, 42);
    // Hardcoded blade heights for a deterministic, lush look
    const blades = [
      { x:2,  h:22, c:0x22cc22 }, { x:9,  h:18, c:0x44ee44 }, { x:16, h:26, c:0x1faa1f },
      { x:23, h:20, c:0x33dd33 }, { x:30, h:24, c:0x22cc22 }, { x:37, h:16, c:0x55ff55 },
      { x:44, h:28, c:0x1faa1f }, { x:51, h:19, c:0x33dd33 }, { x:58, h:23, c:0x22cc22 },
      { x:65, h:17, c:0x44ee44 }, { x:72, h:25, c:0x1faa1f }, { x:79, h:21, c:0x33dd33 },
    ];
    blades.forEach(b => { g.fillStyle(b.c); g.fillRect(b.x, 42 - b.h, 5, b.h); });
    g.fillStyle(0xccffcc, 0.35);
    g.fillRect(8, 4, 6, 3); g.fillRect(38, 6, 5, 3); g.fillRect(66, 3, 7, 3);
    g.lineStyle(2, 0x88ff88, 0.9);
    g.strokeRect(1, 1, 82, 40);
    g.generateTexture('grass_patch', 84, 42);
    g.destroy();
  }

  // ── Ride-on mower (tier 1) — same 84×42 canvas ────────────────
  _createPlayerTier1() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Big rear wheels (back = left when facing right)
    g.fillStyle(0x111111);
    g.fillRect(0, 0, 16, 18); g.fillRect(0, 24, 16, 18);
    g.fillStyle(0x2a2a2a);
    g.fillRect(2, 3, 9, 12);  g.fillRect(2, 27, 9, 12);
    // Small front wheels
    g.fillStyle(0x111111);
    g.fillRect(68, 7, 12, 12); g.fillRect(68, 23, 12, 12);
    // Main body (amber-orange)
    g.fillStyle(0xd4820a);
    g.fillRect(16, 0, 52, 42);
    // Engine hood (front-right, darker)
    g.fillStyle(0xaa5c08);
    g.fillRect(50, 3, 18, 36);
    g.fillStyle(0x883d06);
    g.fillRect(54, 7, 10, 28);
    // Seat / driver platform
    g.fillStyle(0x2a2a2a);
    g.fillRect(18, 10, 28, 22);
    // Person — dark hair
    g.fillStyle(0x150800);
    g.fillCircle(31, 21, 10);
    g.fillRect(27, 13, 8, 5);
    // Face (skin)
    g.fillStyle(0xd4956a);
    g.fillEllipse(31, 21, 9, 12);
    // Beard
    g.fillStyle(0x0d0400);
    g.fillRect(28, 25, 7, 4);
    // Eyes
    g.fillStyle(0x111122);
    g.fillRect(28, 19, 2, 2); g.fillRect(32, 19, 2, 2);
    // Blue shirt shoulders
    g.fillStyle(0x1a3a99);
    g.fillRect(21, 29, 19, 8);
    // Steering wheel
    g.fillStyle(0x555555);
    g.fillRect(40, 18, 12, 4); g.fillRect(43, 15, 4, 10);
    // Body glint
    g.fillStyle(0xeeaa44, 0.35);
    g.fillRect(20, 3, 28, 3);
    g.generateTexture('player_tier1', 84, 42);
    g.destroy();
  }

  // ── Zero-turn mower (tier 2) ───────────────────────────────────
  _createPlayerTier2() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Big rear wheels with tread
    g.fillStyle(0x111111);
    g.fillRect(0, 0, 18, 20); g.fillRect(0, 22, 18, 20);
    g.fillStyle(0x2a2a2a);
    g.fillRect(2, 3, 12, 14); g.fillRect(2, 25, 12, 14);
    // Front caster wheels
    g.fillStyle(0x222222);
    g.fillRect(66, 9, 12, 10); g.fillRect(66, 23, 12, 10);
    // Body (gold)
    g.fillStyle(0xcc8800);
    g.fillRect(18, 0, 48, 42);
    // Cutting deck (lighter gold)
    g.fillStyle(0xe09900);
    g.fillRect(42, 2, 24, 38);
    g.fillStyle(0xaa7000);
    g.fillRect(46, 6, 3, 30); g.fillRect(52, 6, 3, 30); g.fillRect(58, 6, 3, 30);
    // Driver platform
    g.fillStyle(0x3a3a00);
    g.fillRect(20, 10, 18, 22);
    // Person — dark hair
    g.fillStyle(0x150800);
    g.fillCircle(29, 21, 10);
    g.fillRect(25, 13, 8, 5);
    // Face
    g.fillStyle(0xd4956a);
    g.fillEllipse(29, 21, 9, 12);
    // Beard
    g.fillStyle(0x0d0400);
    g.fillRect(26, 25, 7, 4);
    // Eyes
    g.fillStyle(0x111122);
    g.fillRect(26, 19, 2, 2); g.fillRect(30, 19, 2, 2);
    // Blue shirt
    g.fillStyle(0x1a3a99);
    g.fillRect(21, 29, 16, 8);
    // Zero-turn dual drive sticks (characteristic look)
    g.fillStyle(0x888888);
    g.fillRect(17, 12, 4, 18); g.fillRect(38, 12, 4, 18);
    g.fillRect(17, 11, 8, 4);  g.fillRect(38, 11, 8, 4);
    // Glint
    g.fillStyle(0xffcc44, 0.3);
    g.fillRect(20, 2, 20, 3);
    g.generateTexture('player_tier2', 84, 42);
    g.destroy();
  }

  // ── Bald eagle with flag cape (32×32) ─────────────────────────
  _createEagle() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Wings (spread, top-down)
    g.fillStyle(0x8b4513);
    g.fillRect(0, 11, 14, 9); g.fillRect(18, 11, 14, 9);
    g.fillStyle(0x4a2000);
    g.fillRect(0, 12, 5, 7);  g.fillRect(27, 12, 5, 7);
    g.fillStyle(0x5c2d0a);
    g.fillRect(5, 11, 2, 9);  g.fillRect(11, 11, 2, 9);
    g.fillRect(21, 11, 2, 9); g.fillRect(25, 11, 2, 9);
    // Brown body
    g.fillStyle(0x6b3a1a);
    g.fillEllipse(16, 16, 10, 18);
    // White head (bald eagle)
    g.fillStyle(0xffffff);
    g.fillCircle(16, 7, 6);
    // Yellow beak
    g.fillStyle(0xffaa00);
    g.fillRect(19, 5, 4, 3);
    // Eye
    g.fillStyle(0x111111);
    g.fillRect(15, 6, 2, 2);
    // American-flag cape (tail)
    g.fillStyle(0xdd1111);
    g.fillRect(11, 23, 10, 8);
    g.fillStyle(0xffffff);
    g.fillRect(11, 25, 10, 2);
    g.fillStyle(0xdd1111);
    g.fillRect(11, 27, 10, 2);
    g.fillStyle(0x0033cc);
    g.fillRect(11, 23, 5, 4);
    g.fillStyle(0xffffff);
    g.fillRect(12, 24, 1, 1); g.fillRect(14, 24, 1, 1);
    g.fillRect(12, 26, 1, 1); g.fillRect(14, 26, 1, 1);
    g.generateTexture('eagle', 32, 32);
    g.destroy();
  }
}
