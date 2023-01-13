import { VoiceConnection } from '@discordjs/voice';
import { Client, Collection } from 'discord.js';
import mongoose from 'mongoose';

import { Config } from './config';

export const client = new Client({
    intents: 641,
    presence: {
        status: 'online',
        activities: [
            {
                type: 2,
                name: '#0 • www.waya.one'
            }
        ]
    }
});

mongoose.connect(Config.mongo)
    .catch((e) => console.log(e));

export const stats = { num: 0 };

export const connections = new Collection<string, VoiceConnection>();
export const isPlaying = new Collection<string, string>();
export const disconnect = new Collection<string, number>();

const names = ['interactions', 'events'];
names.forEach(async (name) => {
    (await import(`./handlers/${name}`)).default(client);
});

client.login(Config.token);