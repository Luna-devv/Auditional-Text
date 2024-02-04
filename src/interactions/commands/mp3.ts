import { CommandInteractionOptionResolver } from 'discord.js';
import fs from 'node:fs';

import { validate } from '../../modules/voteValidation';
import { User, users } from '../../structures/user';
import { getData } from '../../modules/getData';
import { Config, Emote } from '../../config';
import { Command } from '../../typings';
import { speakers } from '../../app';

export default {
    name: 'mp3',
    description: 'Want to convert a Text to a nice MP3?',
    options: [
        {
            name: 'text',
            description: 'What text should get transformed?',
            type: 3,
            maxLength: 300,
            required: true
        },
        {
            name: 'visibility',
            description: 'Should others be able to see what you do?',
            type: 3,
            choices: [
                {
                    name: 'public',
                    value: 'public',
                },
                {
                    name: 'hidden',
                    value: 'hidden',
                },
            ],
        },
        {
            name: 'speaker',
            description: 'What voice should be used?',
            type: 3,
            choices: speakers
        }
    ],
    dm_permission: true,

    run: async (interaction) => {
        const visibility = (interaction.options as CommandInteractionOptionResolver).getString('visibility') || 'visible';

        await interaction.deferReply({ ephemeral: !interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(['ViewChannel', 'SendMessages', 'AttachFiles']) || visibility === 'hidden' });

        const textInput = (interaction.options as CommandInteractionOptionResolver).getString('text') || 'No text provided';
        const speaker = (interaction.options as CommandInteractionOptionResolver).getString('speaker') || 'en_us_002';

        const user = await users.findOne({ user: interaction.user.id });
        if (!await validate(interaction, user as User)) return;

        const res = await getData(textInput, speaker || user?.voice || 'en_us_002');
        if (!res) return interaction.editReply({
            content: `${Emote.error} Something went wrong playing this file. This often happens because of a language-input missmatch!\n${Config.ad}`
        });

        await interaction.editReply({
            content: Config.ad,
            files: [{
                attachment: res,
                name: new Date().toISOString().replace('T', ' ').replace('Z', '') + '.mp3'
            }]
        });

        setTimeout(() => {
            fs.unlink(res, () => null);
        }, 4 * 1000);
    }
} as Command;