import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { 
  Grid,
  Button,
  TextField, 
  Tab, 
  Tooltip, 
  CircularProgress,
} from '@mui/material'
import { TabPanel, TabList, TabContext } from '@mui/lab'
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'

import './App.css'

function App() {

  const [ abaAtual, setAbaAtual ] = useState('get-all-jogos')
  const [ linhas, setLinhas ] = useState([])

  const mudarDeAba = (evento, value) => {
    setAbaAtual(value)
  }

  const requisicao = async (metodo, parametros, caminho) => {
    const { data } = await axios({method: metodo, url:`http://localhost:8080${caminho}`, data: parametros})
    setLinhas(data)
  }


  const colunas = [
    { field: 'id', headerName: 'CODIGO', width: 130 },
    { field: 'nome', headerName: 'NOME', width: 130 },
    { field: 'valor', headerName: 'VALOR', width: 130 },
  ]

  // const linhas = [
  //   { id: 1, nome: 'Homem Aranha PS5', valor: 299.99 },
  //   { id: 2, nome: 'Uncharted PS4', valor: 99.99 },
  // ]  

  const endpoints = [
    {
      title: 'Pegar Todos os Jogos',
      method: 'GET',
      params: [],
      returnType: 'Retorna uma lista de objetos de Jogos e seus campos',
      path: '/api/jogos',
      value: 'get-all-jogos'
    },
    {
      title: 'Pegar Jogo pelo Id',
      method: 'GET',
      params: [
        { 
          name:'id', 
          type: 'Path', 
          valueType: 'number', 
          required: true,
          obs: 'Para pegar um jogo, deve-se preencher o id'
        },
      ],
      returnType: 'Retorna um único objeto de Jogo e seus campos',
      path: '/api/jogos/id',
      value: 'get-jogo-by-id'
    },
    {
      title: 'Cadastrar um Jogo',
      method: 'POST',
      params: [
        { 
          name:'nome', 
          type: 'Body', 
          valueType: 'string', 
          required: true,
          obs: 'Nome do Jogo'
        },
        { 
          name:'valor', 
          type: 'Body', 
          valueType: 'number', 
          required: true,
          obs: 'Valor do Jogo'
        },
      ],
      returnType: 'Retorna uma lista de objetos de Jogos e seus campos',
      path: '/api/jogos',
      value: 'create-jogo'
    },
  ]

  return (
    <div className='App'>
     <Grid>
      <TabContext value={abaAtual}>
        <TabList onChange={mudarDeAba}>
          {endpoints.map((endpoint, index) =>
            <Tab 
              key={index}
              style={{ outline: 'none' }} 
              label={endpoint.title} 
              value={endpoint.value}
            >
            </Tab>
          )}
          
        </TabList>
        <TabPanel value={abaAtual}>
          {endpoints.map((endpoint, index) => {
            if(abaAtual === endpoint.value) {
              return(
                <Grid key={index}>
                  <h2>Título: {endpoint.title}</h2>
                  <h3>Método: {endpoint.method}</h3>
                  <Button 
                    style={{
                      outline: 'none',
                      fontWeight: 'bold'
                    }}
                    variant='contained'
                    onClick={async () => await requisicao('GET',null,'/api/jogos')}
                  >
                    Enviar Requisição
                  </Button>
                </Grid>
              )
            }
          })}
          </TabPanel>
      </TabContext>
      <DataGrid
        style={{ height: 400, width: '100%' }}
        rows={linhas}
        columns={colunas}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
     </Grid>
    </div>
  )
}

export default App
