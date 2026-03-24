/**
 * Sound Engine — Web Audio API synthesizer for NEXUS OS terminal effects.
 * All sounds generated procedurally — zero external assets.
 * Default: ON. Toggle persisted in localStorage.
 */

export type SoundId =
    | 'keyClick' | 'keyReturn' | 'typeBleep'
    | 'cmdAccept' | 'cmdError'
    | 'bootBlip' | 'progressTick' | 'glitchNoise' | 'powerOn'
    | 'staticBurst'
    | 'matrixRain' | 'hackSequence' | 'accessDenied' | 'discoveryChime'
    | 'wakeBlip' | 'woosh' | 'landingThud';

const STORAGE_KEY = 'nexus_uc_sound';

class SoundEngine {
    private ctx: AudioContext | null = null;
    private _muted: boolean;
    private matrixInterval: number | null = null;
    private matrixSource: AudioBufferSourceNode | null = null;
    private matrixGain: GainNode | null = null;

    constructor() {
        const stored = localStorage.getItem(STORAGE_KEY);
        this._muted = stored === 'off';

        // Resume AudioContext on first user gesture (browser autoplay policy)
        const initOnGesture = () => {
            const ctx = this.ensureCtx();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            document.removeEventListener('pointerdown', initOnGesture);
            document.removeEventListener('keydown', initOnGesture);
        };
        document.addEventListener('pointerdown', initOnGesture);
        document.addEventListener('keydown', initOnGesture);
    }

    get muted(): boolean {
        return this._muted;
    }

    toggle(): boolean {
        this._muted = !this._muted;
        localStorage.setItem(STORAGE_KEY, this._muted ? 'off' : 'on');
        if (this._muted) this.stopLoop('matrixRain');
        return this._muted;
    }

    play(id: SoundId): void {
        if (this._muted) return;
        const ctx = this.ensureCtx();
        if (ctx.state === 'suspended') {
            // Context not yet ready — resume and retry after it's running
            ctx.resume().then(() => {
                this.dispatch(ctx, id);
            });
            return;
        }
        this.dispatch(ctx, id);
    }

    private dispatch(ctx: AudioContext, id: SoundId): void {
        switch (id) {
            case 'keyClick': this.tone(ctx, 'square', 800, 0.002, 0.03); break;
            case 'keyReturn': this.tone(ctx, 'square', 400, 0.004, 0.05); break;
            case 'typeBleep': this.tone(ctx, 'sine', 1200, 0.001, 0.015); break;
            case 'cmdAccept': this.doubleTone(ctx, 600, 900, 0.04); break;
            case 'cmdError': this.doubleTone(ctx, 600, 300, 0.04); break;
            case 'bootBlip': this.tone(ctx, 'sine', 1000, 0.003, 0.04); break;
            case 'progressTick': this.tone(ctx, 'sine', 600, 0.001, 0.02); break;
            case 'glitchNoise': this.noise(ctx, 0.05, 0.03); break;
            case 'powerOn': this.powerOnSound(ctx); break;
            case 'staticBurst': this.staticBurstSound(ctx); break;
            case 'matrixRain': this.matrixRainLoop(ctx); break;
            case 'hackSequence': this.hackSequenceSound(ctx); break;
            case 'accessDenied': this.tone(ctx, 'sawtooth', 150, 0.3, 0.08); break;
            case 'discoveryChime': this.chime(ctx); break;
            case 'wakeBlip': this.tone(ctx, 'sine', 1000, 0.005, 0.03); break;
            case 'woosh': this.wooshSound(ctx); break;
            case 'landingThud': this.tone(ctx, 'sine', 80, 0.03, 0.08); break;
        }
    }

    stopLoop(id: 'matrixRain'): void {
        if (id === 'matrixRain') {
            if (this.matrixInterval) {
                clearInterval(this.matrixInterval);
                this.matrixInterval = null;
            }
            if (this.matrixSource && this.matrixGain && this.ctx) {
                // Fade out over 800ms instead of abrupt stop
                const now = this.ctx.currentTime;
                this.matrixGain.gain.setValueAtTime(this.matrixGain.gain.value, now);
                this.matrixGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
                const src = this.matrixSource;
                setTimeout(() => { try { src.stop(); } catch { /* already stopped */ } }, 850);
                this.matrixSource = null;
                this.matrixGain = null;
            }
        }
    }

