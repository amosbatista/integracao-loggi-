import { Router } from 'express';

export default ({ config, db }) => {
	let api = Router();
    
  api.all('/', async (req, res, next) => {
  
    api.all('/', async (req, res, next) => {
      const token = req.header("Authorization").replace("Bearer ", '');
      const tokenService = new TokenService();
      const decoded = await tokenService.verify(token);

      const recodedToken = tokenService.sign(userMappingFromDb(decoded));
      res.setHeader("auth-token", recodedToken)
      next();
    });
  });

	return api;
}
