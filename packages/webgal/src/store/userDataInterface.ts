import { IGameVar, IStageState } from '@/Core/Modules/stage/stageInterface';
import { language } from '@/config/language';
import { IBacklogItem } from '@/Core/Modules/backlog';
import { ISceneEntry } from '@/Core/Modules/scene';

/**
 * 播放速度的枚举类型
 */
export enum playSpeed {
  slow, // 慢
  normal, // 中
  fast, // 快
}

export enum textSize {
  small,
  medium,
  large,
}

export enum voiceOption {
  yes,
  no,
}

export enum fullScreenOption {
  on,
  off,
}

/**
 * 画面方向（屏幕旋转）的类型
 * auto: 自动（根据窗口方向与舞台方向自动旋转）
 * angle0: 固定 0°（不旋转）
 * angle90: 固定顺时针旋转 90°
 * angle180: 固定旋转 180°
 * angle270: 固定逆时针旋转 90°（即 270°）
 */
export type screenRotation = 'auto' | 'angle0' | 'angle90' | 'angle180' | 'angle270';

/** 画面方向的可选值列表，顺序即设置面板中的按钮顺序 */
export const screenRotationOptions: screenRotation[] = ['auto', 'angle0', 'angle90', 'angle180', 'angle270'];

/**
 * @interface IOptionData 用户设置数据接口
 */
export interface IOptionData {
  volumeMain: number; // 主音量
  textSpeed: number; // 文字速度
  autoSpeed: number; // 自动播放速度
  textSize: textSize;
  vocalVolume: number; // 语音音量
  bgmVolume: number; // 背景音乐音量
  seVolume: number; // 音效音量
  uiSeVolume: number; // 用户界面音效音量
  slPage: number; // 存读档界面所在页面
  textboxFont: number;
  textboxOpacity: number;
  language: language;
  voiceInterruption: voiceOption; // 是否中断语音
  fullScreen: fullScreenOption;
  skipAll: boolean; // 快进已读/快进全文
  enableBangControlPanel: boolean; // 使用 BanGDream 控制面板
  screenRotation: screenRotation; // 画面方向（自动旋转或固定角度）
}

/**
 * 场景存档接口
 * @interface ISaveScene
 */
export interface ISaveScene {
  currentSentenceId: number; // 当前语句ID
  sceneStack: Array<ISceneEntry>; // 场景栈
  sceneName: string; // 场景名称
  sceneUrl: string; // 场景url
}

/**
 * @interface ISaveData 存档文件接口
 */
export interface ISaveData {
  nowStageState: IStageState;
  backlog: Array<IBacklogItem>; // 舞台数据
  index: number; // 存档的序号
  saveTime: string; // 保存时间
  sceneData: ISaveScene; // 场景数据
  previewImage: string;
}

export interface IAppreciationAsset {
  name: string;
  url: string;
  series: string;
  order?: number;
}

export interface IAppreciation {
  bgm: Array<IAppreciationAsset>;
  cg: Array<IAppreciationAsset>;
}

/**
 * @interface IUserData 用户数据接口
 */
export interface IUserData {
  scriptManagedGlobalVar: string[];
  globalGameVar: IGameVar; // 不跟随存档的全局变量
  optionData: IOptionData; // 用户设置选项数据
  appreciationData: IAppreciation;
  gameConfigInit: IGameVar;
  readHistory: Record<string, string>;
}

export interface ISetUserDataPayload {
  key: keyof IUserData;
  value: any;
}

export interface ISetOptionDataPayload {
  key: keyof IOptionData;
  value: any;
}

export interface IUserDataStore {
  userDataState: IUserData;
  setUserData: <K extends keyof IUserData>(key: K, value: any) => void;
  replaceUserData: (newUserData: IUserData) => void;
  setOptionData: <K extends keyof IOptionData>(key: K, value: any) => void;
  setSlPage: (index: number) => void;
}

export type UserDataStore = IUserDataStore;
