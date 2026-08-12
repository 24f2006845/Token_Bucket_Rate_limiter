import { RateLimiter } from "./limiter.js";

const limiter = new RateLimiter({
  apiKey: "167722da589c541229799817fa89ae975e4348ee2522e7db58e072a79d50be03"
});

const result = await limiter.configure([
  {
    name: "login",
    capacity: 3,
    refillRate: 1,
    interval: 60
  }
]);

// const result = await limiter.limiter("login");
console.log("SYNC RESULT:", result);

const limiterCheckResult = await limiter.limiter("login");

console.log("LIMITER CHECK RESULT:", limiterCheckResult);