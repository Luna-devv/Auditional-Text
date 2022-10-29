import { Client } from "discord.js";
import { Config } from "./config";
import mongoose from 'mongoose';

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

mongoose.connect(Config.mongo)
    .catch(e => console.log(e));

if (!(client as any)._playing) (client as any)._playing = {};
if (!(client as any)._disconnect) (client as any)._disconnect = {};
if (!(client as any)._connection) (client as any)._connection = {};

const names = ['interactions', 'events'];
names.forEach(name => {
    require(`./handlers/${name}`).default(client);
});

export const root = __dirname;
client.login(Config.token)