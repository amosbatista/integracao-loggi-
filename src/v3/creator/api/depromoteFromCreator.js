import { Router } from 'express'
import UserMapper from '../../auth/db/mappers/save'
import CreatorMapper from '../db/mappers/save'

export default ({ config, db }) => {

	let api = Router();

	api.patch('/', async (req, res) => {
    const STATUS_SERVER_ERROR = 500

    if(!req.query.userId) {
      const message = 'O ID é obrigatório.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const userId = req.query.userId

    const userMapper = new UserMapper();    
    await userMapper.depromoteFromCreator(userId).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });;

    const creatorMaper = new CreatorMapper();
    
    await creatorMaper.disable(userId).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    res.json("Usuário desabilitador de criador.")
    res.end()
  })

	return api;
}
