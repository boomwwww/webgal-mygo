import { useEffect, useRef } from 'react';
import { initializeScript } from '@/Core/initializeScript';
import Translation from '@/UI/Translation/Translation';
import { Stage } from '@/Stage/Stage';
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
import { WebGAL } from './Core/WebGAL';

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);

  const resize = () => {
    if (appRef.current === null) return;

    const app = appRef.current;

    const isRotated = window.innerWidth < window.innerHeight;
    const rotatedWindowWidth = isRotated ? window.innerHeight : window.innerWidth;
    const rotatedWindowHeight = isRotated ? window.innerWidth : window.innerHeight;
    const widthRatio = rotatedWindowWidth / WebGAL.stageWidth;
    const heightRatio = rotatedWindowHeight / WebGAL.stageHeight;
    const scale = Math.min(widthRatio, heightRatio);

    app.style.width = `${WebGAL.stageWidth}px`;
    app.style.height = `${WebGAL.stageHeight}px`;
    app.style.scale = `${scale}`;
    app.style.left = `${(rotatedWindowWidth - WebGAL.stageWidth * scale) / 2}px`;
    app.style.top = `${(rotatedWindowHeight - WebGAL.stageHeight * scale) / 2}px`;
  };

  useEffect(() => {
    initializeScript().then(() => {
      resize();
    });

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <div className="App" ref={appRef}>
      <Translation />
      <Stage />
      <BangBottomControlPanel />
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
