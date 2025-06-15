import { ButtonStyle, CommandInteraction, ComponentType } from 'discord.js';

import { Selectable } from 'kysely';
import { Config, Emote } from '../config';
import { DatabaseUser, db } from '../db';

/*
*   True: can run command
*   False: must vote / error happened
*/
export async function validate(interaction: CommandInteraction, user?: Pick<Selectable<DatabaseUser>, 'command_uses' | 'verification_valid_until'>): Promise<true | false> {
    if (new Date().getDay() !== 5 && new Date().getDay() !== 6 && new Date().getDay() !== 0) return true;
    if (!Config.verification.enabled) return true;

    if (!Config.apis.votes) throw new TypeError('"api.votes" was not defined but "verification.enabled" is set to true.');
    if (!Config.apis.votes_authorization) throw new TypeError('"api.votes" was not defined but "verification.enabled" is set to true.');

    if (!user) {
        await db
            .insertInto('users')
            .values({
                id: interaction.user.id,
                command_uses: 1
            })
            .execute();

        return true;
    }

    const now = Date.now();

    if (
        (user.command_uses + 1) <= Config.verification?.freeUse ||
        (user.verification_valid_until || 0) > now
    ) {
        await db
            .updateTable('users')
            .where('id', '=', interaction.user.id)
            .set({
                command_uses: user.command_uses + 1
            })
            .execute();

        return true;
    }

    const res = await fetch(`${Config.apis.votes}/${interaction.user.id}`, {
        headers: {
            authorization: Config.apis.votes_authorization
        }
    });

    if (!res.ok && res?.status !== 400) {
        void interaction.editReply({
            content: `${Emote.error} There was an error talking with our database.\n${Config.ad}`
        });

        throw new Error(`There was an error fetching from "${Config.apis.votes}/${interaction.user.id}"`);
    }

    const data = await res.json();

    if (user.verification_valid_until !== data.message && !isNaN(data.message)) {
        await db
            .updateTable('users')
            .where('id', '=', interaction.user.id)
            .set({
                verification_valid_until: data.message || 0
            })
            .execute();
    }

    if (data.message < now || isNaN(data.message)) {
        interaction.editReply({
            content: `${Config.ad}`,
            embeds: [
                {
                    title: '<:dnd_status:949003440091201587> We\'re experiencing exceptionally high demand',
                    description: `To verify that you are a real person (and to help us grow), we ask you to [vote for us on Top.gg](${Config.verification.url}). After that, you can use our features as many times as you want!\nWe thank you for your understanding! <a:doggolove:932368331179196446>`
                }
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: 'Pass This Check',
                            url: Config.verification.url,
                            emoji: {
                                animated: true,
                                name: 'toliet',
                                id: '828166715547320350'
                            }
                        }
                    ]
                }
            ]
        });

        return false;
    }

    return true;
}