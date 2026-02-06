
import { SimpleRecord } from "@geo2france/api-dashboard"
import  {Transform, Dashboard, Dataset, Filter, 
  Producer, Control, useControl, Select, ChartYearSerie, Debug, Join, 
  ChartComparison} from "@geo2france/api-dashboard/dsl"



export const MaPremierePage = () => (
  <Dashboard name="Premiere page de test">
    <Debug />
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
      <Transform>
        {(data) => data.map((row: SimpleRecord) => ({ pouette: 4, ...row }))}
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
        dataset="dma_collecte_traitement"
        joinType="inner"
        joinKey={["departement_code", "C_DEPT"]}
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

    <ChartYearSerie
      title="Capacite isdnd"
      dataset="capacite_isdnd"
      yearKey="annee"
      valueKey="capacite"
      categoryKey="code_departement"
      type="bar"
      yearMark={useControl("annee")}
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
      nameKey="dep"
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
  </Dashboard>
);