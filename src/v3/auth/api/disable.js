import { Router } from 'express'
import UserMapper from '../db/mappers/save'

export default ({ config, db }) => {

	let api = Router();

	api.delete('/', async (req, res) => {
    const STATUS_SERVER_ERROR = 500

    if(!req.query.userId) {
      const message = 'O ID é obrigatório.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const userMapper = new UserMapper();    
    await userMapper.disable(req.query.userId);

    res.json("Usuário removido com sucesso.")
    res.end()
  })

	return api;
}
