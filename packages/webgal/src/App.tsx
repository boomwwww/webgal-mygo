import { useEffect, useRef } from 'react';
import { initializeScript } from '@/Core/initializeScript';
import Translation from '@/UI/Translation/Translation';
import { Stage } from '@/Stage/Stage';
import { BottomControlPanel } from './UI/BottomControlPanel/BottomControlPanel';
import { BangBottomControlPanel } from './UI/BottomControlPanel/BangBottomControlPanel';
import { BottomControlPanelFilm } from '@/UI/BottomControlPanel/BottomControlPanelFilm';
import { Backlog } from '@/UI/Backlog/Backlog';
import Title from '@/UI/Title/Title';
import Logo from '@/UI/Logo/Logo';
import { Extra } from '@/UI/Extra/Extra';
import Menu from '@/UI/Menu/Menu';
import GlobalDialog from '@/UI/GlobalDialog/GlobalDialog';
import PanicOverlay from '@/UI/PanicOverlay/PanicOverlay';
import DevPanel from '@/UI/DevPanel/DevPanel';
import { RootState, webgalStore } from '@/store/store';
import { useSelector } from 'react-redux';

import { WebGAL } from '@/Core/WebGAL';
import { screenRotation } from '@/store/userDataInterface';

/** 各固定角度对应的旋转角度（顺时针为正） */
const screenRotationDegreeMap: Record<screenRotation, number> = {
  auto: 0,
  angle0: 0,
  angle90: 90,
  angle180: 180,
  angle270: -90, // 等价于顺时针 270°
};

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);

  const resize = () => {
    if (appRef.current === null) return;

    const app = appRef.current;

    // 读取画面方向设置（旧存档可能缺少该字段，默认为自动）
    const rotationMode = webgalStore.getState().userData.optionData.screenRotation ?? 'auto';
    const isVertical = WebGAL.stageWidth < WebGAL.stageHeight;

    // 计算画面旋转角度：自动模式下根据窗口方向与舞台方向决定，否则使用玩家锁定的角度
    let rotateDegree = 0;
    if (rotationMode === 'auto') {
      const shouldAutoRotate = WebGAL.autoRotate
        ? isVertical
          ? window.innerWidth > window.innerHeight
          : window.innerWidth < window.innerHeight
        : false;
      if (shouldAutoRotate) rotateDegree = isVertical ? -90 : 90;
    } else {
      rotateDegree = screenRotationDegreeMap[rotationMode] ?? 0;
    }

    // 90°/270° 时窗口宽高需要交换，否则使用原始宽高
    const isWindowRotated = Math.abs(rotateDegree) === 90;
    const rotatedWindowWidth = isWindowRotated ? window.innerHeight : window.innerWidth;
    const rotatedWindowHeight = isWindowRotated ? window.innerWidth : window.innerHeight;
    const widthRatio = rotatedWindowWidth / WebGAL.stageWidth;
    const heightRatio = rotatedWindowHeight / WebGAL.stageHeight;
    const scale = Math.min(widthRatio, heightRatio);

    app.style.width = `${WebGAL.stageWidth}px`;
    app.style.height = `${WebGAL.stageHeight}px`;
    app.style.scale = `${scale}`;
    app.style.left = `${(rotatedWindowWidth - WebGAL.stageWidth * scale) / 2}px`;
    app.style.top = `${(rotatedWindowHeight - WebGAL.stageHeight * scale) / 2}px`;

    if (isWindowRotated) {
      document.documentElement.style.width = '100vh';
      document.documentElement.style.height = '100vw';
    } else {
      document.documentElement.style.width = '100vw';
      document.documentElement.style.height = '100vh';
    }
    document.documentElement.style.transform = `translate(-50%, -50%) rotate(${rotateDegree}deg)`;
  };

  const userData = useSelector((state: RootState) => state.userData);
  const isFirstRender = useRef(true);
  useEffect(() => {
    initializeScript().then(() => {
      resize();
    });

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 画面方向选项变化时，立即重新计算缩放与旋转（跳过首次渲染，避免初始化完成前出现闪烁）
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resize();
  }, [userData.optionData.screenRotation]);
  return (
    <div className="App" ref={appRef}>
      <Translation />
      <Stage />
      {userData.optionData.enableBangControlPanel ? <BangBottomControlPanel /> : <BottomControlPanel />}
      <BottomControlPanelFilm />
      <Backlog />
      <Title />
      <Logo />
      <Extra />
      <Menu />
      <GlobalDialog />
      <PanicOverlay />
      <DevPanel />
    </div>
  );
}
