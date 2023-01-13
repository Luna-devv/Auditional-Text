import { readdirSync } from 'node:fs';
import { Config } from '../config';

export default function () {
    const commands = readdirSync('./dist/interactions/commands/').filter(file => file.endsWith('.js'));

    for (let file of commands) {
        let pull = require(`../interactions/commands/${file}`).default;
        if (pull.name) Config.data.interactions.commands.set(pull.name, pull);
    };
};