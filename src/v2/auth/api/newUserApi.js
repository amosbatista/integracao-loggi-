import { Router } from 'express'
import NewUserMapper from '../db/mappers/save';
import SearchByEmailMapper from '../db/mappers/searchByEmail';
import hash from '../cripto/pwdHashHelper';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const user = {
      email: req.body.email,
      pwd: req.body.pwd,
      name: req.body.name,
    }

     if(!user.name) {
      const message = 'O nome é obrigatório.'
      console.log(message)
      res.status(STATUS_UNAUTHORIZED).json(message)
      res.end()
      throw new Error(message)
    }

    if(!user.email) {
      const message = 'O e-mail é obrigatório.'
      console.log(message)
      res.status(STATUS_UNAUTHORIZED).json(message)
      res.end()
      throw new Error(message)
    }

    if(!user.pwd) {
      const message = 'A senha é obrigatória.'
      console.log(message)
      res.status(STATUS_UNAUTHORIZED).json(message)
      res.end()
      throw new Error(message)
    }

    const searchByEmailMapper = new SearchByEmailMapper();
    const thisEmailExist = await(searchByEmailMapper.thisEmailExists(user.email)).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    if(thisEmailExist) {
      const message = 'E-mail já cadastrado.'
      console.log(message)
      res.status(STATUS_UNAUTHORIZED).json(message)
      res.end()
      throw new Error(message)
    }

    const newUserMapper = new NewUserMapper();
    await newUserMapper.save({
      name: user.name,
      email: user.email,
      pwd: hash(user.pwd),
    }).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    res.json({
      isProcessOk: true,
    })
    res.end()
  })

	return api;
}
