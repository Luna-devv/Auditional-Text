import { readdirSync } from 'node:fs';

import { Config } from '../config';

export default async function () {
    const commands = readdirSync(`${process.cwd()}/dist/interactions/commands`).filter((file) => file.endsWith('.js'));
    for (const file of commands) {
        const pull = (await import(`${process.cwd()}/dist/interactions/commands/${file}`)).default;
        if (pull.name) Config.data.interactions.commands.set(pull.name, pull);
    }

    const context = readdirSync(`${process.cwd()}/dist/interactions/context`).filter((file) => file.endsWith('.js'));
    for (const file of context) {
        const pull = (await import(`${process.cwd()}/dist/interactions/context/${file}`)).default;
        if (pull.name) Config.data.interactions.context.set(pull.name, pull);
    }
}