import { Guild, TextChannel } from 'discord.js';
import { Config } from '../config';

export default {
    name: 'guildCreate',

    run: async (guild: Guild) => {

        if (Config.guildLogging) fetch(`https://discord.com/api/channels/${Config.guildLogging}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bot ${guild.client.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: `<:tick:1028684977975607378> Joined **${guild.name}** with ${guild.memberCount} members` })
        });

        let channel: TextChannel | null = null;
        if (
            guild.systemChannelId &&
            guild.members.me?.permissionsIn(guild.systemChannelId).has(['ViewChannel', 'SendMessages', 'EmbedLinks'])
        )
            channel = guild.systemChannel;

        if (
            !channel &&
            guild.publicUpdatesChannelId &&
            guild.members.me?.permissionsIn(guild.publicUpdatesChannelId).has(['ViewChannel', 'SendMessages', 'EmbedLinks'])
        )
            channel = guild.publicUpdatesChannel;

        if (channel)
            channel.send({
                embeds: [
                    {
                        title: 'Thanks for adding me to your server!',
                        description: 'To start using me, run either `/mp3` or `/voice`.\nIf you need help, join [our Support Server](https://discord.gg/w4QY2mhe3x) and ask us in #getting-help.',
                        color: 0x03e6b1,
                        image: {
                            url: 'https://cdn.waya.one/r/tts.png',
                        },
                    },
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: 'Add Waya - Best multipurpose bot!',
                                style: 5,
                                url: 'https://discord.com/oauth2/authorize?client_id=857230367350063104&permissions=1376470297718&scope=bot+applications.commands',
                                emoji: '<a:nyaYay:978360208151687259>',
                            }
                        ]
                    }
                ]
            });

    }
};