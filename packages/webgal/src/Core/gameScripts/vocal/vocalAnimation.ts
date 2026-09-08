import { WebGAL } from '@/Core/WebGAL';

interface IAudioContextWrapper {
  audioContext: AudioContext | null;
  source: MediaElementAudioSourceNode | null;
  analyser: AnalyserNode | undefined;
  dataArray: Uint8Array | undefined;
  audioLevelInterval: ReturnType<typeof setInterval>;
  blinkTimerID: ReturnType<typeof setTimeout>;
  maxAudioLevel: number;
  smoothedMouthValue: number;
}

// Initialize the object based on the interface
export const audioContextWrapper: IAudioContextWrapper = {
  audioContext: null,
  source: null,
  analyser: undefined,
  dataArray: undefined,
  audioLevelInterval: setInterval(() => {}, 0), // dummy interval
  blinkTimerID: setTimeout(() => {}, 0), // dummy timeout
  maxAudioLevel: 0,
  smoothedMouthValue: 0,
};

export const ensureAudioContextReady = async (): Promise<boolean> => {
  if (!audioContextWrapper.audioContext) {
    const AudioContextCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) {
      return false;
    }

    audioContextWrapper.audioContext = new AudioContextCtor();
  }

  if (audioContextWrapper.audioContext.state === 'suspended') {
    try {
      await audioContextWrapper.audioContext.resume();
    } catch {
      return false;
    }
  }

  return audioContextWrapper.audioContext.state === 'running';
};

export const resetMaxAudioLevel = () => {
  audioContextWrapper.maxAudioLevel = 0;
  audioContextWrapper.smoothedMouthValue = 0;
};

export const updateMaxAudioLevel = (audioLevel: number) => {
  // Dynamic peak with exponential decay so the mouth keeps moving through a long vocal.
  // A small floor avoids over-amplifying very quiet audio.
  audioContextWrapper.maxAudioLevel = Math.max(audioLevel, audioContextWrapper.maxAudioLevel * 0.985, 15);
};

export const performBlinkAnimation = (params: {
  key: string;
  animationItem: any;
  pos: string;
  animationEndTime: number;
}) => {
  let isBlinking = false;

  function blink() {
    if (isBlinking || (params.animationEndTime && Date.now() > params.animationEndTime)) return;
    isBlinking = true;
    WebGAL.gameplay.pixiStage?.performBlinkAnimation(params.key, params.animationItem, 'closed', params.pos);
    audioContextWrapper.blinkTimerID = setTimeout(() => {
      WebGAL.gameplay.pixiStage?.performBlinkAnimation(params.key, params.animationItem, 'open', params.pos);
      isBlinking = false;
      const nextBlinkTime = Math.random() * 300 + 3500;
      audioContextWrapper.blinkTimerID = setTimeout(blink, nextBlinkTime);
    }, 200);
  }
  blink();
};

// Extract speech energy from the low/mid frequency bins only.
// Averaging every bin dilutes the signal with high-frequency noise.
export const getAudioLevel = (
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  bufferLength: number,
): number => {
  analyser.getByteFrequencyData(dataArray as any);
  const usedBins = Math.max(8, Math.floor(bufferLength / 4));
  let sum = 0;
  for (let i = 0; i < usedBins; i++) {
    sum += dataArray[i];
  }
  return sum / usedBins;
};

// Below this level the vocal is treated as silence
const NOISE_GATE = 4;

export const performMouthAnimation = (params: {
  audioLevel: number;
  key: string;
  animationItem: any;
  pos: string;
}) => {
  const { audioLevel, key, animationItem, pos } = params;

  // Normalize with the dynamic peak (AGC) so quiet and loud voices both animate well.
  // Silence is gated so the mouth stays closed.
  const maxLevel = Math.max(audioContextWrapper.maxAudioLevel, 1);
  const normalizedRaw = audioLevel <= NOISE_GATE ? 0 : Math.min(1, audioLevel / maxLevel);

  // One-pole envelope: fast attack when opening, slower release when closing.
  const ATTACK = 0.55;
  const RELEASE = 0.3;
  const alpha = normalizedRaw > audioContextWrapper.smoothedMouthValue ? ATTACK : RELEASE;
  audioContextWrapper.smoothedMouthValue += (normalizedRaw - audioContextWrapper.smoothedMouthValue) * alpha;
  const mouthValue = audioContextWrapper.smoothedMouthValue;

  // Map to the 50-100 scale setModelMouthY expects, so the Live2D mouth param is continuous.
  const mouthAudioLevel = 50 + mouthValue * 50;
  WebGAL.gameplay.pixiStage?.setModelMouthY(key, mouthAudioLevel);

  let mouthState;
  if (mouthValue > 0.75) {
    mouthState = 'open';
  } else if (mouthValue > 0.5) {
    mouthState = 'half_open';
  } else {
    mouthState = 'closed';
  }
  if (animationItem !== undefined) {
    WebGAL.gameplay.pixiStage?.performMouthSyncAnimation(key, animationItem, mouthState, pos);
  }
};
