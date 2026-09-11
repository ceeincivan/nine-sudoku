let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function installAudioUnlock(): void {
  if (typeof window === "undefined") return;
  const unlock = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "running") {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    }
  };

  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("click", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gainVal = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

export const sfx = {
  place: () => playTone(520, 0.08, "sine", 0.12),
  clear: () => playTone(280, 0.1, "triangle", 0.1),
  gloat: () => {
    playTone(320, 0.06, "sawtooth", 0.1);
    setTimeout(() => playTone(220, 0.12, "sawtooth", 0.12), 60);
  },
  lose: () => {
    playTone(200, 0.15, "sawtooth", 0.15);
    setTimeout(() => playTone(160, 0.2, "sawtooth", 0.15), 120);
    setTimeout(() => playTone(120, 0.3, "sawtooth", 0.18), 280);
  },
  react: () => {
    playTone(680, 0.05, "sine", 0.12);
    setTimeout(() => playTone(880, 0.08, "sine", 0.12), 50);
  },
  win: () => {
    playTone(523.25, 0.1, "sine", 0.15);
    setTimeout(() => playTone(659.25, 0.1, "sine", 0.15), 100);
    setTimeout(() => playTone(783.99, 0.1, "sine", 0.15), 200);
    setTimeout(() => playTone(1046.5, 0.25, "sine", 0.18), 300);
  },
};
