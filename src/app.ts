import { Client } from "discord.js";
import { Config } from "./config";

export const client = new Client({
    intents: 641,
    presence: {
        activities: [
            {
                type: 2,
                name: 'tts @ waya.one'
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
(client as any).path = new String(__dirname);

client.login(Config.token)