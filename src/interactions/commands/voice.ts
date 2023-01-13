import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
// @ts-ignore
import mp3Duration from 'mp3-duration';
import fs from 'node:fs';

import { Config, Emote } from '../../config';
import { getData } from '../../modules/getData';
import { User, users } from '../../structures/user';
import { Command } from '../../typings';
import { connections, isPlaying, disconnect } from '../../app';
import { validate } from '../../modules/voteValidation';

export default {
    name: 'voice',
    run: async (client, interaction) => {

        if (!interaction.guild?.members.me?.permissionsIn(interaction.channel?.id || '').has(['ViewChannel', 'SendMessages'])) return interaction.reply({
            content: `${Emote.error} I'm not able to send messages in this channel.\n${Config.ad}`,
            ephemeral: true
        });

        const member = interaction.guild?.members.cache.get(interaction.user.id) || await interaction.guild?.members.fetch(interaction.user.id).catch(() => null);
        if (!member?.voice.channelId) return interaction.reply({
            content: `${Emote.error} You're not connected to any Voice Channels.\n${Config.ad}`,
            ephemeral: true
        });

        if (!interaction.guild?.members.me?.permissionsIn(member.voice.channelId).has(['ViewChannel', 'Connect', 'Speak'])) return interaction.reply({
            content: `${Emote.error} I'm not able to Connect/Speak in your Voice Channel.\n${Config.ad}`,
            ephemeral: true
        });

        if (isPlaying.get(interaction.guildId || '')) return interaction.reply({
            content: `${Emote.error} Please wait until the current audio by <@${isPlaying.get(interaction.guildId || '')}> is done playing.\n${Config.ad}`,
            ephemeral: true
        });

        await interaction.deferReply();
        // @ts-expect-error I dont understand those djs typings
        const textInput: string = interaction.options.getString('text');
        // @ts-expect-error I dont understand those djs typings
        const speaker: string = interaction.options.getString('speaker');
        const user = await users.findOne({ user: interaction.user.id });

        if (!await validate(interaction, user as User)) return;

        const res = await getData(textInput, speaker || user?.voice || 'en_us_002');

        if (!res) return interaction.editReply({
            content: `${Emote.error} Something went wrong playing this file. A shorter text might fix it!\n${Config.ad}`
        });

        mp3Duration(res, async (err: unknown, duration: number) => {
            if (!interaction.guild?.voiceAdapterCreator) return;

            const connection = joinVoiceChannel({
                channelId: member?.voice.channelId || '',
                guildId: interaction.guildId || '',
                adapterCreator: interaction.guild?.voiceAdapterCreator
            });
            connections.set(interaction.guildId || '', connection);

            isPlaying.set(interaction.guildId || '', interaction.user.id);
            disconnect.set(interaction.guildId || '', new Date().getTime());

            const player = createAudioPlayer();
            const resource = createAudioResource(res);

            connection.subscribe(player);
            player.play(resource);

            await interaction.editReply({ content: `${Emote.success} Now playing in <#${member?.voice.channelId}>, it's **${duration} seconds** long\n${Config.ad}` });
            setTimeout(() => {
                fs.unlink(res, () => null);
                isPlaying.delete(interaction.guildId || '');
            }, (duration * 1000) + 1000);

            setTimeout(() => {
                if (((disconnect.get(interaction.guildId || '') ?? 0) + ((duration * 1000) + 30_000)) < new Date().getTime()) {
                    try {
                        connection.disconnect();
                        isPlaying.delete(interaction.guildId || '');
                        connections.delete(interaction.guildId || '');
                        disconnect.delete(interaction.guildId || '');
                    } catch (e) { console.log(e); }
                }
            }, (duration * 1000) + 30_000);

        });

    }
} as Command;