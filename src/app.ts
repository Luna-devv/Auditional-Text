import { Client, Collection, GatewayIntentBits, Options } from 'discord.js';
import { VoiceConnection } from '@discordjs/voice';
import mongoose from 'mongoose';

import { Config } from './config';

// ------------------------------- load client

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
    presence: {
        status: 'online',
        activities: [
            {
                type: 2,
                name: '#0 • www.waya.one'
            }
        ]
    },
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        AutoModerationRuleManager: 0,
        BaseGuildEmojiManager: 0,
        GuildEmojiManager: 0,
        GuildBanManager: 0,
        GuildForumThreadManager: 0,
        GuildInviteManager: 0,
        GuildScheduledEventManager: 0,
        GuildStickerManager: 0,
        GuildTextThreadManager: 0,
        MessageManager: 0,
        PresenceManager: 0,
        ReactionManager: 0,
        ReactionUserManager: 0,
        StageInstanceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        UserManager: 0,
    }), // yes
});

// ------------------------------- mongoose

mongoose.set('strictQuery', true);
mongoose.connect(Config.mongo).catch((e) => console.log(e));

// ------------------------------- export

export const stats = { num: 0 };

export const connections = new Collection<string, VoiceConnection>();
export const isPlaying = new Collection<string, string>();
export const disconnect = new Collection<string, number>();

// ------------------------------- handlers

const names = ['interactions', 'events'];
names.forEach(async (name) => {
    (await import(`./handlers/${name}`)).default(client);
});

client.login(Config.token);

// ------------------------------- speakers

export const speakers = [
    {
        name: 'EN-us Female',
        value: 'en_us_002'
    },
    {
        name: 'EN-us Male',
        value: 'en_us_006'
    },
    {
        name: 'EN-au Female',
        value: 'en_au_001'
    },
    {
        name: 'EN-au Male',
        value: 'en_au_002'
    },
    {
        name: 'EN-uk Male',
        value: 'en_uk_001'
    },
    {
        name: 'FR-fr Male',
        value: 'fr_001'
    },
    {
        name: 'FR-fr Male 2',
        value: 'fr_002'
    },
    {
        name: 'DE-de Female',
        value: 'de_001'
    },
    {
        name: 'DE-de Male',
        value: 'de_002'
    },
    {
        name: 'JP-jp Female',
        value: 'jp_001'
    },
    {
        name: 'JP-jp Female 2',
        value: 'jp_003'
    },
    {
        name: 'ES-es Male',
        value: 'es_002'
    },
    {
        name: 'EN-us Ghostface',
        value: 'en_us_ghostface'
    },
    {
        name: 'EN-us Chewbacca',
        value: 'en_us_chewbacca'
    },
    {
        name: 'EN-us c3po',
        value: 'en_us_c3po'
    },
    {
        name: 'EN-us Stitch',
        value: 'en_us_stitch'
    },
    {
        name: 'EN-us Stormtropper',
        value: 'en_us_stormtrooper'
    },
    {
        name: 'EN-us Rocket',
        value: 'en_us_rocket'
    }
];

// ------------------------------- process

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});