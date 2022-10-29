import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { Client, CommandInteraction, GuildMember } from "discord.js";

import { Config } from '../../config';


export default {
    name: 'stop',
    run: async (client: Client, interaction: CommandInteraction) => {

        if (!interaction.guildId) return interaction.reply({
            content: '> <:dnd_status:949003440091201587> This command can only be used inside of a server.',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            label: 'Learn about Waya',
                            url: `https://waya.one`,
                            emoji: '<a:c_prideblob:932368100832202783>'
                        },
                        {
                            type: 2,
                            style: 5,
                            label: 'Invite Auditional Text',
                            url: 'https://discord.com/api/oauth2/authorize?client_id=985213199248924722&permissions=3197952&scope=bot%20applications.commands',
                            emoji: '<:icons_audioenable:875395222291513354>'
                        },
                        {
                            type: 2,
                            style: 5,
                            label: 'TikTok',
                            url: 'https://lunish.nl/tiktok-01',
                            emoji: '<:Icons_tiktok:941672576449654804>'
                        }
                    ]
                }
            ],
            ephemeral: true
        });

        if (!(client as any)._playing[interaction.guild?.id || '']) return interaction.reply({
            content: `> <:dnd_status:949003440091201587> I\'m not playing anything right now.\n${Config.ad}`,
            ephemeral: true
        });

        if (!interaction.memberPermissions?.has('MuteMembers')) return interaction.reply({
            content: `> <:dnd_status:949003440091201587> You\'re missing \`MuteMembers\` permissions.\n${Config.ad}`,
            ephemeral: true
        });

        delete (client as any)._playing[interaction.guild?.id || ''];
        (client as any)._connection[interaction.guildId || ''].disconnect();
        delete (client as any)._connection[interaction.guildId || ''];

        interaction.reply({
            content: `> <:online_status:949003338186383491> I did it, and I am proud of it.\n${Config.ad}`,
            ephemeral: true
        });

    }
};