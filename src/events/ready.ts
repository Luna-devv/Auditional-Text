import { ApplicationCommandDataResolvable, Client } from 'discord.js';
import { Client as Dlist } from 'dlist.js';
import { Config } from '../config';

export default {
    name: 'ready',
    once: true,
    run: async (client: Client) => {
        const Interactions: ApplicationCommandDataResolvable[] = [];

        Config.data.interactions.commands.forEach((command) => {
            Interactions.push({
                name: command.name,
                description: command.description,
                options: command.options,
                dm_permission: command.dm_permission,
            });
        });

        client.application?.commands.set(Interactions);
        console.log(`\x1b[37mConnected as ${client.user?.tag}\x1b[0m`);

        if (Config.dlist) {
            const dlist = new Dlist({
                token: Config.dlist,
                bot: client.user?.id || '',
            });

            if (process.platform === 'win32') return;

            dlist.postGuilds(client.guilds.cache.size);
            postStats(client);
            setInterval(() => {
                dlist.postGuilds(client.guilds.cache.size);
                postStats(client);
            }, 10 * 60 * 1000);
        }
    }
};

function postStats(client: Client) {
    Config.listings.forEach(async (listing) => {
        if (!listing.active) return;

        let params = '';
        const body = {};

        if (listing.query) {
            if (listing.structure.guilds) params += `?${listing.structure.guilds}=${client.guilds.cache.size}`;
            if (listing.structure.shards) params += `&${listing.structure.shards}=${client.options.shardCount}`;
        } else {
            if (listing.structure.guilds) body[listing.structure.guilds] = client.guilds.cache.size;
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