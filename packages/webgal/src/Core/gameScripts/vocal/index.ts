import { ISentence } from '@/Core/controller/scene/sceneInterface';
import { logger } from '@/Core/util/logger';
import { getFigurePositionFromArgs, getNumberArgByKey, getStringArgByKey } from '@/Core/util/getSentenceArg';
import { IStageState } from '@/Core/Modules/stage/stageInterface';
import {
  audioContextWrapper,
  ensureAudioContextReady,
  getAudioLevel,
  performBlinkAnimation,
  performMouthAnimation,
  resetMaxAudioLevel,
  updateMaxAudioLevel,
} from '@/Core/gameScripts/vocal/vocalAnimation';
import { WebGAL } from '@/Core/WebGAL';
import { stageStateManager } from '@/Core/Modules/stage/stageStateManager';

/**
 * 播放一段语音
 * @param sentence 语句
 */
export const playVocal = (sentence: ISentence) => {
  logger.debug('play vocal');
  const performInitName = 'vocal-play';

  const url = getStringArgByKey(sentence, 'vocal') ?? ''; // 获取语音的url
  let volume = getNumberArgByKey(sentence, 'volume') ?? 100; // 获取语音的音量比
  volume = Math.max(0, Math.min(volume, 100)); // 限制音量在 0-100 之间

  let currentStageState: IStageState;
  currentStageState = stageStateManager.getCalculationStageState();

  let pos = getFigurePositionFromArgs(sentence) || 'center';

  let key = getStringArgByKey(sentence, 'figureId') ?? '';

  const freeFigure = currentStageState.freeFigure;
  const figureAssociatedAnimation = currentStageState.figureAssociatedAnimation;
  let bufferLength = 0;

  // 先停止之前的语音
  WebGAL.gameplay.performController.unmountPerform('vocal-play', true);

  // 获得舞台状态
  stageStateManager.setStage('playVocal', url);
  stageStateManager.setStage('vocal', url);
  stageStateManager.setStage('vocalVolume', volume);

  let isOver = false;
  let startTimer: ReturnType<typeof setTimeout> | undefined;
  let blinkEndTimer: ReturnType<typeof setTimeout> | undefined;

  const finishPerform = (error?: unknown) => {
    if (error) {
      logger.warn('Vocal play was blocked by browser autoplay policy or audio activation state.', error);
    }
    isOver = true;
    WebGAL.gameplay.performController.unmountPerform(performInitName);
  };

  /**
   * 嘴型同步
   */

  return {
    performName: performInitName,
    duration: 1000 * 60 * 60,
    isHoldOn: false,
    skipNextCollect: true,
    startFunction: () => {
      startTimer = setTimeout(async () => {
        const VocalControl = document.getElementById('currentVocal') as HTMLMediaElement | null;
        if (VocalControl === null) {
          isOver = true;
          return;
        }
        VocalControl.currentTime = 0;
        key = key ? key : `fig-${pos}`;
        const animationItem = figureAssociatedAnimation.find((tid) => tid.targetId === key);
        if (animationItem) {
          resetMaxAudioLevel();
          const foundFigure = freeFigure.find((figure) => figure.key === key);

          if (foundFigure) {
            pos = foundFigure.basePosition;
          }

          const isAudioContextReady = await ensureAudioContextReady();
          if (isAudioContextReady && audioContextWrapper.audioContext) {
            if (!audioContextWrapper.analyser) {
              audioContextWrapper.analyser = audioContextWrapper.audioContext.createAnalyser();
              audioContextWrapper.analyser.fftSize = 256;
              // Keep the analyser responsive; the envelope in performMouthAnimation shapes the mouth
              audioContextWrapper.analyser.smoothingTimeConstant = 0.4;
            }

            bufferLength = audioContextWrapper.analyser.frequencyBinCount;
            audioContextWrapper.dataArray = new Uint8Array(bufferLength);
            const vocalControl = document.getElementById('currentVocal') as HTMLMediaElement;

            if (!audioContextWrapper.source || audioContextWrapper.source.mediaElement !== vocalControl) {
              if (audioContextWrapper.source) {
                audioContextWrapper.source.disconnect();
              }
              audioContextWrapper.source = audioContextWrapper.audioContext.createMediaElementSource(vocalControl);
              audioContextWrapper.source.connect(audioContextWrapper.analyser);
            }

            audioContextWrapper.analyser.connect(audioContextWrapper.audioContext.destination);

            // Lip-sync Animation
            audioContextWrapper.audioLevelInterval = setInterval(() => {
              const audioLevel = getAudioLevel(
                audioContextWrapper.analyser!,
                audioContextWrapper.dataArray!,
                bufferLength,
              );
              updateMaxAudioLevel(audioLevel);

              performMouthAnimation({
                audioLevel,
                key,
                animationItem,
                pos,
              });
            }, 50);
          } else {
            logger.warn('AudioContext is not ready, skip lip-sync analyzer for this vocal.');
          }

          const animationEndTime = Date.now() + 10000;
          performBlinkAnimation({ key, animationItem, pos, animationEndTime });

          blinkEndTimer = setTimeout(() => {
            clearTimeout(audioContextWrapper.blinkTimerID);
          }, 10000);
        }

        VocalControl.play().catch(finishPerform);

        VocalControl.onended = () => {
          finishPerform();
        };
      }, 1);
    },
    stopFunction: () => {
      if (startTimer) clearTimeout(startTimer);
      if (blinkEndTimer) clearTimeout(blinkEndTimer);
      clearInterval(audioContextWrapper.audioLevelInterval);
      const VocalControl = document.getElementById('currentVocal') as HTMLMediaElement | null;
      if (VocalControl) {
        VocalControl.pause();
        VocalControl.onended = null;
      }
      key = key ? key : `fig-${pos}`;
      const animationItem = figureAssociatedAnimation.find((tid) => tid.targetId === key);
      // Hand the mouth control back to the model motion/expression logic after the vocal ends
      WebGAL.gameplay.pixiStage?.resetMouthY(key);
      // Texture figures: restore the mouth texture to its natural closed state
      if (animationItem) {
        WebGAL.gameplay.pixiStage?.performMouthSyncAnimation(key, animationItem, 'closed', pos);
      }
      clearTimeout(audioContextWrapper.blinkTimerID);
    },
    blockingNext: () => false,
    blockingAuto: () => {
      return !isOver;
    },
  };
};
