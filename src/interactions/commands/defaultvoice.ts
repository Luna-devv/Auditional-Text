import { CommandInteractionOptionResolver } from 'discord.js';
import { users } from '../../structures/user';
import { Config, Emote } from '../../config';
import { Command } from '../../typings';
import { speakers } from '../../app';

export default {
    name: 'defaultvoice',
    description: 'What should be the default speaker used for you?',
    options: [
        {
            name: 'speaker',
            description: 'What voice should be used?',
            type: 3,
            choices: speakers,
            required: true
        }
    ],
    dm_permission: true,

    run: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        let user = await users.findOne({ user: interaction.user.id });
        if (!user) user = await users.create({ user: interaction.user.id });

        user.voice = (interaction.options as CommandInteractionOptionResolver).getString('speaker') || 'en_us_002';
        await user.save();

        interaction.editReply({
            content: `${Emote.success} Your default voice has been set to \`${user.voice}\`!\n${Config.ad}`,
        });
    }
} as Command;