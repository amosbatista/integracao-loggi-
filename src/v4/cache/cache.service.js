const NodeCache = require( 'node-cache' );
import moment from 'moment';

export default (cacheLib = new NodeCache(), dateLib = moment ) => ({  
  get: (key) => {
    const cached = cacheLib.get(key)

    return cached ? {
      stored: JSON.parse(cached.stored),
      createdAt: cached.createdAt,
      ttl: cached.ttl - (dateLib().diff(dateLib(cached.createdAt), 'seconds')),
    } : 
    null
  },
  set: (key, toStore, hours) => {
    const timeOutInSeconds = hours * 60 * 60;
    const toCache = {
      stored: toStore,
      createdAt: dateLib().format(),
      ttl: timeOutInSeconds
    };
    
    const result = cacheLib.set(
      key, 
      toCache,
      timeOutInSeconds);

    return result ? toCache : null
  }
})