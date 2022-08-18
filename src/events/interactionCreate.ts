import { ButtonInteraction, Client, CommandInteraction, ContextMenuCommandInteraction } from 'discord.js'

import { Config } from '../config';
import { Command } from '../typings';

export default {
    name: 'interactionCreate',
    run: async (interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction) => {
        const client: Client = interaction.client;
        if (!client.isReady()) return;

        if (interaction.isChatInputCommand()) {
            const command: Command | undefined = await Config.data.interactions.commands.get(interaction.commandName);
            command?.run(client, interaction)
        };
    }
};