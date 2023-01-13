import fs from 'node:fs';

import { Config } from '../../config';
import { getData } from '../../getData';
import { Command } from '../../typings';
import Users from '../../structures/user';

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
        const user = await Users.findOne({ user: interaction.user.id });

        const res = await getData(textInput, speaker || user?.voice || 'en_us_002');
        if (!res) return interaction.editReply({
            content: `> <:dnd_status:949003440091201587> Something went wrong playing this file. A shorter text might fix it!\n${Config.ad}`
        });

        await interaction.editReply({
            content: `> <:online_status:949003338186383491> Here's your audio file!\n${Config.ad}`,
            files: [res]
        });

        setTimeout(() => {
            fs.unlink(res, () => null);
        }, 4 * 1000);

    }
} as Command;