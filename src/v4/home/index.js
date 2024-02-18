import { Router } from 'express'
import { STATUS_SERVER_ERROR } from '../../shared/statusCodes.const';
import featuredService from './featured.service';
import topService from './top.service';


export default ({ config, db }) => {

	let api = Router();

	api.get('/', async (req, res) => {

    const featured = await featuredService().catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });

    const top = await topService().catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });

    res.json({
      featured,
      top
    })
    
  });

	return api;
}