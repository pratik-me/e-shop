import Redis from "ioredis";

const redis = new Redis("rediss://default:AaUdAAIncDExZmYyMzg3MWNhM2E0YTg0YmNiOTBjMTQ0M2M1NGIyZnAxNDIyNjk@artistic-dory-42269.upstash.io:6379");

export default redis;