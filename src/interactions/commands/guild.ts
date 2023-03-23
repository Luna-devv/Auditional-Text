import { CommandInteractionOptionResolver } from 'discord.js';
import { Config, Emote } from '../../config';
import { Command } from '../../typings';
import { guilds } from '../../structures/guilds';


export default {
    name: 'guild',
    description: 'Setting up your guild, your way, I guess.',
    options: [
        {
            name: 'voice_timeout',
            description: 'How long the bot continues to stay inside your voice channel after /voice.',
            type: 1,
            options: [
                {
                    name: 'time',
                    description: 'Seconds',
                    type: 4,
                    required: true,
                },
            ]
        }
    ],
    dm_permission: false,

    run: async (interaction) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => null);

        if (!interaction.memberPermissions?.has('ManageGuild')) return interaction.editReply({
            content: `${Emote.error} You are missing \`ManageGuild\` permissions.\n${Config.ad}`
        });

        let guild = await guilds.findOne({ guild: interaction.guildId });
        if (!guild) guild = await guilds.create({ guild: interaction.guildId });

        const command = (interaction.options as CommandInteractionOptionResolver).getSubcommand(false);
        switch (command) {
            case 'voice_timeout': {
                guild.voiceTimeout = (interaction.options as CommandInteractionOptionResolver).getInteger('time') ?? 30;

                if (guild.voiceTimeout > 1000 * 60 * 8) return interaction.editReply({
                    content: `${Emote.error} Timeout cannot be above **8 minutes**, contact support.\n${Config.ad}`,
                });

                await guild.save();
                interaction.editReply({
                    content: `${Emote.success} Successfully set timeout to **${guild.voiceTimeout} seconds**.\n${Config.ad}`,
                });

                break;
            }
        }

    }
} as Command;