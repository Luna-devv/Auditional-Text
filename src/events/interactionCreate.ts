import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction } from 'discord.js';
import ms from 'ms';

import { stats } from '../app';
import { Config } from '../config';
import { Command } from '../typings';

export default {
    name: 'interactionCreate',
    run: async (interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction) => {
        const { client } = interaction;
        if (!client.isReady()) return;

        stats.num++;
        console.log(`${new Date().toISOString()} :: ${stats.num} :: ${ms(client.uptime ?? 0)}`);


        if (interaction.isChatInputCommand()) {
            const command: Command | undefined = await Config.data.interactions.commands.get(interaction.commandName);
            if (!command) return;

            if (!command.dm && !interaction.guild?.id) {
                interaction.reply({
                    content: '> <:dnd_status:949003440091201587> This command can only be used inside of a server.',
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 5,
                                    label: 'Learn about Waya',
                                    url: 'https://waya.one',
                                    emoji: '<a:c_prideblob:932368100832202783>'
                                },
                                {
                                    type: 2,
                                    style: 5,
                                    label: 'Invite Auditional Text',
                                    url: 'https://discord.com/api/oauth2/authorize?client_id=985213199248924722&permissions=3197952&scope=bot%20applications.commands',
                                    emoji: '<:icons_audioenable:875395222291513354>'
                                },
                                {
                                    type: 2,
                                    style: 5,
                                    label: 'TikTok',
                                    url: 'https://lunish.nl/tiktok-01',
                                    emoji: '<:Icons_tiktok:941672576449654804>'
                                }
                            ]
                        }
                    ],
                    ephemeral: true
                });
                return;
            }

            command?.run(client, interaction);
        }
    }
};