    private ensureCtx(): AudioContext {
        if (!this.ctx) this.ctx = new AudioContext();
        return this.ctx;
    }

    // ── Primitives ──

    private tone(ctx: AudioContext, type: OscillatorType, freq: number, dur: number, gain: number): void {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gain, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.01);
    }

    private doubleTone(ctx: AudioContext, freq1: number, freq2: number, gain: number): void {
        const now = ctx.currentTime;
        const dur = 0.03;
        for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = i === 0 ? freq1 : freq2;
            g.gain.setValueAtTime(gain, now + i * dur);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * dur + dur);
            osc.connect(g).connect(ctx.destination);
            osc.start(now + i * dur);
            osc.stop(now + i * dur + dur + 0.01);
        }
    }

    private noise(ctx: AudioContext, dur: number, gain: number): void {
        const now = ctx.currentTime;
        const sampleRate = ctx.sampleRate;
        const length = Math.floor(sampleRate * dur);
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        const g = ctx.createGain();
        g.gain.setValueAtTime(gain, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);
        src.connect(g).connect(ctx.destination);
        src.start(now);
        src.stop(now + dur + 0.01);
    }

    // ── Complex sounds ──

    private powerOnSound(ctx: AudioContext): void {
        const now = ctx.currentTime;
        const dur = 0.5;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + dur);
        g.gain.setValueAtTime(0.06, now);
        g.gain.setValueAtTime(0.06, now + dur * 0.8);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.01);
    }

    private staticBurstSound(ctx: AudioContext): void {
        const now = ctx.currentTime;
        const dur = 0.2;
        const sampleRate = ctx.sampleRate;
        const length = Math.floor(sampleRate * dur);
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(4000, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + dur);
        filter.Q.value = 1;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.05, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);
        src.connect(filter).connect(g).connect(ctx.destination);
        src.start(now);
        src.stop(now + dur + 0.01);
    }

    private matrixRainLoop(ctx: AudioContext): void {
        // Background noise
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * 2; // 2 second buffer, looped
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        const g = ctx.createGain();
        g.gain.value = 0.015;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        src.connect(filter).connect(g).connect(ctx.destination);
        src.start();
        this.matrixSource = src;
        this.matrixGain = g;

        // Random ping tones
        this.matrixInterval = window.setInterval(() => {
            if (this._muted) { this.stopLoop('matrixRain'); return; }
            const freq = 800 + Math.random() * 2000;
            this.tone(ctx, 'sine', freq, 0.02, 0.02);
        }, 150 + Math.random() * 100);
    }

    private hackSequenceSound(ctx: AudioContext): void {
        const now = ctx.currentTime;
        // 8 fast bleeps
        for (let i = 0; i < 8; i++) {
            const freq = 800 + Math.random() * 800;
            const t = now + i * 0.05;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            g.gain.setValueAtTime(0.04, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
            osc.connect(g).connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.05);
        }
        // Deep buzzer at the end
        const buzzTime = now + 0.45;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 100;
        g.gain.setValueAtTime(0.06, buzzTime);
        g.gain.exponentialRampToValueAtTime(0.001, buzzTime + 0.3);
        osc.connect(g).connect(ctx.destination);
        osc.start(buzzTime);
        osc.stop(buzzTime + 0.31);
    }

    private chime(ctx: AudioContext): void {
        const now = ctx.currentTime;
        const notes = [523, 659, 784]; // C5, E5, G5
        notes.forEach((freq, i) => {
            const t = now + i * 0.08;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            g.gain.setValueAtTime(0.05, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            osc.connect(g).connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.13);
        });
    }

    private wooshSound(ctx: AudioContext): void {
        const now = ctx.currentTime;
        const dur = 0.2;
        const sampleRate = ctx.sampleRate;
        const length = Math.floor(sampleRate * dur);
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3000, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + dur);
        filter.Q.value = 2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.04, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);
        src.connect(filter).connect(g).connect(ctx.destination);
        src.start(now);
        src.stop(now + dur + 0.01);
    }
}

export const sound = new SoundEngine();
