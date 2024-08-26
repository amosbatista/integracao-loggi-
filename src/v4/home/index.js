import { Router } from 'express'
import { STATUS_SERVER_ERROR } from '../../shared/statusCodes.const';
import featuredService from './featured.service';
import topService from './top.service';
import highlightsService from './highlights'
import categoryVirtudeService from '../categories/categories-virtude'
import categoryCristianismosService from '../categories/category-cristianismos'
import categoryBrujeriaService from '../categories/category-brujeria'
import cacheMiddleware from '../cache/cache.middleware';
import calendarService from './calendarService';
import aforismosHomeService from '../aforismos/aforismos-list-home.service'
import categoryAutoralService from '../autoral/category.sevice'
import pickAutoralNoThumbService from '../autoral/pick.service'
import pickAutoralTopService from '../autoral/pickTop2.service'

export default ({ config, db }) => {

	let api = Router();
  
  api.use(cacheMiddleware({ config, db }));
	api.get('/', async (req, res) => {

    const CATEGORIES_LIMIT = 3;
    const AFORISMOS_LIMIT = 10;

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
    const categoryCristianismos = await categoryCristianismosService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });
    const categoryBrujeria = await categoryBrujeriaService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });

    const calendarObject = await calendarService();

    const aforismos = await aforismosHomeService(defaultRequest, AFORISMOS_LIMIT).catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });

    const categoryAutoral = await categoryAutoralService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });

    const pickAutoralNoThumb = await pickAutoralNoThumbService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
      res.statusCode =  STATUS_SERVER_ERROR
      res.json(err);
      res.end();

      throw err;
    });

    const pickAutoraTop = await pickAutoralTopService(defaultRequest, CATEGORIES_LIMIT).catch(err => {
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
        autoral: categoryAutoral,
      },
      calendar: calendarObject,
      aforismos,
      pickAutoral: pickAutoralNoThumb,
      pickAutoraTop: pickAutoraTop
    })
    
  });

	return api;
}