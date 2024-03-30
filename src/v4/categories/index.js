import { Router } from 'express'
import { STATUS_SERVER_ERROR } from '../../shared/statusCodes.const';
import categoryVirtudeService from './categories-virtude'
import categoryCristianismosService from './category-cristianismos'
import categoryBrujeriaService from './category-brujeria'
import { MAIN_CONTEXTS } from '../navigation/contextsByTag.const';


export default ({ config, db }) => {

	let api = Router();

	api.get('/', async (req, res) => {

    const CATEGORIES_LIMIT = 100;

    let content = undefined;
    const defaultRequest = undefined;

    switch(req.query.category) {

      case MAIN_CONTEXTS.VIRTUDE: {
        content = await categoryVirtudeService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
          res.statusCode =  STATUS_SERVER_ERROR
          res.json(err);
          res.end();
    
          throw err;
        });
        break;
      }
      case MAIN_CONTEXTS.BRUJERIA: {
        content = await await categoryBrujeriaService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
          res.statusCode =  STATUS_SERVER_ERROR
          res.json(err);
          res.end();
    
          throw err;
        });
        break;
      }
      case MAIN_CONTEXTS.CRISTIANISMOS: {
        content = await categoryCristianismosService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
          res.statusCode =  STATUS_SERVER_ERROR
          res.json(err);
          res.end();
    
          throw err;
        });
        break;
      }
    }

    res.json(content);
    
  });

	return api;
}