import { ISentence } from '@/Core/controller/scene/sceneInterface';
import { IPerform } from '@/Core/Modules/perform/performInterface';
import { playVocal } from './vocal';
import { webgalStore } from '@/store/store';
import { useTextAnimationDuration, useTextDelay } from '@/hooks/useTextOptions';
import { getRandomPerformName } from '@/Core/Modules/perform/performController';
import { getBooleanArgByKey, getStringArgByKey } from '@/Core/util/getSentenceArg';
import { textSize, voiceOption } from '@/store/userDataInterface';
import { WebGAL } from '@/Core/WebGAL';
import { compileSentence } from '@/Stage/TextBox/TextBox';
import { stageStateManager } from '@/Core/Modules/stage/stageStateManager';

// 口部动画配置常量
const MOUTH_ANIMATION_CONFIG = {
  // 动画帧率控制 (毫秒)
  frameRate: 16, // 约60fps，保证顺滑动画
  // 口部开合周期持续时间 (毫秒) - 随机变化以模拟自然说话
  cycleDuration: {
    min: 250, // 最小周期
    max: 350, // 最大周期
  },
  // 开合周期之间的停顿时间 (毫秒)
  pauseBetweenCycles: 0, // 默认不停顿
  // 口部开到最大后的停留时间 (毫秒)
  holdAtMaxDuration: 0, // 默认不停留
  // 口部开合幅度 (0-1)
  mouthOpenAmplitude: 1, // 固定最大开合幅度
  // 开合动画的缓动函数
  easing: (t: number) => Math.sin(t * Math.PI), // 正弦缓动，更自然
  // 口部状态阈值
  thresholds: {
    open: 0.75,
    halfOpen: 0.25,
  },
  // 音频级别映射
  audioLevelMapping: {
    min: 50, // 最小音频级别（闭合）
    max: 100, // 最大音频级别（张开）
  },
  // 结束动画阈值
  endThreshold: 0.95,
} as const;

// 口部动画状态接口
interface MouthAnimationState {
  startTime: number;
  currentCycleDuration: number;
  isPaused: boolean;
  pauseEndTime: number;
  holdStartTime: number;
  isHolding: boolean;
  lastFrameTime: number;
  isEnding: boolean;
  cycleStartTime: number;
  pauseStartTime: number;
}

// 口部状态类型
type MouthState = 'open' | 'half_open' | 'closed';

/**
 * 获取口部状态
 * @param mouthValue 口部开合值 (0-1)
 * @returns 口部状态
 */
const getMouthState = (mouthValue: number): MouthState => {
  if (mouthValue > MOUTH_ANIMATION_CONFIG.thresholds.open) {
    return 'open';
  } else if (mouthValue > MOUTH_ANIMATION_CONFIG.thresholds.halfOpen) {
    return 'half_open';
  } else {
    return 'closed';
  }
};

/**
 * 应用口部动画
 * @param params 动画参数
 */
const applyMouthAnimation = (params: { targetKey: string; audioLevel: number; animationItem: any; pos: string }) => {
  const { targetKey, audioLevel, animationItem, pos } = params;

  // 应用口部动画 - 直接调用底层函数，避免插值延迟
  WebGAL.gameplay.pixiStage?.setModelMouthY(targetKey, audioLevel);

  // 计算口部开合值 (0-1)
  const mouthValue =
    (audioLevel - MOUTH_ANIMATION_CONFIG.audioLevelMapping.min) /
    (MOUTH_ANIMATION_CONFIG.audioLevelMapping.max - MOUTH_ANIMATION_CONFIG.audioLevelMapping.min);

  // 确定口部状态
  const mouthState = getMouthState(mouthValue);

  // 应用口部同步动画
  if (animationItem !== undefined) {
    WebGAL.gameplay.pixiStage?.performMouthSyncAnimation(targetKey, animationItem, mouthState, pos);
  }
};

/**
 * 生成随机周期持续时间
 * @returns 随机周期持续时间
 */
