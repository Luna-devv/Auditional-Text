import { ApplicationCommandDataResolvable, Client } from 'discord.js';
import { Client as Dlist } from 'dlist.js';

import { Config } from '../config';

export default {
    name: 'ready',
    once: true,
    run: async (client: Client) => {
        const Interactions: ApplicationCommandDataResolvable[] = [];

        client.user?.setPresence({
            status: 'online',
            activities: [
                {
                    type: 4,
                    name: '<a:emoji_174:948133729535135744>',
                    state: `#${client.shard?.ids[0]} • wamellow.com`
                }
            ]
        });

        Config.data.interactions.commands.forEach((command) => {
            Interactions.push({
                name: command.name,
                description: command.description,
                options: command.options,
                dm_permission: command.dm_permission,
            });
        });

        client.application?.commands.set(Interactions);

        if (process.platform === 'win32' || client.shard?.ids[0] !== 0) return;

        const dlist = new Dlist({
            token: Config.dlist,
            bot: client.user?.id || '',
        });

        const guildCount = (await client.shard?.fetchClientValues('guilds.cache.size') as unknown as number[]).reduce((prev: number, val: number) => prev + val, 0);

        dlist.postGuilds(guildCount);
        postStats(client, guildCount);

        setInterval(async () => {
            const guildCount = (await client.shard?.fetchClientValues('guilds.cache.size') as unknown as number[]).reduce((prev: number, val: number) => prev + val, 0);
            dlist.postGuilds(guildCount);
            postStats(client, guildCount);
        }, 10 * 60 * 1000);
    }
};

function postStats(client: Client, guildCount: number) {
    Config.listings.forEach(async (listing) => {
        if (!listing.active) return;

        let params = '';
        const body = {};

        if (listing.query) {
            if (listing.structure.guilds) params += `?${listing.structure.guilds}=${guildCount}`;
            if (listing.structure.shards) params += `&${listing.structure.shards}=${client.options.shardCount}`;
        } else {
            if (listing.structure.guilds) body[listing.structure.guilds] = guildCount;
            if (listing.structure.shards) body[listing.structure.shards] = client.options.shardCount;
        }

        fetch(`${listing.url}${params}`, {
            method: listing.method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: listing.authorization
            },
            body: body ? JSON.stringify(body) : undefined
        }).catch((error) => {
            if (!error.message?.includes('520')) console.log(listing.url.split('//')[1].split('/')[0], error);
        });
    });
}