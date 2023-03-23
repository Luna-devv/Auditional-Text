import { readdirSync } from 'node:fs';
import { Client } from 'discord.js';
import path from 'node:path';

import { Event } from '../typings';

export default async function (client: Client) {
    const eventFiles = readdirSync(`${process.cwd()}/dist/events`).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event: Event = (await import(`${process.cwd()}/dist/events/${file}`)).default;
        const argumentsFunction = (...args: unknown[]) => event.run(...args);

        event.once ? client.once(event.name, argumentsFunction) : client.on(event.name, argumentsFunction);
    }
}