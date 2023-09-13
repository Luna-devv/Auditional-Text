import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction } from 'discord.js';

import { Command } from '../typings';
import { Config } from '../config';
import { stats } from '../app';

export default {
    name: 'interactionCreate',
    run: async (interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction) => {
        if (!interaction.client.isReady()) return;

        stats.num++;

        if (interaction.isChatInputCommand()) {
            const command: Command | undefined = Config.data.interactions.commands.get(interaction.commandName);

            if (command) command?.run(interaction).catch(() => null);
            else interaction.reply({ content: 'This command does not exist.', ephemeral: true });
        }
    }
};
