import { Command } from '../../typings';

export default {
    name: 'help',
    description: 'Need some help?',
    dm_permission: true,

    run: async (interaction) => {
        interaction.reply({
            embeds: [
                {
                    description: `**${interaction.client.user?.username}**\nWith me you're able to either convert text to .mp3 files for you to download (\`/mp3\`), or to speak messages for you in a voice channel using \`/voice\`. Note that there is a character limit of 300.\n\n**Developers**\n[\`Coffee Girl#8888\`](https://lunish.nl/luna) - Voice Conversion, Bot\n[\`NotFound.sh#3105\`](https://tayronm.tech) - Voice Channel Management`,
                    thumbnail: {
                        url: `https://cdn.discordapp.com/avatars/${interaction.client.user?.id}/${interaction.client.user?.avatar}.${interaction.client.user?.avatar?.startsWith('a_') ? 'gif' : 'png'}?size=1024`
                    },
                    color: 0xe79da2
                }
            ],
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
                            label: 'Vote for Auditional Text',
                            url: 'https://top.gg/bot/985213199248924722/vote',
                            emoji: '<:icons_topgg:988409375905443900>'
                        },
                    ]
                }
            ]
        });
    }
} as Command;