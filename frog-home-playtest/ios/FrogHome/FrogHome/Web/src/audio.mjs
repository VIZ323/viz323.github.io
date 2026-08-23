export class TinyAudio {
  constructor() {
    this.context = null;
    this.enabled = true;
  }

  ensureContext() {
    if (!this.enabled) return null;
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.context = new AudioContextClass();
    }
    if (this.context.state === "suspended") this.context.resume();
    return this.context;
  }

  tone(frequency, duration = 0.1, type = "sine", volume = 0.035, endFrequency = null) {
    const context = this.ensureContext();
    if (!context) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  jump() {
    this.tone(310, 0.18, "sine", 0.045, 570);
  }

  land(perfect = false) {
    this.tone(perfect ? 680 : 510, 0.09, "triangle", 0.04, perfect ? 900 : 620);
    if (perfect) window.setTimeout(() => this.tone(900, 0.08, "sine", 0.028, 1120), 70);
  }

  splash() {
    this.tone(170, 0.24, "sine", 0.05, 72);
  }

  win() {
    [523, 659, 784, 1047].forEach((frequency, index) => {
      window.setTimeout(() => this.tone(frequency, 0.2, "sine", 0.035), index * 105);
    });
  }
}
