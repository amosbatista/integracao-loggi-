import { Router } from 'express'
import { STATUS_SERVER_ERROR } from '../../shared/statusCodes.const';
import featuredService from './featured.service';
import topService from './top.service';
import highlightsService from './highlights'
import categoryVirtudeService from '../categories/categories-virtude'
import categoryCristianismosService from '../categories/category-cristianismos'
import categoryBrujeriaService from '../categories/category-brujeria'
import cacheMiddleware from '../cache/cache.middleware';


export default ({ config, db }) => {

	let api = Router();
  
  api.use(cacheMiddleware({ config, db }));
	api.get('/', async (req, res) => {

    const CATEGORIES_LIMIT = 3;

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

    const highlights = await highlightsService().catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });

    const defaultRequest = undefined;
    const categoryVirtude = await categoryVirtudeService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });
    const categoryBrujeria = await categoryCristianismosService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });
    const categoryCristianismos = await categoryBrujeriaService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });

    res.json({
      featured,
      top,
      highlights,
      categories: {
        virtude: categoryVirtude,
        brujeria: categoryBrujeria,
        cristianismos: categoryCristianismos,
      }
    })
    
  });

	return api;
}