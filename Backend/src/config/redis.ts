import { createClient } from 'redis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not defined');
}
const redisClient = createClient({
  url: process.env.REDIS_URL 
  
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});


export default redisClient;