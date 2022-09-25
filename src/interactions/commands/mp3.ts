import { Client, CommandInteraction } from "discord.js";
import fs from 'fs';
import { Config } from "../../config";
import { getData } from "../../getData";

export default {
    name: 'mp3',
    run: async (client: Client, interaction: CommandInteraction) => {

        //@ts-ignore
        const visibility: string = interaction.options.getString('visibility');

        await interaction.deferReply({ ephemeral: !interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(['ViewChannel', 'SendMessages', 'AttachFiles']) || visibility === 'hidden' });

        //@ts-ignore
        const textInput: string = interaction.options.getString('text');
        //@ts-ignore
        const speaker: string = interaction.options.getString('speaker');

        const res = await getData(textInput, speaker || 'en_us_002');
        if (!res) return interaction.editReply({
            content: `> <:dnd_status:949003440091201587> Something went wrong playing this file. A shorter text might fix it!\n${Config.ad}`
        });

        await interaction.editReply({
            content: `> <:online_status:949003338186383491> Here\'s your audio file!\n${Config.ad}`,
            files: [res]
        });

        setTimeout(() => {
            fs.unlink(res, () => null);
        }, 4 * 1000);

    }
};