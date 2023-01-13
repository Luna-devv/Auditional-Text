import fs from 'node:fs';

import { Config, Emote } from '../../config';
import { getData } from '../../modules/getData';
import { Command } from '../../typings';
import { User, users } from '../../structures/user';
import { validate } from '../../modules/voteValidation';

export default {
    name: 'mp3',
    dm: true,
    run: async (client, interaction) => {

        // @ts-expect-error I dont understand those djs typings
        const visibility: string = interaction.options.getString('visibility');

        await interaction.deferReply({ ephemeral: !interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(['ViewChannel', 'SendMessages', 'AttachFiles']) || visibility === 'hidden' });

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

        await interaction.editReply({
            content: `${Emote.success} Here's your audio file!\n${Config.ad}`,
            files: [res]
        });

        setTimeout(() => {
            fs.unlink(res, () => null);
        }, 4 * 1000);

    }
} as Command;