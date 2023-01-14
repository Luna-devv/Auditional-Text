import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction } from 'discord.js';
import { Command } from '../typings';
import { Config } from '../config';
import { stats } from '../app';
import ms from 'ms';

export default {
    name: 'interactionCreate',
    run: async (interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction) => {
        if (!interaction.client.isReady()) return;

        stats.num++;
        console.log(`\x1b[2m\x1b[43m\x1b[37m\x1b[1m\x1b[37m${new Date().toISOString().replace('T', ' ').replace('Z', '')}:\x1b[0m \x1b[33m\x1b[1m${stats.num} :: ${ms(interaction.client.uptime ?? 0)}\x1b[0m`);

        if (interaction.isChatInputCommand()) {
            const command: Command | undefined = await Config.data.interactions.commands.get(interaction.commandName);

            if (command) command?.run(interaction);
            else interaction.reply({ content: 'This command does not exist.', ephemeral: true });
        }
    }
};