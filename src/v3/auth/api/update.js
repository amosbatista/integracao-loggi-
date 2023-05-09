import { Router } from 'express'
import UserMapper from '../db/mappers/save'

export default ({ config, db }) => {

	let api = Router();

	api.patch('/', async (req, res) => {
    const STATUS_SERVER_ERROR = 500

    if(!req.body.id) {
      const message = 'O ID é obrigatório.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    if(!req.body.name) {
      const message = 'O nome é obrigatório.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    if(!req.body.email) {
      const message = 'O Login é obrigatório.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const userMapper = new UserMapper();    
    await userMapper.update(req.body);

    res.json("Usuário atualizado com sucesso.")
    res.end()
  })

	return api;
}
