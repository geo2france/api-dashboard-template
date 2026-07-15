//Config : theme, route, title, etc..
import { DashboardConfig } from '@geo2france/api-dashboard';
import MyLogo from '/img/logo.svg?url';

export const config:DashboardConfig = {
    // Le theme peux être personnalisé : https://ant.design/docs/react/customize-theme#seedtoken
    title:"Api-dashboard",
    subtitle:"Tableau de bord de demo - Template",
    logo:MyLogo,
    brands: [
         { logo: MyLogo, name:"Geo2France", url:"https://www.geo2france.fr/"},
        ],
    
}