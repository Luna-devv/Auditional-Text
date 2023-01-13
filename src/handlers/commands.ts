import { readdirSync } from 'node:fs';
import { Config, Emote } from '../config';

export default async function () {
    const commands = readdirSync('./dist/commands/').filter((file) => file.endsWith('.js'));

    for (const file of commands) {
        const pull = (await import(`../commands/${file}`)).default;
        if (pull.name) Config.data.commands.set(pull.name, pull);
    }
}