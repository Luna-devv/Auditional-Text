import { readdirSync } from 'node:fs';
import { Client } from 'discord.js';
import { Event } from '../typings';
import path from 'node:path';

export default async function (client: Client) {
    const eventFiles = readdirSync(path.join('.', 'dist', 'events')).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event: Event = (await import(`../events/${file}`)).default;
        const argumentsFunction = (...args: unknown[]) => event.run(...args);

        event.once ? client.once(event.name, argumentsFunction) : client.on(event.name, argumentsFunction);
    }
}