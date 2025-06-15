import { connections, disconnect, isPlaying } from '../../app';
import { Config, Emote } from '../../config';
import { Command } from '../../typings';

export default {
    name: 'stop',
    description: 'Stop voice chat playing or just get it unstuck.',
    dm_permission: false,

    run: async (interaction) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => null);

        if (!connections.get(interaction.guildId!)) {
            void interaction.editReply({
                content: `${Emote.error} I'm not connected to any Voice Channels right now.\n${Config.ad}`,
            });

            return;
        }

        if (!interaction.memberPermissions?.has('MuteMembers')) {
            void interaction.editReply({
                content: `${Emote.error} You're missing \`MuteMembers\` permissions.\n${Config.ad}`,
            });

            return;
        }

        try {
            connections.get(interaction.guildId!)?.disconnect();

            isPlaying.delete(interaction.guildId!);
            connections.delete(interaction.guildId!);
            disconnect.delete(interaction.guildId!);
        } catch (e) {
            console.log(e);
        }

        interaction.editReply({
            content: `${Emote.success} I did it, and I am proud of it.\n${Config.ad}`,
        });
    }
} as Command;