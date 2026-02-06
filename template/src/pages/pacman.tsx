import { Dashboard, Intro, useControl } from "@geo2france/api-dashboard/dsl"
import Pacman from "../charts/Pacman"

export const PacmanPage = () => {
    return (
        <Dashboard columns={1} debug>
          <Intro><div>Apache ECharts permet de créer toutes sortes de visualation ! 😀🎮</div></Intro>
          <Pacman mouth={Number(useControl('pacman')) || 25} auto={Boolean(useControl('pacman_auto'))}/>      

        </Dashboard>
    )
}