import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { ButtonStyle, CommandInteractionOptionResolver, ComponentType } from 'discord.js';
// @ts-ignore no types for package :(
import getAudioDurationInSeconds from 'get-audio-duration';
import fs from 'node:fs';

import { connections, isPlaying, disconnect, speakers } from '../../app';
import { validate } from '../../modules/voteValidation';
import { User, users } from '../../structures/user';
import { getData } from '../../modules/getData';
import { Config, Emote } from '../../config';
import { Command } from '../../typings';
import { guilds } from '../../structures/guilds';

export default {
    name: 'voice',
    description: 'Want to speak as me in a voicechannel?',
    options: [
        {
            name: 'text',
            description: 'What text should get transformed?',
            type: 3,
            maxLength: 300,
            required: true
        },
        {
            name: 'speaker',
            description: 'What voice should be used?',
            type: 3,
            choices: speakers
        }
    ],
    dm_permission: false,

    run: async (interaction) => {

        const member = await interaction.guild?.members.fetch(interaction.user.id).catch(() => null);
        if (!member?.voice.channelId){
            void interaction.reply({
                content: `${Emote.error} You're not connected to any Voice Channels.\n${Config.ad}`,
                ephemeral: true
            });

            return;
        }

        if (!interaction.guild?.members.me?.permissionsIn(member.voice.channelId).has(['ViewChannel', 'Connect', 'Speak'])){
            void interaction.reply({
                content: `${Emote.error} I'm not able to **View**/**Connect** to/**Speak** in your Voice Channel.\n${Config.ad}`,
                ephemeral: true
            });

            return;
        }

        if (isPlaying.get(interaction.guildId || '')) {
            void interaction.reply({
                content: `${Emote.error} Please wait until the current audio by <@${isPlaying.get(interaction.guildId || '')}> is done playing.\n${Config.ad}`,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                style: ButtonStyle.Link,
                                url: 'https://discord.com/oauth2/authorize?client_id=1125449347451068437&redirect_uri=https://wamellow.com/login&response_type=code&permissions=1426738113654&prompt=none&scope=identify+guilds+bot',
                                emoji: '<:BlahajReach:1213502811870986321>',
                                label: 'Get a 2nd Text to Speech bot for Voice Channels'
                            }
                        ]
                    }
                ],
                ephemeral: true
            });

            return;
        }

        if (!interaction.guild?.voiceAdapterCreator) return;
        await interaction.deferReply({
            ephemeral: !interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(['ViewChannel', 'SendMessages'])
        })
            .catch(() => null);

        const textInput: string = (interaction.options as CommandInteractionOptionResolver).getString('text') || '';
        const speaker: string = (interaction.options as CommandInteractionOptionResolver).getString('speaker') || '';

        const user = await users.findOne({ user: interaction.user.id });
        if (!await validate(interaction, user as User)) return;

        const res = await getData(textInput, speaker || user?.voice || 'en_us_002');
        if (!res) {
            void interaction.editReply({
                content: `${Emote.error} Something went wrong playing this file. **This often happens because of a language-input missmatch!**\n${Config.ad}`
            });

            return;
        }

        const guild = await guilds.findOne({ guild: interaction.guildId });
        const duration: number = await getAudioDurationInSeconds(res);

        const connection = joinVoiceChannel({
            // @ts-ignore wha
            adapterCreator: interaction.guild.voiceAdapterCreator,
            channelId: member?.voice.channelId || '',
            guildId: interaction.guildId || '',
        });

        connections.set(interaction.guildId || '', connection);
        isPlaying.set(interaction.guildId || '', interaction.user.id);
        disconnect.set(interaction.guildId || '', new Date().getTime());

        const player = createAudioPlayer();
        const resource = createAudioResource(res);

        connection.subscribe(player);
        player.play(resource);

        await interaction.editReply({ content: `${Emote.success} Now playing in <#${member?.voice.channelId}> for **${duration} seconds**.\n${Config.ad}` });

        setTimeout(() => {
            fs.unlink(res, () => null);
            isPlaying.delete(interaction.guildId || '');
        }, (duration * 1000) + 1000);

        setTimeout(() => {
            if (((disconnect.get(interaction.guildId || '') ?? 0) + ((duration * 1000) + (guild?.voiceTimeout ?? 30) * 1000)) < new Date().getTime()) {
                try {
                    connection.disconnect();
                    isPlaying.delete(interaction.guildId || '');
                    connections.delete(interaction.guildId || '');
                    disconnect.delete(interaction.guildId || '');
                } catch (e) { console.log(e); }
            }
        }, (duration * 1000) + (guild?.voiceTimeout ?? 30) * 1000);
    }
} as Command;