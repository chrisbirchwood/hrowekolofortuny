import { useRef, useCallback } from "react";

// Singleton AudioContext - wspoldzielony miedzy renderami
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function useAudio() {
  const audioRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = getAudioContext();
    }
    return audioRef.current;
  }, []);

  const playTick = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800 + Math.random() * 400;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, [getCtx]);

  const playWinSound = useCallback(() => {
    try {
      const ctx = getCtx();
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.15 + 0.3
        );
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } catch {}
  }, [getCtx]);

  const playFanfare = useCallback(() => {
    try {
      const ctx = getCtx();
      const notes = [
        { freq: 523, time: 0, dur: 0.15, type: "square", vol: 0.15 },
        { freq: 523, time: 0.15, dur: 0.15, type: "square", vol: 0.15 },
        { freq: 523, time: 0.3, dur: 0.15, type: "square", vol: 0.15 },
        { freq: 659, time: 0.45, dur: 0.3, type: "square", vol: 0.18 },
        { freq: 523, time: 0.8, dur: 0.15, type: "square", vol: 0.15 },
        { freq: 659, time: 1.0, dur: 0.15, type: "square", vol: 0.15 },
        { freq: 784, time: 1.2, dur: 0.6, type: "square", vol: 0.2 },
        { freq: 262, time: 0, dur: 1.8, type: "sine", vol: 0.08 },
        { freq: 330, time: 0.45, dur: 1.35, type: "sine", vol: 0.06 },
        { freq: 392, time: 1.2, dur: 0.6, type: "sine", vol: 0.07 },
        { freq: 784, time: 2.0, dur: 0.12, type: "square", vol: 0.15 },
        { freq: 784, time: 2.15, dur: 0.12, type: "square", vol: 0.15 },
        { freq: 784, time: 2.3, dur: 0.12, type: "square", vol: 0.15 },
        { freq: 1047, time: 2.5, dur: 0.8, type: "square", vol: 0.2 },
        { freq: 880, time: 2.5, dur: 0.8, type: "sine", vol: 0.08 },
        { freq: 659, time: 2.5, dur: 0.8, type: "sine", vol: 0.06 },
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = note.freq;
        osc.type = note.type;
        const t = ctx.currentTime + note.time;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(note.vol, t + 0.02);
        gain.gain.setValueAtTime(note.vol, t + note.dur * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur);
        osc.start(t);
        osc.stop(t + note.dur);
      });
    } catch {}
  }, [getCtx]);

  return { playTick, playWinSound, playFanfare };
}
