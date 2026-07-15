import './index.css';

import { DashboardApp } from "@geo2france/api-dashboard";
import { config } from './config'
import { MaPremierePage } from './pages/page1';
import { PageEmpty } from './pages/page_empty';



const App: React.FC = () => {
  return (
    <DashboardApp {...config} >
        <MaPremierePage title="Page 1" icon="icon-park-outline:page"/>
        <PageEmpty title="Page 2" icon="mdi:new-box"/>

    </DashboardApp>
  )
};

export default App;
