import { Client, CommandInteraction } from "discord.js";
import fs from 'fs';
import { Config } from "../../config";

export default {
    name: 'mp3',
    run: async (client: Client, interaction: CommandInteraction) => {
        await interaction.deferReply({ ephemeral: !interaction.guild?.members.me?.permissionsIn(interaction.channel?.id || '').has(['ViewChannel', 'SendMessages', 'AttachFiles']) });

        //@ts-ignore
        const textInput: string = interaction.options.getString('text');
        //@ts-ignore
        const speaker: string = interaction.options.getString('speaker');

        const res = await fetch(Config.api + (speaker || 'en_us_002') + '&req_text=' + textInput.replace(/ +/g, '%20').slice(0, 300), { method: 'POST' });
        const data = await res.json();

        const name: string = `${interaction.user.id}.mp3`;
        await fs.writeFileSync(name, Buffer.from(data.data.v_str.replace('data:audio/mp3; codecs=opus;base64,', ''), 'base64'))

        await interaction.editReply({
            content: '<:online_status:949003338186383491> Here\'s your audio file',
            files: [`./${name}`]
        });

        setTimeout(() => {
            fs.unlink(`./${name}`, () => null);
        }, 4 * 1000);
    }
};