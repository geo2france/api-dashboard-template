import { PageProps } from "@geo2france/api-dashboard"
import  { Control, Dashboard,  Palette, Select } from "@geo2france/api-dashboard/dsl"

export const PageEmpty:React.FC<PageProps>  = () => (
    // Une page vide pour démarrer
    <Dashboard name="Biodiversité" debug>
        <Palette steps={['#d90019','#f07508','#336666','#3366ff',]}/>
        <Control>
            <Select name="Filtre" options={['A','B','C']} />
        </Control>
    </Dashboard>

)