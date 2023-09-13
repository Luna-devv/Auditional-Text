import { Command } from '../../typings';

export default {
    name: 'help',
    description: 'Need some help?',
    dm_permission: true,

    run: async (interaction) => {
        interaction.reply({
            embeds: [
                {
                    description: `**${interaction.client.user?.username}**\nWith me you're able to either convert text to .mp3 files for you to download (</mp3:1004817057768034314>), or to speak messages for you in a voice channel using </voice:1004817057768034315>. Note that there is a character limit of 300.\n\n**Developers**\n[\`Coffee Girl#8888\`](https://lunish.nl?utm_source=Auditional+Text&utm_content=help+command) - Voice Conversion, Bot\n[\`Luna's Girlfriend\`](https://crni.xyz/?utm_source=Auditional+Text&utm_content=help+command) - Stable code`,
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
                            label: 'About Waya',
                            url: 'https://waya.one',
                            emoji: '<:c_prideblob:932368100832202783>'
                        },
                        {
                            type: 2,
                            style: 5,
                            label: 'Support Server',
                            url: 'https://discord.com/invite/w4QY2mhe3x',
                            emoji: '<:icons_discord:988409375905443900>'
                        },
                        {
                            type: 2,
                            style: 5,
                            label: 'Vote for Auditional Text',
                            url: 'https://top.gg/bot/985213199248924722/vote',
                            emoji: '<:icons_topgg:988409375905443900>'
                        },
                    ],
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            label: 'Invite Auditional Text',
                            url: 'https://discord.com/api/oauth2/authorize?client_id=985213199248924722&permissions=3197952&scope=bot%20applications.commands',
                            emoji: '<:TTS:1111729122025156708>'
                        },
                        {
                            type: 2,
                            style: 5,
                            label: 'Invite Textional Voice',
                            url: 'https://discord.com/api/oauth2/authorize?client_id=1097907896987160666&permissions=309239007232&scope=applications.commands%20bot',
                            emoji: '<:VTT:1111728972158472383>'
                        },
                    ],
                },
            ],
        });
    }
} as Command;