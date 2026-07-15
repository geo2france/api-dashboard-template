
import { PageProps, SimpleRecord } from "@geo2france/api-dashboard"
import  {Transform, Dashboard, Dataset, Filter, 
  Producer, Control, useControl, Select, ChartYearSerie, Debug, Join, 
  ChartComparison,
  ChartEvolution,
  StatisticsCollection,
  Statistics} from "@geo2france/api-dashboard/dsl"



export const MaPremierePage:React.FC<PageProps> = () => (
  <Dashboard name="Premiere page de test">
    <Debug />

    <Dataset 
      id="referentiel_departements"
      type="wfs"
      url="https://www.geo2france.fr/geoserver/spld/ows"
      resource="spld:DEPARTEMENT"
      meta={{ properties:['NOM_DEP','INSEE_DEP']}}
    />

    <Dataset
      id="dma_collecte_traitement"
      resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
      url="https://data.ademe.fr/data-fair/api/v1/datasets"
      type="datafair"
      pageSize={5000}
    >
      <Filter field="L_REGION">Hauts-de-France</Filter>
      <Filter field="L_TYP_REG_DECHET" operator="ne">
        Encombrants
      </Filter>
      <Filter field="ANNEE">{useControl("annee")}</Filter>
      <Transform>
        SELECT [L_TYP_REG_DECHET], [ANNEE], [C_DEPT], SUM([TONNAGE_DMA]) as
        [TONNAGE_DMA] FROM ? GROUP BY [ANNEE], [C_DEPT], [L_TYP_REG_DECHET]
      </Transform>
      <Producer url="https://www.sinoe.org">Ademe</Producer>
      <Producer url="https://odema-hautsdefrance.org/">Odema</Producer>
    </Dataset>

    {/* Référentiel des EPCI, il sera utilisé en jointure avec d'autres données */}
    <Dataset
      id="ref_epci_odema"
      resource="odema:territoire_epci"
      url="https://www.geo2france.fr/geoserver/ows"
      type="wfs"
      pageSize={1000}
      meta={{
        properties: ["annee", "name", "name_short", "c_acteur_sinoe", "siren"],
      }}
    >
      <Filter field="annee">{useControl("annee")}</Filter>{" "}
      {/* On ne charge que les données de l'année choisie par l'utilisateur */}
      <Filter field="name" operator="contains">
        Commun
      </Filter>
    </Dataset>

    {/* QGIS server Région - pour test QGIS server  */}
    <Dataset
      id="scot"
      resource="scot_en_cours"
      url="https://qgisserver.hautsdefrance.fr/cgi-bin/qgis_mapserv.fcgi?MAP=/var/www/data/qgis/applications/limites_admin.qgz"
      type="wfs"
      pageSize={50}
    >
      <Producer url="https://www.geo2france.fr/datahub/dataset/ee965118-2416-4d48-b07e-bbc696f002c2">
        Région Hauts-de-France
      </Producer>
    </Dataset>

    <Dataset
      id="dechetterie_nb_par_dep"
      resource="odema:dechetterie"
      url="https://www.geo2france.fr/geoserver/ows"
      type="wfs"
      pageSize={1000}
    >
      <Transform>
        SELECT departement_nom as dep, departement_code, count(*) as nb FROM ?
        GROUP BY departement_nom, departement_code
      </Transform>
      <Join
        dataset="referentiel_departements"
        joinType="inner"
        joinKey={["departement_code", "INSEE_DEP"]}
      />
      <Producer url="https://odema-hautsdefrance.org/">Odema</Producer>
    </Dataset>

    <Dataset
      id="capacite_isdnd"
      resource="odema:capacite_isdnd"
      url="https://www.geo2france.fr/geoserver/ows"
      type="wfs"
      pageSize={2000}
    >
      <Producer url="https://odema-hautsdefrance.org/">Odema</Producer>
    </Dataset>

    <Control>
      <Select
        name="annee"
        label="Année"
        options={["2017", "2019", "2021"]}
        initial_value="2019"
        arrows={true}
      />
    </Control>


    <ChartEvolution
      title="Capacite isdnd"
      dataset="capacite_isdnd"
      timeKey="annee"
      valueKey="capacite"
      nameKey="code_departement"
      chartType="area"
      option={{xAxis:{max:'2030'}}}
      timeMarker={useControl('annee')}
      //stack={true}
      //yearMark={useControl("annee")}
    />

    <ChartComparison
      title="Tonnage de déchet"
      dataset="dma_collecte_traitement"
      nameKey="L_TYP_REG_DECHET"
      valueKey="TONNAGE_DMA"
      unit="t"
      chartType="donut"
    />
    <ChartComparison
      title="Nombre de déchetterie par département"
      dataset="dechetterie_nb_par_dep"
      nameKey="NOM_DEP"
      valueKey="nb"
      chartType="pie"
      label="value"
      option={{legend:{show:true, left:"2%", top:"2%", orient:"vertical"}}}
    />

    {/*<Palette steps={['#95c11f','#ed1c24','#0f4496']} />*/}

    <ChartComparison
      title="Population couverte par un SCOT"
      dataset="scot"
      nameKey="proc_cours"
      valueKey="pop"
      unit="hab"
      label="percent"
      option={{xAxis:{axisLabel:{formatter: (v:number) => `${v/1e3} khab` }}}}
    />


           <Dataset
            id="atlas_cocc"
            type="wfs"
            url="https://www.geo2france.fr/geoserver/picardie_nature/ows"
            resource="picardie_nature:atlas_cocc"
            meta={{properties:['ref_year', 'n_sp']}}
           >
                <Filter operator="gte" field="ref_year">2015-01-01</Filter>
                <Transform>SELECT year([ref_year]) as annee, sum(LEAST([n_sp],1)) as presence FROM ? GROUP BY year([ref_year]) ORDER BY annee ASC</Transform>
                
                <Producer url="https://www.geo2france.fr/datahub/dataset/66865703-8c00-41b9-a7a2-226edd705c7b">Picardie Nature</Producer>
           </Dataset>
    
            <Dataset
            id="atlas_amphibiens"
            type="wfs"
            url="https://www.geo2france.fr/geoserver/picardie_nature/ows"
            resource="picardie_nature:atlas_amphibiens"
            meta={{properties:['ref_year', 'n_sp']}}
           >
                <Filter operator="gte" field="ref_year">2020-01-01</Filter>
                <Transform>SELECT year([ref_year]) as annee, sum(LEAST([n_sp],1)) as presence FROM ? GROUP BY year([ref_year]) ORDER BY annee ASC</Transform>
                
                <Producer url="https://www.geo2france.fr/datahub/dataset/66865703-8c00-41b9-a7a2-226edd705c7b">Picardie Nature</Producer>
           </Dataset>
    
            <ChartYearSerie 
                title="Atlas coccinelles : nombre de maille 10x10 de présence"
                dataset="atlas_cocc"
                yearKey="annee"
                valueKey="presence"
            />
    
            <StatisticsCollection title="Atlas en 2025 - Mailles 10x10km de présence">
                <Statistics dataset="atlas_cocc" dataKey="presence" compareWith="first" color="#d90019" icon="game-icons:ladybug" 
                evolutionSuffix="Depuis 2015" title="Coccinelles"/>
    
                <Statistics dataset="atlas_amphibiens" title="Amphibiens" dataKey="presence" compareWith="first" color="green" icon="fa7-solid:frog" 
                evolutionSuffix="Depuis 2020"/>
    
    
            </StatisticsCollection>
  </Dashboard>
);