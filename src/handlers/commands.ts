import { readdirSync } from 'fs';
import { Config } from '../config';

export default function () {
    const commands = readdirSync('./dist/commands/').filter(file => file.endsWith('.js'));

    for (let file of commands) {
        let pull = require(`../commands/${file}`).default;
        if (pull.name) Config.data.commands.set(pull.name, pull);
    };
};