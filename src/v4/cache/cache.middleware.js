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

      res.haveCache = cached ? true : false;
      res.sendNewResp = res.send;      

      res.on('finish', function() {
        const isResponseCodeAnOK = this.statusCode >= 200 &&
        this.statusCode <= 299;

        if (isResponseCodeAnOK && !res.haveCache) {
          service.set(key, res.lastBody, TIMEOUT_HOURS)
        }
      })

      if (!cached) {
        res.send = (body) => {
          res.lastBody = body
          res.sendNewResp(body)
        };

        next();
        return;
      }

      res.setHeader('Cache-Control', `max-age=${cached.ttl}`)
      res.setHeader('Last-Status', `${cached.lastRequestCode}`)
      res.send(cached.stored);
      return;
    });

	return api;
}
