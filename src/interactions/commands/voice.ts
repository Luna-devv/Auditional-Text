import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { Client, CommandInteraction, GuildMember } from "discord.js";
import mp3Duration from 'mp3-duration';
import fs from 'node:fs';

import { Config } from '../../config';
import { getData } from '../../getData';
import Users from "../../structures/user";


export default {
    name: 'voice',
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

        if (!interaction.guild?.members.me?.permissionsIn(interaction.channel?.id || '').has(['ViewChannel', 'SendMessages'])) return interaction.reply({
            content: `> <:dnd_status:949003440091201587> I\'m not able to send messages in this channel.\n${Config.ad}`,
            ephemeral: true
        });

        const member: GuildMember | undefined | null = interaction.guild?.members.cache.get(interaction.user.id) || await interaction.guild?.members.fetch(interaction.user.id).catch(() => null);
        if (!member?.voice.channelId) return interaction.reply({
            content: `> <:dnd_status:949003440091201587> You\'re not connexted to any Voice Channels.\n${Config.ad}`,
            ephemeral: true
        });

        if (!interaction.guild?.members.me?.permissionsIn(member.voice.channelId).has(['ViewChannel', 'Connect', 'Speak'])) return interaction.reply({
            content: `> <:dnd_status:949003440091201587> I\'m not able to Connect/Speak in your Voice Channel.\n${Config.ad}`,
            ephemeral: true
        });

        if ((client as any)._playing[interaction.guild?.id || '']) return interaction.reply({
            content: `> <:dnd_status:949003440091201587> Please wait until the current audio by <@${(client as any)._playing[interaction.guild?.id || '']}> is done playing.\n${Config.ad}`,
            ephemeral: true
        });

        await interaction.deferReply();
        //@ts-ignore
        const textInput: string = interaction.options.getString('text');
        //@ts-ignore
        const speaker: string = interaction.options.getString('speaker');
        const user = await Users.findOne({ user: interaction.user.id });

        const res = await getData(textInput, speaker || user?.voice || 'en_us_002');

        if (!res) return interaction.editReply({
            content: `> <:dnd_status:949003440091201587> Something went wrong playing this file. A shorter text might fix it!\n${Config.ad}`
        });

        mp3Duration(res, async (err: any, duration: number) => {

            if (!interaction.guild?.voiceAdapterCreator) return;
            const connection = joinVoiceChannel({
                channelId: member?.voice.channelId || '',
                guildId: interaction.guildId || '',
                adapterCreator: interaction.guild?.voiceAdapterCreator
            });

            (client as any)._playing[interaction.guild?.id || ''] = interaction.user.id;
            (client as any)._disconnect[interaction.guild?.id || ''] = new Date().getTime();

            const player = await createAudioPlayer();
            const resource = await createAudioResource(res)

            await connection.subscribe(player);
            await player.play(resource);

            await interaction.editReply({ content: `> <:online_status:949003338186383491> Now playing in <#${member?.voice.channelId}>, it's **${duration} seconds** long\n${Config.ad}` });
            setTimeout(() => {
                fs.unlink(res, () => null);
                delete (client as any)._playing[interaction.guild?.id || ''];
            }, (duration * 1000) + 1000);

            setTimeout(() => {
                if (((client as any)._disconnect[interaction.guild?.id || ''] + ((duration * 1000) + 10000)) < new Date().getTime()) {
                    return connection.disconnect();
                }
            }, (duration * 1000) + 10000);

        });

    }
};