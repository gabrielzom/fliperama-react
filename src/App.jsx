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
  const [ camposParams, setCamposParams ] = useState({ id: '', nome: '', valor: '' })

  const mudarDeAba = (evento, value) => {
    setAbaAtual(value)
    setCamposParams({ id: '', nome: '', valor: '' })
  }

  const requisicao = async (
    metodo, 
    parametros, 
    caminho, 
    valoresParametros
  ) => {
    let corpo = {}
    parametros.forEach(parametro => {
      if (parametro.type === 'Path') caminho = caminho.replace(parametro.name, valoresParametros[parametro.name])
      if (parametro.type === 'Body') corpo[parametro.name] = valoresParametros[parametro.name]
    })
    const resposta = await axios({method: metodo, url:`http://localhost:8080${caminho}`, data: corpo})

    let jogos = []
    if(resposta.data.length > 0) {
      jogos = resposta.data.map(jogo => {
        return {
          id: jogo.id,
          codigo: jogo.id,
          nome: jogo.nome,
          valor: jogo.valor
        }
      }) 
      setLinhas(jogos)

    } else if (resposta.data.id) {
      jogos[0] = {
        id: resposta.data.id,
        codigo: resposta.data.id,
        nome: resposta.data.nome,
        valor: resposta.data.valor
      }
      setLinhas(jogos)

    } else if (resposta.data.deleted) {
      alert('Jogo deletado com sucesso!')
    }

  }

  const colunas = [
    { field: 'codigo', headerName: 'CODIGO', width: 130 },
    { field: 'nome', headerName: 'NOME', width: 130 },
    { field: 'valor', headerName: 'VALOR', width: 130 },
  ]

  const endpoints = [
    {
      title: 'Pegar Todos os Jogos',
      method: 'GET',
      params: [],
      returnType: 'Retorna uma lista de objetos de Jogos.',
      path: '/api/jogos',
      value: 'get-all-jogos',
      color: 'blue'
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
      returnType: 'Retorna um único objeto de Jogo.',
      path: '/api/jogos/id',
      value: 'get-jogo-by-id',
      color: 'blue'
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
          obs: 'Título completo do Jogo'
        },
        { 
          name:'valor', 
          type: 'Body', 
          valueType: 'number', 
          required: true,
          obs: 'Valor em reais do Jogo'
        },
      ],
      returnType: 'Retorna o novo objeto de Jogo cadastrado.',
      path: '/api/jogos',
      value: 'create-jogo',
      color: 'green'
    },
    {
      title: 'Alterar um Jogo',
      method: 'PUT',
      params: [
        { 
          name:'nome', 
          type: 'Body', 
          valueType: 'string', 
          required: true,
          obs: 'Novo título completo do Jogo'
        },
        { 
          name:'valor', 
          type: 'Body', 
          valueType: 'number', 
          required: true,
          obs: 'Novo valor em reais do Jogo'
        },
        { 
          name:'id', 
          type: 'Path', 
          valueType: 'number', 
          required: true,
          obs: 'Id do Jogo que irá receber novos dados'
        },
      ],
      returnType: 'Retorna o objeto de Jogo com os novos dados.',
      path: '/api/jogos/id',
      value: 'update-jogo',
      color: 'orange'
    },
    {
      title: 'Deletar Jogo pelo Id',
      method: 'DELETE',
      params: [
        { 
          name:'id', 
          type: 'Path', 
          valueType: 'number', 
          required: true,
          obs: 'Para deletar um jogo, deve-se preencher o id'
        },
      ],
      returnType: 'Retorna um booleano informando se o Jogo foi deletado.',
      path: '/api/jogos/id',
      value: 'delete-jogo-by-id',
      color: 'red'
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
                <Grid style={{ textAlign: 'left', color: endpoint.color }} key={index}>
                  <h2>Título: {endpoint.title}</h2>
                  <h3>Método: {endpoint.method}</h3>
                  <h3>Objetivo: {endpoint.returnType}</h3>
                  <h3>Caminho do endpoint: {endpoint.path}</h3>
                  <h3>Parametros:</h3>
                  <ul>
                    {endpoint.params.map((param, index) =>
                      <Grid className='params' style={{ color: 'black', borderColor: endpoint.color }} key={index}>
                        <li><strong>Nome:</strong> {param.name}</li>
                        <li><strong>Tipo do parâmetro:</strong>{param.type}</li>
                        <li><strong>Tipo de valor:</strong>{param.valueType}</li>
                        <li><strong>Obrigatório:</strong>{param.required ? 'SIM' : 'NÃO'}</li>
                        <li><strong>Observação:</strong> {param.obs}</li>
                        <TextField
                          style={{ marginBottom: '3rem' }}
                          onKeyUp={evento => {
                            setCamposParams({...camposParams, [param.name]: evento.target.value})}
                          } 
                          label={param.name} 
                          variant='filled' 
                        />
                      </Grid>
                    )}
                  </ul>
                  <Button 
                    style={{
                      outline: 'none',
                      fontWeight: 'bold'
                    }}
                    variant='contained'
                    onClick={async () => {
                      await requisicao(endpoint.method, endpoint.params, endpoint.path, camposParams)
                    }}
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
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
     </Grid>
    </div>
  )
}

export default App
