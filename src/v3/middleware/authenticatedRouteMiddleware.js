import { Router } from 'express';
import TokenService from '../auth/cripto/JWTTokenService';
import userMappingFromDb from '../auth/db/mappers/modelHelper';

export default ({ config, db }) => {
	let api = Router();
    
		api.post('/', async (req, res, next) => {
      const STATUS_UNAUTHORIZED = 401

      const token = req.header("Authorization");
      const tokenService = new TokenService();
      
      const decoded = await tokenService.verify(token).catch((err) => {
        const message = 'Erro de autenticação'
        console.log(message, err)
        res.status(STATUS_UNAUTHORIZED).json(err)
        res.end()

        throw new Error(message)
      });

      const recodedToken = tokenService.sign(userMappingFromDb(decoded));
      res.setHeader("auth-token", recodedToken)
      next();
    });

	return api;
}
