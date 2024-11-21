import NodeCache from 'node-cache';

class CacheService {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl = 300) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }
}

export default new CacheService(); 