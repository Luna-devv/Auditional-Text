import fs from 'node:fs';

import { validate } from '../../modules/voteValidation';
import { User, users } from '../../structures/user';
import { getData } from '../../modules/getData';
import { ContextCommand } from '../../typings';
import { Config, Emote } from '../../config';

export default {
    name: 'Convert to Audio',
    dm_permission: false,

    run: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.targetMessage?.content) return interaction.editReply({
            content: `${Emote.error} I can't convert an empty message to an mp3!\n${Config.ad}`
        });

        const user = await users.findOne({ user: interaction.user.id });
        if (!await validate(interaction, user as User)) return;

        const res = await getData(interaction.targetMessage?.content, user?.voice || 'en_us_002');
        if (!res) return interaction.editReply({
            content: `${Emote.error} Something went wrong playing this file. A shorter text might fix it!\n${Config.ad}`
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
} as ContextCommand;