import { Router } from 'express'

import deliveryCourierPositionService from '../../delivery/clickEntregas/clickEntregasGetCourierInfoService'
//import deliveryCourierPositionService from '../../delivery/clickEntregas/clickEntregasGetCourierInfoServiceMock'
import TokenService from '../../auth/cripto/JWTTokenService';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {

    const STATUS_INVALID_REQUEST = 400
		const STATUS_SERVER_ERROR = 500
		const STATUS_UNAUTHORIZED = 401

    const token = req.header("Authorization");
    const tokenService = new TokenService();
    await tokenService.verify(token).catch((err) => {
      const message = 'Erro de autenticação'
      console.log(message, err)
      res.status(STATUS_UNAUTHORIZED).json(err)
      res.end()

      throw new Error(message)
    });
    
    if(!req.body.deliveryId){
      const message = 'Código do delivery não foi informado'
      console.log(message)
      res.status(STATUS_INVALID_REQUEST).json(message)
      res.end()

      throw new Error(message)
    }
		
    const deliveryId = req.body.deliveryId;
    
    const deliveryData = await deliveryCourierPositionService(deliveryId).catch( err => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    })

    
    
    res.json(deliveryData)
    res.end()
  })

	return api;
}
