import { Router } from 'express'

import TokenService from '../../auth/cripto/JWTTokenService';
import LoadCardMapper from '../../cardControl/mapper/load';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    
    const STATUS_SERVER_ERROR = 500;
    const STATUS_UNAUTHORIZED = 401;
    

    const token = req.header("Authorization");
    const tokenService = new TokenService();
    const userFromToken = await tokenService.verify(token).catch((err) => {
      const message = 'Erro de autenticação'
      console.log(message, err)
      res.status(STATUS_UNAUTHORIZED).json(err)
      res.end()

      throw new Error(message)
    });
    
    
    const loadCardMapper = new LoadCardMapper();
    const cardData = await loadCardMapper.load(userFromToken.id).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });
    
    res.json(cardData)
    res.end()
    
  })
  
  return api;
}