const generateRandomCycleDuration = (): number => {
  return (
    Math.random() * (MOUTH_ANIMATION_CONFIG.cycleDuration.max - MOUTH_ANIMATION_CONFIG.cycleDuration.min) +
    MOUTH_ANIMATION_CONFIG.cycleDuration.min
  );
};

/**
 * 初始化口部动画状态
 * @param currentTime 当前时间
 * @returns 初始化的动画状态
 */
const initializeMouthAnimationState = (currentTime: number): MouthAnimationState => ({
  startTime: currentTime,
  currentCycleDuration: generateRandomCycleDuration(),
  isPaused: false,
  pauseEndTime: 0,
  holdStartTime: 0,
  isHolding: false,
  lastFrameTime: currentTime,
  isEnding: false,
  cycleStartTime: currentTime,
  pauseStartTime: 0,
});

/**
 * 进行普通对话的显示
 * @param sentence 语句
 * @return {IPerform} 执行的演出
 */
export const say = (sentence: ISentence): IPerform => {
  const stageState = stageStateManager.getCalculationStageState();
  const userDataState = webgalStore.getState().userData;
  let dialogKey = Math.random().toString(); // 生成一个随机的key
  let dialogToShow = sentence.content; // 获取对话内容
  if (dialogToShow) {
    dialogToShow = String(dialogToShow).replace(/ {2,}/g, (match) => '\u00a0'.repeat(match.length)); // 替换连续两个或更多空格
  }
  const isConcat = getBooleanArgByKey(sentence, 'concat') ?? false; // 是否是继承语句
  const isNotend = getBooleanArgByKey(sentence, 'notend') ?? false; // 是否有 notend 参数
  const speaker = getStringArgByKey(sentence, 'speaker'); // 获取说话者
  const clear = getBooleanArgByKey(sentence, 'clear') ?? false; // 是否清除说话者
  const vocal = getStringArgByKey(sentence, 'vocal'); // 是否播放语音

  // 如果是concat，那么就继承上一句的key，并且继承上一句对话。
  if (isConcat) {
    dialogKey = stageState.currentDialogKey;
    dialogToShow = stageState.showText + dialogToShow;
    stageStateManager.setStage('currentConcatDialogPrev', stageState.showText);
  } else {
    stageStateManager.setStage('currentConcatDialogPrev', '');
  }

  // 设置文本显示
  stageStateManager.setStage('showText', dialogToShow);
  WebGAL.flowchartManager.requestUnlockCurrentScene();
  stageStateManager.setStage('vocal', '');

  // 清除语音
  if (!(userDataState.optionData.voiceInterruption === voiceOption.no && vocal === null)) {
    // 只有开关设置为不中断，并且没有语音的时候，才需要不中断
    stageStateManager.setStage('playVocal', '');
    WebGAL.gameplay.performController.unmountPerform('vocal-play', true);
  }
  // 设置key
  stageStateManager.setStage('currentDialogKey', dialogKey);
  // 计算延迟
  const textDelay = useTextDelay(userDataState.optionData.textSpeed);
  // 本句延迟
  const textNodes = compileSentence(sentence.content, 3);
  const len = textNodes.reduce((prev, curr) => prev + curr.length, 0);
  const sentenceDelay = textDelay * len;

  const fontSizeFromArgs = getStringArgByKey(sentence, 'fontSize');
  switch (fontSizeFromArgs) {
    case 'small':
      stageStateManager.setStage('showTextSize', textSize.small);
      break;
    case 'medium':
      stageStateManager.setStage('showTextSize', textSize.medium);
      break;
    case 'large':
      stageStateManager.setStage('showTextSize', textSize.large);
      break;
    default:
      stageStateManager.setStage('showTextSize', -1);
      break;
  }

  // 设置显示的角色名称
  let showName = stageState.showName; // 先默认继承
  if (speaker !== null) {
    showName = speaker;
  }
  if (clear) {
    showName = '';
  }
  stageStateManager.setStage('showName', showName);

  // 模拟说话
  const performSimulateVocalDelay = 0;
  let pos: '' | 'center' | 'left' | 'right' = '';
  const leftFromArgs = getBooleanArgByKey(sentence, 'left') ?? false;
  const rightFromArgs = getBooleanArgByKey(sentence, 'right') ?? false;
  const centerFromArgs = getBooleanArgByKey(sentence, 'center') ?? false;
  if (leftFromArgs) pos = 'left';
  if (rightFromArgs) pos = 'right';
  if (centerFromArgs) pos = 'center';

  let key = getStringArgByKey(sentence, 'figureId') ?? '';

  // 口部动画状态和ID
  let mouthAnimationState: MouthAnimationState | undefined;
  let performSimulateVocalAnimationId: number | null = null;

  const performSimulateVocal = (end = false) => {
    // 如果 mouthAnimationState 未初始化，直接返回
    if (!mouthAnimationState) {
      return;
    }

    const currentTime = Date.now();
    const currentStageState = stageStateManager.getCalculationStageState();
    const figureAssociatedAnimation = currentStageState.figureAssociatedAnimation;
    const animationItem = figureAssociatedAnimation.find((tid) => tid.targetId === key);
    const targetKey = key ? key : `fig-${pos}`;

    if (end) {
      // 标记开始结束动画
      mouthAnimationState.isEnding = true;
      // 不立即结束，让动画完成当前周期
    }

    // 检查是否正在结束动画
    if (mouthAnimationState.isEnding) {
      // 计算当前周期的时间进度
      const cycleElapsedTime = currentTime - mouthAnimationState.cycleStartTime;
      const cycleProgress = (cycleElapsedTime / mouthAnimationState.currentCycleDuration) % 1;

      // 如果当前周期已经完成（接近结束），则真正结束动画
      if (cycleProgress >= MOUTH_ANIMATION_CONFIG.endThreshold) {
        // 结束动画，口部闭合
        applyMouthAnimation({
          targetKey,
          audioLevel: MOUTH_ANIMATION_CONFIG.audioLevelMapping.min,
          animationItem,
          pos,
        });

        // 取消动画帧
        if (performSimulateVocalAnimationId !== null) {
          cancelAnimationFrame(performSimulateVocalAnimationId);
          performSimulateVocalAnimationId = null;
        }
        return;
      }
    }

    // 帧率控制：检查是否需要跳过这一帧
    if (currentTime - mouthAnimationState.lastFrameTime < MOUTH_ANIMATION_CONFIG.frameRate) {
      // 如果距离上一帧时间太短，跳过这一帧
      performSimulateVocalAnimationId = requestAnimationFrame(() => performSimulateVocal());
      return;
    }
    mouthAnimationState.lastFrameTime = currentTime;

    // 检查是否在停顿期间
    if (mouthAnimationState.isPaused) {
      if (currentTime >= mouthAnimationState.pauseEndTime) {
        mouthAnimationState.isPaused = false;
        // 重新开始当前周期
        mouthAnimationState.cycleStartTime = currentTime;
        mouthAnimationState.isHolding = false; // 重置停留状态
        mouthAnimationState.isEnding = false; // 重置结束状态
        // 随机生成新的周期持续时间
        mouthAnimationState.currentCycleDuration = generateRandomCycleDuration();
      } else {
        // 仍在停顿中，保持口部闭合
        applyMouthAnimation({
          targetKey,
          audioLevel: MOUTH_ANIMATION_CONFIG.audioLevelMapping.min,
          animationItem,
          pos,
        });
        performSimulateVocalAnimationId = requestAnimationFrame(() => performSimulateVocal());
        return;
      }
    }

    // 计算当前周期的时间进度
    const cycleElapsedTime = currentTime - mouthAnimationState.cycleStartTime;
    const cycleProgress = (cycleElapsedTime / mouthAnimationState.currentCycleDuration) % 1;

    // 检查是否正在停留
    if (mouthAnimationState.isHolding) {
      if (currentTime >= mouthAnimationState.holdStartTime + MOUTH_ANIMATION_CONFIG.holdAtMaxDuration) {
        // 停留结束，继续正常动画
        mouthAnimationState.isHolding = false;
        mouthAnimationState.cycleStartTime = currentTime;
      } else {
        // 仍在停留中，保持口部开到最大
        applyMouthAnimation({
          targetKey,
          audioLevel: MOUTH_ANIMATION_CONFIG.audioLevelMapping.max,
          animationItem,
          pos,
        });

        performSimulateVocalAnimationId = requestAnimationFrame(() => performSimulateVocal());
        return;
      }
    }

    // 检查是否需要开始新的周期
    if (cycleElapsedTime >= mouthAnimationState.currentCycleDuration) {
      mouthAnimationState.cycleStartTime = currentTime;
      // 随机生成新的周期持续时间
      mouthAnimationState.currentCycleDuration = generateRandomCycleDuration();
    }

    // 应用缓动函数
    const easedProgress = MOUTH_ANIMATION_CONFIG.easing(cycleProgress);

    // 计算口部开合值 (0-1)
    const mouthValue = easedProgress * MOUTH_ANIMATION_CONFIG.mouthOpenAmplitude;

    // 转换为音频级别，适配setModelMouthY的映射函数
    // setModelMouthY的映射：value < 50 ? 0 : (value - 50) / 50
    // 所以我们需要确保value在50-100之间，这样映射后就是0-1
    const audioLevel =
      MOUTH_ANIMATION_CONFIG.audioLevelMapping.min +
      mouthValue * (MOUTH_ANIMATION_CONFIG.audioLevelMapping.max - MOUTH_ANIMATION_CONFIG.audioLevelMapping.min);

    // 检查是否需要开始停留（当口部开到最大时）
    if (
      MOUTH_ANIMATION_CONFIG.holdAtMaxDuration > 0 &&
      mouthValue >= 0.95 && // 接近最大值时开始停留
      !mouthAnimationState.isHolding
    ) {
      mouthAnimationState.isHolding = true;
      mouthAnimationState.holdStartTime = currentTime;
    }

    // 检查是否需要停顿（仅在pauseBetweenCycles > 0时）
    if (
      MOUTH_ANIMATION_CONFIG.pauseBetweenCycles > 0 &&
      cycleElapsedTime >= mouthAnimationState.currentCycleDuration &&
      Math.random() < 0.3
    ) {
      // 30% 概率在周期之间添加停顿
      mouthAnimationState.isPaused = true;
      mouthAnimationState.pauseEndTime = currentTime + MOUTH_ANIMATION_CONFIG.pauseBetweenCycles;
      mouthAnimationState.pauseStartTime = currentTime; // 记录停顿开始时间
    }

    // 应用口部动画
    applyMouthAnimation({
      targetKey,
      audioLevel,
      animationItem,
      pos,
    });

    // 安排下一帧动画
    performSimulateVocalAnimationId = requestAnimationFrame(() => performSimulateVocal());
  };

  // 播放一段语音
  if (vocal) {
    WebGAL.gameplay.performController.arrangeNewPerform(playVocal(sentence), sentence, false);
  } else if (key || pos) {
    // 初始化口部动画状态
    const currentTime = Date.now();
    mouthAnimationState = initializeMouthAnimationState(currentTime);
    performSimulateVocal();
  }

  const performInitName: string = getRandomPerformName();
  let endDelay = useTextAnimationDuration(userDataState.optionData.textSpeed) / 2;
  // 如果有 notend 参数，那么就不需要等待
  if (isNotend) {
    endDelay = 0;
  }

  return {
    performName: performInitName,
    duration: sentenceDelay + endDelay + performSimulateVocalDelay,
    isHoldOn: false,
    stopFunction: () => {
      WebGAL.events.textSettle.emit();
      if (performSimulateVocalAnimationId !== null) {
        cancelAnimationFrame(performSimulateVocalAnimationId);
        performSimulateVocalAnimationId = null;
      }
      // 只有在有动画运行时才正确结束动画
      if (mouthAnimationState) {
        performSimulateVocal(true);
      }
    },
    blockingNext: () => false,
    blockingAuto: () => true,
    goNextWhenOver: isNotend,
  };
};
