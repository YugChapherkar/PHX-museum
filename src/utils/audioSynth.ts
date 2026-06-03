export class AtmosphericSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private windOsc: OscillatorNode | null = null;
  private modulationOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;
  private dripInterval: any = null;
  private analyser: AnalyserNode | null = null;

  constructor() {}

  public start() {
    if (this.ctx) return;

    try {
      // Create context safely
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      
      // Connect to analyser for active real-time spectrum mapping
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64; // Low detail is perfect for 10-line clean oscillograms
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      
      // 1. Setup deep cavernous drone
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = "sine";
      this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note - deep rumble

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      // Low pass filter for wind-like feeling
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(150, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(5, this.ctx.currentTime);

      this.droneOsc.connect(droneGain);
      droneGain.connect(this.filter);

      // 2. Setup modulated wind noise
      this.windOsc = this.ctx.createOscillator();
      this.windOsc.type = "triangle";
      this.windOsc.frequency.setValueAtTime(90, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      // Modulation generator for wind movement (slow frequency sweeps)
      this.modulationOsc = this.ctx.createOscillator();
      this.modulationOsc.type = "sine";
      this.modulationOsc.frequency.setValueAtTime(0.12, this.ctx.currentTime); // very slow cycle (8s)

      const modulationGain = this.ctx.createGain();
      modulationGain.gain.setValueAtTime(40, this.ctx.currentTime); // +/- 40 Hz swing

      this.modulationOsc.connect(modulationGain);
      modulationGain.connect(this.windOsc.frequency); // modulate the wind sweep

      this.windOsc.connect(this.windGain);
      this.windGain.connect(this.filter);

      // Connect filtered world drone output to master
      this.filter.connect(this.masterGain);

      // Start all sound node generators
      this.droneOsc.start();
      this.windOsc.start();
      this.modulationOsc.start();

      // Fade in master gain smoothly to prevent pops
      this.masterGain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 1.5);

      // 3. Procedural cave-drips or ancient bio-chirps at intervals
      this.dripInterval = setInterval(() => {
        this.playCaveDrip();
      }, 4200);

    } catch (err) {
      console.warn("Web Audio API not supported or blocked by browser policies", err);
    }
  }

  private playCaveDrip() {
    if (!this.ctx || this.ctx.state === "suspended" || !this.masterGain) return;

    try {
      const pingOsc = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      const delay = this.ctx.createDelay();
      const feedback = this.ctx.createGain();

      // high eco bird/drip pitch
      pingOsc.type = "sine";
      const randomPitch = 800 + Math.random() * 600;
      pingOsc.frequency.setValueAtTime(randomPitch, this.ctx.currentTime);
      // fast sweep-down for organic water drop or distant bird cry
      pingOsc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);

      pingGain.gain.setValueAtTime(0, this.ctx.currentTime);
      pingGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.02);
      pingGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      // Add simple feedback line delay for huge cavern space depth
      delay.delayTime.setValueAtTime(0.2, this.ctx.currentTime);
      feedback.gain.setValueAtTime(0.5, this.ctx.currentTime);

      pingOsc.connect(pingGain);
      
      // Routing ping to filter echo
      pingGain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);

      pingGain.connect(this.masterGain);
      delay.connect(this.masterGain);

      pingOsc.start();
      pingOsc.stop(this.ctx.currentTime + 0.5);
    } catch {
      // safe bypass
    }
  }

  public stop() {
    if (this.dripInterval) {
      clearInterval(this.dripInterval);
      this.dripInterval = null;
    }

    if (this.masterGain && this.ctx) {
      // ramp down sound smoothly to avoid static noise spikes
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
      
      setTimeout(() => {
        try {
          this.droneOsc?.stop();
          this.windOsc?.stop();
          this.modulationOsc?.stop();
          this.ctx?.close();
        } catch {}
        this.ctx = null;
        this.masterGain = null;
        this.droneOsc = null;
        this.windOsc = null;
        this.modulationOsc = null;
        this.filter = null;
        this.windGain = null;
        this.analyser = null;
      }, 900);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }
}
