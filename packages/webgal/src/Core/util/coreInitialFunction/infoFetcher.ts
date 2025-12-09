import { webgalStore } from '@/store/store';
import { setGlobalVar } from '@/store/userDataReducer';
import { setEnableAppreciationMode } from '@/store/GUIReducer';
import { Live2D, WebGAL } from '@/Core/WebGAL';
import { WebgalParser } from '@/Core/parser/sceneParser';
import { getStorageAsync, setStorage } from '@/Core/controller/storage/storageController';
import { initKey } from '@/Core/controller/storage/fastSaveLoad';
import { getFastSaveFromStorage, getSavesFromStorage } from '@/Core/controller/storage/savesController';
import { logger } from '@/Core/util/logger';
import axios from 'axios';

/**
 * 获取游戏信息
 * @param url 游戏信息路径
 */
export const infoFetcher = async (url: string) => {
  const dispatch = webgalStore.dispatch;
  const r = await axios.get(url);
  let gameConfigRaw: string = r.data;
  let gameConfig = WebgalParser.parseConfig(gameConfigRaw);
  logger.info('获取到游戏信息', gameConfig);
  // 先把 key 找到并设置了
  const keyItem = gameConfig.find((e) => e.command === 'Game_key');
  WebGAL.gameKey = (keyItem?.args?.[0] as string) ?? '';
  initKey();
  await getStorageAsync();
  await getFastSaveFromStorage();
  getSavesFromStorage(0, 0);
  // 按照游戏的配置开始设置对应的状态
  gameConfig.forEach((e) => {
    const { command, args } = e;
    if (args.length > 0) {
      if (args.length > 1) {
        dispatch(
          setGlobalVar({
            key: command,
            value: args.join('|'),
          }),
        );
      } else {
        let res: any = args[0].trim();
        if (/^(true|false)$/g.test(args[0])) {
          res = res === 'true';
        } else if (/^[0-9]+\.?[0-9]+$/g.test(args[0])) {
          res = Number(res);
        }

        dispatch(
          setGlobalVar({
            key: command,
            value: res,
          }),
        );

        if (command === 'Enable_Appreciation') {
          dispatch(setEnableAppreciationMode(res));
        }
        if (command === 'Legacy_Expression_Blend_Mode') {
          Live2D.legacyExpressionBlendMode = res === true;
        }
        if (command === 'Steam_AppID') {
          const appId = String(res);
          WebGAL.steam.initialize(appId);
        }
        if (command === 'Positioning_Type') {
          switch (res) {
            case 'W_4_5_12':
            case 'M_2_3':
              Live2D.positioningType = 'M_2_3';
              break;
            case 'W_4_5_13':
            case 'M_2_4':
            case 'M_2_5':
              Live2D.positioningType = 'M_2_4';
              break;
            case 'BC_1_0_0':
            case 'M_3_0_0':
              Live2D.positioningType = 'M_3_0_0';
              break;
            case 'M_3_1_0':
              Live2D.positioningType = 'M_3_1_0';
              break;
            default:
              Live2D.positioningType = 'M_3_1_0';
          }
        }
        if (command === 'Stage_Width') {
          WebGAL.stageWidth = Number(res);
        }
        if (command === 'Stage_Height') {
          WebGAL.stageHeight = Number(res);
        }
      }
    }
  });
  // @ts-expect-error renderPromiseResolve is a global variable
  window.renderPromiseResolve();
  setStorage();
};
