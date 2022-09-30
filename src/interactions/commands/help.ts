import { Client, CommandInteraction } from "discord.js";

export default {
    name: 'help',
    run: async (client: Client, interaction: CommandInteraction) => {

        interaction.reply({
            embeds: [
                {
                    description: `**${client.user?.username}**\nWith me you're able to either convert text to .mp3 files for you to download (\`/mp3\`), or to speak messages for you in a voice channel using \`/voice\`. Note that there is a character limit of 300.\n\n**Developers**\n[\`Luny#8888\`](https://lunish.nl/luna) - Voice Convertion, Bot\n[\`NotFound.sh#3105\`](https://tayronm.tech) - Voice Channel Management`,
                    thumbnail: {
                        url: `https://cdn.discordapp.com/avatars/${client.user?.id}/${client.user?.avatar}.${client.user?.avatar?.startsWith('a_') ? 'gif' : 'png'}?size=1024`
                    },
                    color: parseInt('e79da2', 16)
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
                            url: `https://waya.one`,
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
};
