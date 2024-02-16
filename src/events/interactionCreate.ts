import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction } from 'discord.js';

import { Config } from '../config';
import { stats } from '../app';

export default {
    name: 'interactionCreate',

    run: async (interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction) => {
        if (!interaction.client.isReady()) return;

        stats.num++;

        if (interaction.isContextMenuCommand() || interaction.isChatInputCommand()) {
            const command = Config.data.interactions.commands.get(interaction.commandName) || Config.data.interactions.context.get(interaction.commandName);
            if (!command && interaction.isRepliable()) return interaction.reply({ content: 'This command does not exist.', ephemeral: true });

            try {
                command?.run(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
};