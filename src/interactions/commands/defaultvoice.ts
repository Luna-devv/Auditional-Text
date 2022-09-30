import { Client, CommandInteraction } from "discord.js";
import { Config } from "../../config";
import Users from "../../structures/user";

export default {
    name: 'defaultvoice',
    run: async (client: Client, interaction: CommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });

        let user = await Users.findOne({ user: interaction.user.id });
        if (!user) user = await Users.create({ user: interaction.user.id });

        //@ts-ignore
        user.voice = interaction.options.getString('speaker');
        await user.save();

        interaction.editReply({
            content: `> <:online_status:949003338186383491> Your default voice has been set to \`${user.voice}\`!\n${Config.ad}`,
        });

    }
};
