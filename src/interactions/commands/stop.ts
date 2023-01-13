import { connections, disconnect, isPlaying } from '../../app';
import { Config } from '../../config';
import { Command } from '../../typings';


export default {
    name: 'stop',
    run: async (client, interaction) => {

        if (!connections.get(interaction.guildId || '')) return interaction.reply({
            content: `> <:dnd_status:949003440091201587> I'm not connected to any Voice Channels right now.\n${Config.ad}`,
            ephemeral: true
        });

        if (!interaction.memberPermissions?.has('MuteMembers')) return interaction.reply({
            content: `> <:dnd_status:949003440091201587> You're missing \`MuteMembers\` permissions.\n${Config.ad}`,
            ephemeral: true
        });

        try {
            connections.get(interaction.guildId || '')?.disconnect();

            isPlaying.delete(interaction.guildId || '');
            connections.delete(interaction.guildId || '');
            disconnect.delete(interaction.guildId || '');
        } catch (e) { console.log(e); }

        interaction.reply({
            content: `> <:online_status:949003338186383491> I did it, and I am proud of it.\n${Config.ad}`,
            ephemeral: true
        });

    }
} as Command;