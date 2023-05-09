import { Router } from 'express'
import UserMapper from '../db/mappers/save'
import hash from '../cripto/pwdHashHelper';

export default ({ config, db }) => {

	let api = Router();

	api.patch('/', async (req, res) => {
    const STATUS_SERVER_ERROR = 500

    if(!req.body.pwd) {
      const message = 'A nova senha é obrigatória.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    if(!req.body.id) {
      const message = 'O ID é obrigatório.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const userMapper = new UserMapper();    
    await userMapper.updatePwd({
      id: req.body.id,
      pwd: hash(req.body.pwd),
    });

    res.json("Senha alterada com sucesso.")
    res.end()
  })

	return api;
}
