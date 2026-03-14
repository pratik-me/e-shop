import Redis from "ioredis"

const redis = new Redis("rediss://default:Abb1AAIncDIxZTkwY2JiMzQ2ZTQ0MDViYjU3YzZhY2IzMjQyYWU3OHAyNDY4Mzc@enabled-asp-46837.upstash.io:6379");

redis.on('error', (err) => {
    console.error("Redis Client Error:", err);  
})

export default redis;