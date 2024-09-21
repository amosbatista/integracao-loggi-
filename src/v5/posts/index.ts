import { Router } from 'express'
import { STATUS_SERVER_ERROR, STATUS_REQUEST_ERROR } from '../../shared/statusCodes.const';
import service from './postBySlug.service';


const postsApi = () => {

	let api = Router();

	api.get('/', async (req, res) => {

    if (!req.query.slug) {
      res.status(STATUS_REQUEST_ERROR).json('O código do post é obrigatório');
      res.end();

      return;
    }
    await service(req.query.slug).then((posts) => {
      res.json(posts);
      
    }).catch(err => {
      res.status(STATUS_SERVER_ERROR).json(err);
    }).finally(() => {
      res.end()
    });    
    
  });

	return api;
}

export default postsApi;