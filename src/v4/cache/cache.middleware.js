import { Router } from 'express';
import CacheService from './cache.service';

export default ({ config, db }) => {
	let api = Router();
    
		api.get('/', async (req, res, next) => {
      const TIMEOUT_HOURS = 12
      const service = CacheService(config.cacheLib)
      
      if (req.headers['cache-control'] === 'no-cache') {  
        res.setHeader('cache-control', `no-cache`)
        next();
        return;
      }

      const key = `__request__${req.originalUrl || req.url}`
      const cached = service.get(key);
      
      const isResponseCodeError = res.statusCode < 200 || res.statusCode > 299;

      if (!cached || isResponseCodeError) {
        res.sendResponse = res.send;
        res.send = (body) => {
          const afterCache = service.set(key, body, TIMEOUT_HOURS)
          res.setHeader('Cache-Control', `max-age=${afterCache.ttl}`)
          
          service.get(key)
          res.sendResponse(afterCache.stored)
        }
        next();

        return;
      }

      res.setHeader('Cache-Control', `max-age=${cached.ttl}`)
      res.send(cached.stored);
      return;
    });

	return api;
}
