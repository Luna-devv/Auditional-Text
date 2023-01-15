import { CommandInteraction } from 'discord.js';

import { users, User } from '../structures/user';
import { Config, Emote } from '../config';

/*
*   True: can run command
*   False: must vote / error happened
*/

export async function validate(interaction: CommandInteraction, user: User | undefined): Promise<true | false> {
    if (new Date().getDay() !== 5 && new Date().getDay() !== 6 && new Date().getDay() !== 7) return true;
    if (!Config.verification.enabled) return true;

    if (!Config.apis.votes) throw new TypeError('"api.votes" was not defined but "verification.enabled" is set to true.');
    if (!Config.apis.votes_authorization) throw new TypeError('"api.votes" was not defined but "verification.enabled" is set to true.');

    if (!user) user = await users.create({ user: interaction.user.id }) as User;
    const freeUse = user.votes.uses < Config.verification?.freeUse;

    if (freeUse) user.votes.uses++;

    if (
        (user.votes.uses + 1) <= Config.verification?.freeUse ||
        new Date(user.votes.voteEndsCache ?? 0).getTime() > new Date().getTime()
    ) {
        if (freeUse) user.save();
        return true;
    }

    const res = await fetch(`${Config.apis.votes}/${interaction.user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: Config.apis.votes_authorization
        }
    }).catch(() => null);

    if (!res?.ok) {
        interaction.editReply({
            content: `${Emote.error} There was an error talking with our database..\n${Config.ad}`
        });

        throw new Error(`There was an error fetching from "${Config.apis.votes}/${interaction.user.id}"`);
    }

    const data = await res.json();

    if (user.votes.voteEndsCache !== data.message && data.message) {
        console.log(`\x1b[44m${interaction.user.id} maybe voted.\x1b[0m`);
        user.votes.voteEndsCache = new Date(data.message ?? 0);
        user.save();
    }

    if (new Date(data.message).getTime() < new Date().getTime()) {
        interaction.editReply({
            content: `${Config.ad}`,
            embeds: [
                {
                    title: '<:dnd_status:949003440091201587> We\'re experiencing exceptionally high demand',
                    description: 'To verify that you are a real person (and to help us grow), we ask you to [vote for us on Top.gg](https://top.gg/bot/857230367350063104/vote). After that, you can use our features as many times as you want!\nWe thank you for your understanding! <a:doggolove:932368331179196446>'
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            label: 'Pass This Check',
                            url: 'https://top.gg/bot/857230367350063104/vote',
                            emoji: '<a:toliet:828166715547320350>'
                        }
                    ]
                }
            ]
        });

        return false;
    }

    return true;
}