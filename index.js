const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
/**
 o formato de cada item de projects é o seguinte:
 {
   id:1,
   title:"Titulo do projeto",
   tasks:["Titulo da Tarefa"]
 } 
 */

//middleware que verifica se existe o id informado
function verifyId(req, res, next) {
  const { id } = req.params;
  const projectFound = projects.find(p => p.id == id);

  if (!projectFound) {
    return res.status(400).json({ error: 'Project not found' })
  }

  return next();

}

function countRequest(req, res, next) {
  console.count("Número de vezes que foi feita requisições à esta API")
  next()
}

server.use(countRequest)

//rota que retorna todos os itens da lista
server.get('/projects', (req, res) => {
  return res.json(projects)
})

//rota para alterar um item da lista
server.put('/projects/:id', verifyId, (req, res) => {
  const { title } = req.body
  const { id } = req.params

  const projectsSelected = projects.find(p => p.id == id)
  projectsSelected.title = title
  return res.json(projects)
})

//rota para deletar um item da lista
server.delete('/projects/:id', verifyId, (req, res) => {
  const { id } = req.params
  const projectSelected = projects.findIndex(p => p.id == id)
  projects.splice(projectSelected, 1)
  return res.send()
})

//rota para inserir um novo item na lista de tarefas(tasks) de um projeto
server.post('/projects/:id/tasks', verifyId, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const projectSelected = projects.find(p => p.id == id)
  projectSelected.tasks.push(title)

  return res.json(projectSelected)
})

//rota para cadastrar um novo item na lista, com id, título e tarefa
server.post('/projects', (req, res) => {
  const { id, title } = req.body

  const newProject = { id, title, tasks: [] }

  projects.push(newProject)
  return res.json(projects)
})

server.listen(3000)