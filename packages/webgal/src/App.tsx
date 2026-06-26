import { useEffect } from 'react';
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
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export default function App() {
  const userData = useSelector((state: RootState) => state.userData);
  useEffect(() => {
    initializeScript();
  }, []);
  return (
    <div className="App">
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
