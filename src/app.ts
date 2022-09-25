import { Client } from "discord.js";
import { Config } from "./config";

export const client = new Client({
    intents: 641,
    presence: {
        status: 'online',
        activities: [
            {
                type: 2,
                name: 'waya.one fixed it'
            }
        ]
    }
});

if (!(client as any)._playing) (client as any)._playing = {};
if (!(client as any)._disconnect) (client as any)._disconnect = {};

const names = ['interactions', 'events'];
names.forEach(name => {
    require(`./handlers/${name}`).default(client);
});

export const root = __dirname;
client.login(Config.token)