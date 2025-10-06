import { Router } from 'express';
import CacheService from './cache.service';
import moment from 'moment';

const cacheMiddleware = () => {
	let api = Router();
  const NO_CACHE = 'no-cache';
    
		api.get('/', async (req: any, res: any, next) => {
      const TIMEOUT_HOURS = 12
      let service = undefined

      try {
        service = CacheService(undefined, moment)
      }
      catch(cacheErr) {
        res.setHeader('cache-control', NO_CACHE)
        res.setHeader('cache-error', `${JSON.stringify(cacheErr)}`)
        next();
        return;
      }
      
      if (req.headers['cache-control'] === NO_CACHE) {  
        res.setHeader('cache-control', NO_CACHE)
        next();
        return;
      }
      const key = `__request__${req.originalUrl || req.url}`

      let cached = undefined;

      if(shouldClearCache(req.headers)) {
          await service.clear(key);
        }
      else {
        cached = await service.get(key);
      }
      res.haveCache = cached ? true : false;
      res.sendNewResp = res.send;      

      res.on('finish', function() {
        const isResponseCodeAnOK = res.statusCode >= 200 &&
        res.statusCode <= 299;

        if (isResponseCodeAnOK && !res.haveCache) {
          service.set(key, res.lastBody, TIMEOUT_HOURS)
        }
      })

      if (!cached) {
        if(shouldClearCache(req.headers)) { 
          res.setHeader('Cache-Control', `cleared`)    
          res.setHeader('is-cache-cleared', `true`)    
        }

        res.send = (body: any) => {
          res.lastBody = body
          res.sendNewResp(body)
        };

        next();
        return;
      }
      else {
        if(req.headers['Clear-Site-Data']) {
          res.setHeader('is-cache-cleared', `false`)
        }
        res.setHeader('Cache-Control', `max-age=${cached.ttl}`)
        res.send(cached.stored);
      }
      
      return;
    });

	return api;
}

const shouldClearCache = (headers: any): boolean  => {
  return headers['Clear-Site-Data'] && headers['Clear-Site-Data'] === process.env.CACHE_CLEAR_KEY
}

export default cacheMiddleware;