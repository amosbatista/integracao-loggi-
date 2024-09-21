import { Router } from 'express';
import CacheService from './cache.service';
import moment from 'moment';

const cacheMiddleware = () => {
	let api = Router();
    
		api.get('/', async (req: any, res: any, next) => {
      const TIMEOUT_HOURS = 12
      const service = CacheService(moment)
      
      if (req.headers['cache-control'] === 'no-cache') {  
        res.setHeader('cache-control', `no-cache`)
        next();
        return;
      }

      const key = `__request__${req.originalUrl || req.url}`
      const cached = service.get(key);

      res.haveCache = cached ? true : false;
      res.sendNewResp = res.send;      

      let statusCode = res

      res.on('finish', function(info: any) {
        const isResponseCodeAnOK = info.statusCode >= 200 &&
        info.statusCode <= 299;

        if (isResponseCodeAnOK && !res.haveCache) {
          service.set(key, res.lastBody, TIMEOUT_HOURS)
        }
      })

      if (!cached) {
        res.send = (body: any) => {
          res.lastBody = body
          res.sendNewResp(body)
        };

        next();
        return;
      }

      res.setHeader('Cache-Control', `max-age=${cached.ttl}`)
      res.send(cached.stored);
      return;
    });

	return api;
}


export default cacheMiddleware;