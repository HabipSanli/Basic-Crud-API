import { createClient } from "redis";
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

async function connectToRedisDatabase() {
    await client.connect();
}
connectToRedisDatabase();

export async function addValue(key : string, value : string) {
    const a = await client.set(key, value);
    return;
}

export async function getValueByKey(key : string) {
    const value = await client.get(key);
    return value;
}