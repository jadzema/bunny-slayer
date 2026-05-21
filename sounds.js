window.GameAudio = {
  ctx: null,
  mowerOsc:     null,
  mowerOsc2:    null,
  mowerVibrato: null,
  mowerGain:    null,
  _mowerGain2:  null,

  _ensureCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  startMower() {
    this._ensureCtx();
    if (this.mowerOsc) return;

    const now = this.ctx.currentTime;

    // Main engine sawtooth
    this.mowerOsc = this.ctx.createOscillator();
    this.mowerOsc.type = 'sawtooth';
    this.mowerOsc.frequency.value = 88;

    // Engine flutter LFO
    this.mowerVibrato = this.ctx.createOscillator();
    this.mowerVibrato.frequency.value = 7;
    const vibGain = this.ctx.createGain();
    vibGain.gain.value = 10;
    this.mowerVibrato.connect(vibGain);
    vibGain.connect(this.mowerOsc.frequency);

    // Sub-harmonic for body
    this.mowerOsc2 = this.ctx.createOscillator();
    this.mowerOsc2.type = 'square';
    this.mowerOsc2.frequency.value = 44;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 360;

    this.mowerGain = this.ctx.createGain();
    this.mowerGain.gain.setValueAtTime(0, now);
    this.mowerGain.gain.linearRampToValueAtTime(0.14, now + 0.12);

    this._mowerGain2 = this.ctx.createGain();
    this._mowerGain2.gain.setValueAtTime(0, now);
    this._mowerGain2.gain.linearRampToValueAtTime(0.06, now + 0.12);

    this.mowerOsc.connect(filter);
    filter.connect(this.mowerGain);
    this.mowerGain.connect(this.ctx.destination);

    this.mowerOsc2.connect(this._mowerGain2);
    this._mowerGain2.connect(this.ctx.destination);

    this.mowerOsc.start(now);
    this.mowerVibrato.start(now);
    this.mowerOsc2.start(now);
  },

  stopMower() {
    if (!this.mowerOsc) return;
    const now = this.ctx.currentTime;

    this.mowerGain.gain.setValueAtTime(this.mowerGain.gain.value, now);
    this.mowerGain.gain.linearRampToValueAtTime(0, now + 0.2);
    this._mowerGain2.gain.setValueAtTime(this._mowerGain2.gain.value, now);
    this._mowerGain2.gain.linearRampToValueAtTime(0, now + 0.2);

    const osc  = this.mowerOsc;
    const vib  = this.mowerVibrato;
    const osc2 = this.mowerOsc2;
    this.mowerOsc = this.mowerVibrato = this.mowerOsc2 = null;

    setTimeout(() => { try { osc.stop(); vib.stop(); osc2.stop(); } catch(_) {} }, 350);
  },

  playKill() {
    this._ensureCtx();
    this._playCrunch();
    setTimeout(() => this._playPainSqueal(), 85);
  },

  _playCrunch() {
    const sr  = this.ctx.sampleRate;
    const len = Math.floor(sr * 0.18);
    const buf = this.ctx.createBuffer(1, len, sr);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.6);
    }

    const src    = this.ctx.createBufferSource();
    src.buffer   = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type  = 'bandpass';
    filter.frequency.value = 720;
    filter.Q.value = 1.3;
    const gain   = this.ctx.createGain();
    gain.gain.value = 0.6;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start();
  },

  // Eagle call — loud=true for button activation, false for each attack swoop
  playEagleCall(loud = false) {
    this._ensureCtx();
    const now = this.ctx.currentTime;
    const vol = loud ? 0.38 : 0.24;
    const dur = loud ? 0.75 : 0.50;

    // Main sawtooth — sharp, raptor-like descending cry
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(loud ? 2400 : 2000, now);
    osc.frequency.exponentialRampToValueAtTime(loud ? 650 : 850, now + dur);

    // Bandpass filter gives it a piercing bird-of-prey quality
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 2.8;

    // Fast vibrato (raptor tremolo)
    const vib = this.ctx.createOscillator();
    vib.frequency.value = 16;
    const vibGain = this.ctx.createGain();
    vibGain.gain.value = 55;
    vib.connect(vibGain);
    vibGain.connect(osc.frequency);

    // Short crackle layer for edge
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(loud ? 1200 : 1000, now);
    osc2.frequency.exponentialRampToValueAtTime(300, now + dur * 0.6);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.18, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.6);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    vib.start(now); osc.start(now); osc2.start(now);
    osc.stop(now + dur + 0.01); vib.stop(now + dur + 0.01);
    osc2.stop(now + dur * 0.6 + 0.01);
  },

  _playPainSqueal() {
    // Three diminishing cries spaced 0.65s apart — total ~2 seconds
    const cries = [
      { offset: 0,    startFreq: 1200, endFreq: 320, vol: 0.28, dur: 0.52 },
      { offset: 0.65, startFreq: 980,  endFreq: 260, vol: 0.18, dur: 0.46 },
      { offset: 1.30, startFreq: 760,  endFreq: 200, vol: 0.10, dur: 0.40 },
    ];

    const now = this.ctx.currentTime;
    cries.forEach(cry => {
      const t = now + cry.offset;

      const osc = this.ctx.createOscillator();
      osc.type  = 'sine';
      osc.frequency.setValueAtTime(cry.startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(cry.endFreq, t + cry.dur);

      const trem = this.ctx.createOscillator();
      trem.frequency.value = 22;
      const tremGain = this.ctx.createGain();
      tremGain.gain.value = 38;
      trem.connect(tremGain);
      tremGain.connect(osc.frequency);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(cry.vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + cry.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      trem.start(t); osc.start(t);
      osc.stop(t + cry.dur + 0.01); trem.stop(t + cry.dur + 0.01);
    });
  },
};
