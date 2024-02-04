import { Router } from 'express'
import { STATUS_SERVER_ERROR } from '../../shared/statusCodes.const';
import service from './featured.service';


export default ({ config, db }) => {

	let api = Router();

	api.get('/', async (req, res) => {

    await service().then((posts) => {
      res.json(posts);
      
    }).catch(err => {
      res.statusCode(STATUS_SERVER_ERROR).json(err);
    }).finally(() => {
      res.end()
    });    
    
  });

	return api;
}