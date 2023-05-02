import { Router } from 'express'
import AuthMapper from '../db/mappers/auth';
import hash from '../cripto/pwdHashHelper';
import Token from '../cripto/JWTTokenService';
import userMappingFromDb from '../db/mappers/modelHelper';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const login = {
      email: req.body.email,
      pwd: req.body.pwd,
    }

    if(!login.email) {
      const message = 'O e-mail é obrigatório.'
      console.log(message)
      res.status(STATUS_UNAUTHORIZED).json(message)
      res.end()
      throw new Error(message)
    }

    if(!login.pwd) {
      const message = 'A senha é obrigatória.'
      console.log(message)
      res.status(STATUS_UNAUTHORIZED).json(message)
      res.end()
      throw new Error(message)
    }

    const authMapper = new AuthMapper();
    const users = await authMapper.auth(
      login.email,
      hash(login.pwd)
    ).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });
    
    if(users.length <= 0 ) {
      res.status(STATUS_UNAUTHORIZED).json("Login ou senha incorretos.")
      res.end()
      throw new Error("Login ou senha incorretos.")
    }
    else {
      const tokenService = new Token();
      const ONLY_FIRST_USER = 0;

      res.json({
        token: tokenService.sign (
          userMappingFromDb(users[ONLY_FIRST_USER])
        ),
        user: {
          name: users[ONLY_FIRST_USER].name,
        },
      })
      res.end()
    }
  })

	return api;
}
