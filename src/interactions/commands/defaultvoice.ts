import { Config, Emote } from '../../config';
import { users } from '../../structures/user';
import { Command } from '../../typings';

export default {
    name: 'defaultvoice',
    dm: true,
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        let user = await users.findOne({ user: interaction.user.id });
        if (!user) user = await users.create({ user: interaction.user.id });

        // @ts-expect-error I dont understand those djs typings
        user.voice = interaction.options.getString('speaker');
        await user.save();

        interaction.editReply({
            content: `${Emote.success} Your default voice has been set to \`${user.voice}\`!\n${Config.ad}`,
        });

    }
} as Command;