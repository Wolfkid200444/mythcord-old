import { IClient } from "./structures/bot/IClient";
import "dotenv/config";

const client = new IClient({
    ownerID: ["380307921952833537", "359641658654064641"],
    token: process.env.DISCORD_TOKEN
}, {
    disableMentions: "everyone",
    messageCacheMaxSize: 500,
    messageCacheLifetime: 7500,
    messageSweepInterval: 14000
});

client.buildClient()
    .catch(console.error);