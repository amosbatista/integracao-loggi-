import moment from 'moment';
import Redis from 'ioredis'

export default (cacheLib = new Redis({
  port: 6379,          // Redis port
  host: 'server.sunday6pm.net',   // Redis host
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  password: '',
  db: 0,
  connectTimeout: 2000
}), dateLib = moment ) => ({  
  get: async (key: string) => {
    const cachedPure = await cacheLib.get(key)

    if (!cachedPure) {
      return null
    }

    const cached = JSON.parse(cachedPure)

    const ttl = cached.ttl - (dateLib().diff(dateLib(cached.createdAt), 'seconds'));

    if(ttl <= 0) {
      await cacheLib.del(key)
    }
    return cached ? {
      stored: JSON.parse(cached.stored),
      createdAt: cached.createdAt,
      ttl
    } : 
    null
  },
  clear: async (key: string) => {
    await cacheLib.del(key)
  },
  set: async (key: string, toStore: string, hours: number) => {
    const timeOutInSeconds = hours * 60 * 60;
    const toCache = {
      stored: toStore,
      createdAt: dateLib().format(),
      ttl: timeOutInSeconds
    };
    
    const result = await cacheLib.set(
      key, 
      JSON.stringify(toCache));

    return result ? toCache : null
  }
})