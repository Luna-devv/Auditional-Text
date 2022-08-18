import { Client } from 'discord.js';
import { readdirSync } from 'fs';

export default function (client: Client) {
    const eventFiles = readdirSync("./dist/events").filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`).default;
        const argumentsFunction = (...args: any) => event.run(...args);
        event.once ? client.once(event.name, argumentsFunction) : client.on(event.name, argumentsFunction);
    };
};