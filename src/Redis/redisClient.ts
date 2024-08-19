import {createClient} from "redis";
const client = createClient({
    url: "redis://localhost:6379"
});


client.on('connect', () => {
    console.log('Redis Connected Successfully');
});

client.connect().catch(console.error);

export default client;